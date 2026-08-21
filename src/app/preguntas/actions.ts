'use server';

import { revalidatePath } from 'next/cache';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { questions } from '@/db/schema';
import { cleanName } from '@/lib/name';
import { QUESTION_GRACE_MS, QUESTION_MAX, QUESTION_MIN, type AskState } from '@/lib/questions';
import { requireParticipant } from '@/lib/session';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

/**
 * Deja una pregunta en el buzón de la capacitación.
 *
 * El nombre es opcional aunque la sesión sepa quién es: quien entró al portal
 * ya dio su nombre para la lista de asistencia, y eso no obliga a firmar lo que
 * pregunta. Marcada como anónima no se guarda ni el nombre ni el vínculo con el
 * participante, así que después nadie puede deshacerlo, ni siquiera el admin.
 */
export async function ask(prev: AskState, formData: FormData): Promise<AskState> {
  const participant = await requireParticipant('/preguntas');

  const body = str(formData, 'pregunta').slice(0, QUESTION_MAX);
  const anonymous = formData.get('anonimo') === 'on';
  const name = cleanName(str(formData, 'nombre'));

  if (body.length < QUESTION_MIN) {
    // El envío anterior viaja con el error: el formulario usa esa marca de
    // llave y perderla le borraría al asistente lo que acaba de escribir.
    return { ...prev, error: 'Escribe la pregunta completa, con un poco más de detalle.' };
  }

  // Doble envío por recargar o por darle dos veces: la misma pregunta del mismo
  // código en la última hora no se guarda otra vez.
  const repeated = await db.query.questions.findFirst({
    where: and(eq(questions.accessCodeId, participant.accessCodeId), eq(questions.body, body)),
    orderBy: [desc(questions.createdAt)],
  });

  if (repeated && Date.now() - repeated.createdAt.getTime() < 60 * 60 * 1000) {
    return { sentAt: Date.now(), questionId: repeated.id };
  }

  const [saved] = await db
    .insert(questions)
    .values({
      accessCodeId: participant.accessCodeId,
      participantId: anonymous ? null : participant.id,
      name: anonymous ? null : name || null,
      anonymous,
      body,
      updatedAt: new Date(),
    })
    .returning({ id: questions.id });

  revalidatePath('/preguntas');
  return { sentAt: Date.now(), questionId: saved.id };
}

/**
 * Borra la propia pregunta recién hecha, mientras dure la ventana de gracia.
 *
 * Solo alcanza a las firmadas: en las anónimas no guardamos de quién son, así
 * que no hay forma de comprobar que quien borra es quien preguntó, y averiguarlo
 * sería romper justo lo que se prometió. Tampoco se borra una ya respondida:
 * ahí la conversación es de dos.
 */
export async function unask(formData: FormData) {
  const participant = await requireParticipant('/preguntas');
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return;

  const question = await db.query.questions.findFirst({ where: eq(questions.id, id) });
  if (!question) return;

  const own =
    !question.anonymous &&
    question.participantId === participant.id &&
    question.accessCodeId === participant.accessCodeId;

  if (!own) return;
  if (question.status !== 'abierta') return;
  if (Date.now() - question.createdAt.getTime() > QUESTION_GRACE_MS) return;

  await db.delete(questions).where(eq(questions.id, id));
  revalidatePath('/preguntas');
}
