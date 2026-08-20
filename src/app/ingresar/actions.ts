'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodes, participants } from '@/db/schema';
import { codeProblem, normalizeCode } from '@/lib/access-code';
import { DEMO_ACCESS } from '@/lib/demo-access';
import { cleanName, nameKeyOf } from '@/lib/name';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export type EnterState = {
  errors?: { code?: string; name?: string };
  values?: { code: string; name: string };
};

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

/** Solo rutas internas: evita que `?destino=` mande a otro dominio. */
function safeDestination(raw: string) {
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

/**
 * Entrada al portal: el código de la capacitación y el nombre, nada más. No hay
 * contraseña ni verificación, y es deliberado: detrás solo está el material que
 * el grupo ya comparte, así que no se pide ningún dato de contacto a cambio.
 */
export async function enter(_prev: EnterState, formData: FormData): Promise<EnterState> {
  const code = normalizeCode(str(formData, 'codigo'));
  const name = cleanName(str(formData, 'nombre'));
  const values = { code, name };

  const errors: EnterState['errors'] = {};

  const problem = codeProblem(code);
  if (problem) errors.code = problem;
  if (name.length < 2) errors.name = 'Escribe tu nombre.';

  if (Object.keys(errors).length > 0) return { errors, values };

  const accessCode = await db.query.accessCodes.findFirst({
    where: and(eq(accessCodes.code, code), eq(accessCodes.active, true)),
  });

  if (!accessCode) {
    return { errors: { code: 'Ese código no está activo. Confírmalo con el expositor.' }, values };
  }

  const token = await tokenFor(accessCode.id, name);

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  redirect(safeDestination(str(formData, 'destino')));
}

/**
 * Token de sesión de quien entra. El mismo nombre en la misma capacitación es
 * la misma fila: quien vuelve desde otro dispositivo no aparece dos veces en la
 * lista, y el `onConflictDoUpdate` devuelve el token que ya tenía.
 */
async function tokenFor(accessCodeId: number, name: string) {
  const [row] = await db
    .insert(participants)
    .values({
      accessCodeId,
      name,
      nameKey: nameKeyOf(name),
      token: randomUUID(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [participants.accessCodeId, participants.nameKey],
      // El nombre se refresca con la última forma en que la persona lo escribió,
      // así corregir una tilde o un apellido no crea a nadie nuevo.
      set: { name, lastSeenAt: new Date(), updatedAt: new Date() },
    })
    .returning({ token: participants.token });

  return row.token;
}

/**
 * Entrada de un clic para quien solo quiere mirar el portal: usa el código
 * demo público, sin pedir nada. Se autocrea si el seed todavía no corrió, para
 * que nunca falle en un deploy nuevo.
 */
export async function enterDemo(formData: FormData) {
  let accessCode = await db.query.accessCodes.findFirst({
    where: eq(accessCodes.code, DEMO_ACCESS.code),
  });

  if (!accessCode) {
    [accessCode] = await db
      .insert(accessCodes)
      .values({
        code: DEMO_ACCESS.code,
        label: DEMO_ACCESS.label,
        active: true,
        system: true,
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    accessCode ??= await db.query.accessCodes.findFirst({
      where: eq(accessCodes.code, DEMO_ACCESS.code),
    });
  }

  if (!accessCode || !accessCode.active) redirect('/ingresar');

  const token = await tokenFor(accessCode.id, DEMO_ACCESS.name);

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  redirect(safeDestination(str(formData, 'destino')));
}

export async function leave() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/ingresar');
}
