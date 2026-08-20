'use server';

import { revalidatePath } from 'next/cache';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { questions } from '@/db/schema';
import { cleanName } from '@/lib/name';
import { requireParticipant } from '@/lib/session';

/** Lo que cabe en una pregunta. Corta obliga a escribir algo; larga es un correo. */
export const QUESTION_MIN = 8;
export const QUESTION_MAX = 800;

export type AskState = {
  error?: string;
  ok?: boolean;
  values?: { body: string; name: string; anonymous: boolean };
};

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

/**
 * Deja una pregunta en el buzón de la capacitación.
 *
 * El nombre es opcional aunque la sesión sepa quién es: quien entró al portal
 * ya dio su nombre para la lista de asistencia, y eso no obliga a firmar lo que
 * pregunta. Marcada como anónima no se guarda ni el nombre ni el vínculo con el
 * participante, así que después nadie puede deshacerlo, ni siquiera el admin.
 */
export async function ask(_prev: AskState, formData: FormData): Promise<AskState> {
  const participant = await requireParticipant('/preguntas');

  const body = str(formData, 'pregunta').slice(0, QUESTION_MAX);
  const anonymous = formData.get('anonimo') === 'on';
  const name = cleanName(str(formData, 'nombre'));
  const values = { body, name, anonymous };

  if (body.length < QUESTION_MIN) {
    return { error: 'Escribe la pregunta completa, con un poco más de detalle.', values };
  }

  // Doble envío por recargar o por darle dos veces: la misma pregunta del mismo
  // código en la última hora no se guarda otra vez.
  const repeated = await db.query.questions.findFirst({
    where: and(eq(questions.accessCodeId, participant.accessCodeId), eq(questions.body, body)),
    orderBy: [desc(questions.createdAt)],
  });

  if (repeated && Date.now() - repeated.createdAt.getTime() < 60 * 60 * 1000) {
    return { ok: true };
  }

  await db.insert(questions).values({
    accessCodeId: participant.accessCodeId,
    participantId: anonymous ? null : participant.id,
    name: anonymous ? null : name || null,
    anonymous,
    body,
    updatedAt: new Date(),
  });

  revalidatePath('/preguntas');
  return { ok: true };
}
