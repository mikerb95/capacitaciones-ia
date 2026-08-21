import { QuestionForm } from '@/components/question-form';
import { QuestionList } from '@/components/question-list';
import { LeaveButton } from '@/components/leave-button';
import { SiteHeader } from '@/components/ui';
import { getTrainingQuestions } from '@/db/queries';
import { QUESTION_GRACE_MS } from '@/lib/questions';
import { requireParticipant } from '@/lib/session';
import { unask, vote } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Preguntas · Academia IA' };

/** El reloj, leído fuera del render: durante el render sería impuro. */
async function leerReloj() {
  return Date.now();
}

export default async function PreguntasPage() {
  const participant = await requireParticipant('/preguntas');
  const [questions, ahora] = await Promise.all([
    getTrainingQuestions(participant.accessCodeId, participant.id),
    leerReloj(),
  ]);

  const pendientes = questions.filter((q) => q.status === 'abierta').length;

  // Las que firmó quien está mirando. Las anónimas no salen de aquí: el
  // servidor no sabe de quién son, y la lista las reconoce por su cuenta con lo
  // que guardó el navegador al enviarlas.
  const propias = questions.filter((q) => !q.anonymous && q.participantId === participant.id);

  const borrables = propias.filter(
    (q) => q.status === 'abierta' && ahora - q.createdAt.getTime() < QUESTION_GRACE_MS,
  );

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Preguntas"
        subtitle={participant.accessCode.label}
        back={{ href: '/', label: 'Volver al portal' }}
      >
        <LeaveButton name={participant.name ?? undefined} />
      </SiteHeader>

      <main className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 py-8 sm:px-6">
        <section className="rounded-card border border-line bg-surface p-5 shadow-card">
          <h2 className="font-display text-[16px] font-semibold tracking-tight">
            ¿Qué te quedó dando vueltas?
          </h2>
          <p className="mt-1.5 mb-5 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
            Déjala aquí y la respondemos en la capacitación. Las preguntas quedan guardadas: se ven
            en esta página, en el panel de tu empresa y sirven para preparar las siguientes
            sesiones.
          </p>

          <QuestionForm name={participant.name ?? ''} />
        </section>

        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">
              Preguntas del grupo
            </h2>
            <span className="text-[12.5px] text-faint">
              {questions.length === 0
                ? 'todavía ninguna'
                : `${questions.length} en total${pendientes > 0 ? `, ${pendientes} sin responder` : ''}`}
            </span>
          </div>

          <QuestionList
            questions={questions}
            empty="Nadie ha preguntado nada todavía. Estrena el buzón: si tú tienes la duda, es probable que la tenga alguien más."
            ownIds={propias.map((q) => q.id)}
            removable={borrables.map((q) => q.id)}
            onRemove={unask}
            removeLabel="Me arrepentí, bórrala"
          />
        </section>
      </main>
    </div>
  );
}
