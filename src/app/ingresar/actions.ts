'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodes, participants } from '@/db/schema';
import { codeProblem, normalizeCode } from '@/lib/access-code';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export type EnterState = {
  error?: string;
  value?: string;
};

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

/** Solo rutas internas: evita que `?destino=` mande a otro dominio. */
function safeDestination(raw: string) {
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

/**
 * Entrada al portal: el código de la capacitación y nada más. No hay nombre,
 * contraseña ni verificación, y es deliberado: detrás solo está el material que
 * el grupo ya comparte, así que no se pide ningún dato a cambio de mirarlo.
 */
export async function enter(_prev: EnterState, formData: FormData): Promise<EnterState> {
  const code = normalizeCode(str(formData, 'codigo'));

  const problem = codeProblem(code);
  if (problem) return { error: problem, value: code };

  const accessCode = await db.query.accessCodes.findFirst({
    where: and(eq(accessCodes.code, code), eq(accessCodes.active, true)),
  });

  if (!accessCode) {
    return { error: 'Ese código no está activo. Confírmalo con el expositor.', value: code };
  }

  const token = await anonymousToken(accessCode.id);

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
 * Sesión sin nombre: una fila por dispositivo, identificada por una clave
 * propia. La clave existe solo para que el índice único de la tabla siga
 * teniendo sentido y para que cada navegador lleve su propio avance; el nombre
 * se pide después, y solo donde de verdad hace falta.
 */
async function anonymousToken(accessCodeId: number) {
  const [row] = await db
    .insert(participants)
    .values({
      accessCodeId,
      name: null,
      nameKey: `anon:${randomUUID()}`,
      token: randomUUID(),
      updatedAt: new Date(),
    })
    .returning({ token: participants.token });

  return row.token;
}

export async function leave() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/ingresar');
}
