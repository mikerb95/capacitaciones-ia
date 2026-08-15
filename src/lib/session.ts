import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { participants } from '@/db/schema';

/** La cookie solo lleva un token opaco: el nombre vive en la base. */
export const SESSION_COOKIE = 'academia-acceso';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 90; // el trimestre de capacitación

/**
 * Sesión del asistente, verificada contra la base. El `cache` de React evita
 * repetir la consulta cuando varios componentes del mismo render la piden.
 */
export const getParticipant = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const found = await db.query.participants.findFirst({
    where: eq(participants.token, token),
    with: { accessCode: true },
  });

  // Si el código se desactiva desde el admin, la sesión deja de valer.
  if (!found || !found.accessCode.active) return null;

  return found;
});

/**
 * Para páginas que no deben verse sin registro. `destination` es a dónde volver
 * después de entrar; sin él se cae al inicio.
 */
export async function requireParticipant(destination?: string) {
  const participant = await getParticipant();
  if (participant) return participant;

  redirect(destination ? `/ingresar?destino=${encodeURIComponent(destination)}` : '/ingresar');
}

export type ParticipantSession = NonNullable<Awaited<ReturnType<typeof getParticipant>>>;
