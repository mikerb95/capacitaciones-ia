'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodes, participants } from '@/db/schema';
import { normalizePhone } from '@/lib/phone';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export type EnterState = {
  errors?: { code?: string; name?: string; phone?: string };
  values?: { code: string; name: string; phone: string };
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
  const values = { code, name, phone: rawPhone };

  const errors: EnterState['errors'] = {};

  if (code.length !== 4) errors.code = 'El código son 4 dígitos.';
  if (name.length < 2) errors.name = 'Escribe tu nombre completo.';

  const phone = normalizePhone(rawPhone);
  if (!phone) errors.phone = 'Incluye el código de país y el número, sin espacios ni guiones.';

  if (Object.keys(errors).length > 0) return { errors, values };

  const accessCode = await db.query.accessCodes.findFirst({
    where: and(eq(accessCodes.code, code), eq(accessCodes.active, true)),
  });

  if (!accessCode) {
    return { errors: { code: 'Ese código no está activo. Confírmalo con el expositor.' }, values };
  }

  // Si la persona ya entró antes con el mismo teléfono, se reusa su registro:
  // así puede volver desde otro dispositivo sin duplicarse en la lista.
  const existing = await db.query.participants.findFirst({
    where: and(eq(participants.accessCodeId, accessCode.id), eq(participants.phone, phone!)),
  });

  const token = existing?.token ?? randomUUID();

  if (existing) {
    await db
      .update(participants)
      .set({ name, lastSeenAt: new Date(), updatedAt: new Date() })
      .where(eq(participants.id, existing.id));
  } else {
    await db.insert(participants).values({
      accessCodeId: accessCode.id,
      name,
      phone: phone!,
      token,
      updatedAt: new Date(),
    });
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
