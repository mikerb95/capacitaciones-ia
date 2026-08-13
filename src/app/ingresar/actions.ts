'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodes, participants } from '@/db/schema';
import { DEFAULT_COUNTRY } from '@/lib/countries';
import { composePhone, expectedDigits } from '@/lib/phone';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export type EnterState = {
  /** `nombre` solo aparece cuando el teléfono no estaba registrado en ese código. */
  step?: 'nombre';
  errors?: { code?: string; name?: string; phone?: string };
  values?: { code: string; name: string; phone: string; country: string };
};

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

/** Solo rutas internas: evita que `?destino=` mande a otro dominio. */
function safeDestination(raw: string) {
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

export async function enter(_prev: EnterState, formData: FormData): Promise<EnterState> {
  const code = str(formData, 'codigo').replace(/\D/g, '');
  const name = str(formData, 'nombre').replace(/\s+/g, ' ');
  const rawPhone = str(formData, 'telefono');
  const country = str(formData, 'pais') || DEFAULT_COUNTRY;
  const values = { code, name, phone: rawPhone, country };

  const errors: EnterState['errors'] = {};

  if (code.length !== 4) errors.code = 'El código son 4 dígitos.';

  const phone = composePhone(country, rawPhone);
  if (!phone) {
    const digits = expectedDigits(country);
    errors.phone = digits
      ? `Ese país usa números de ${digits} dígitos, sin el indicativo.`
      : 'Elige un país de la lista.';
  }

  // Un error de código o teléfono devuelve al primer paso: son justo los campos
  // que hay que corregir, y el nombre ya escrito viaja en `values`.
  if (Object.keys(errors).length > 0) return { errors, values };

  const accessCode = await db.query.accessCodes.findFirst({
    where: and(eq(accessCodes.code, code), eq(accessCodes.active, true)),
  });

  if (!accessCode) {
    return { errors: { code: 'Ese código no está activo. Confírmalo con el expositor.' }, values };
  }

  // El teléfono es la identidad dentro de un código: quien ya entró antes vuelve
  // sin escribir el nombre otra vez, aunque sea desde otro dispositivo.
  const existing = await db.query.participants.findFirst({
    where: and(eq(participants.accessCodeId, accessCode.id), eq(participants.phone, phone!)),
  });

  let token: string;

  if (existing) {
    token = existing.token;
    await db
      .update(participants)
      .set({ lastSeenAt: new Date(), updatedAt: new Date() })
      .where(eq(participants.id, existing.id));
  } else {
    // Segundo paso: el campo solo existe en el formulario cuando ya sabemos que
    // el número es nuevo, así que su ausencia no es un error, es que falta pedirlo.
    if (!formData.has('nombre')) return { step: 'nombre', values };
    if (name.length < 2) {
      return { step: 'nombre', errors: { name: 'Escribe tu nombre completo.' }, values };
    }

    // `onConflictDoUpdate` cubre el doble envío: si la fila apareció entre la
    // consulta y el insert, se devuelve el token que ya tenía.
    const [row] = await db
      .insert(participants)
      .values({
        accessCodeId: accessCode.id,
        name,
        phone: phone!,
        token: randomUUID(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [participants.accessCodeId, participants.phone],
        set: { lastSeenAt: new Date(), updatedAt: new Date() },
      })
      .returning({ token: participants.token });

    token = row.token;
  }

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
