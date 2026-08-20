import type { QuestionRow } from '@/db/queries';

const fechaHora = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

/** Cómo firma una pregunta: el nombre que dejaron, o el anonimato pedido. */
export function questionAuthor(question: QuestionRow) {
  if (question.anonymous) return 'Anónimo';
  return question.name ?? 'Sin nombre';
}

/**
 * Una pregunta con su respuesta, si ya la tiene. Se usa igual en el portal del
 * asistente, en el panel de la empresa y en el admin: es el mismo registro, y
 * conviene que se lea igual en los tres sitios.
 */
export function QuestionItem({
  question,
  children,
}: {
  question: QuestionRow;
  children?: React.ReactNode;
}) {
  const answered = question.status === 'respondida' && question.answer;

  return (
    <li className="border-b border-line px-5 py-4 last:border-0">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${answered ? 'bg-accent' : 'bg-primary/60'}`}
        />
        <span className="text-[12.5px] font-medium text-muted">{questionAuthor(question)}</span>
        <span className="text-[12px] text-faint">{fechaHora.format(question.createdAt)}</span>
        {!answered && (
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-faint">
            Sin responder
          </span>
        )}
      </div>

      <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed">{question.body}</p>

      {answered && (
        <div className="mt-3 rounded-[10px] bg-surface-2 px-4 py-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
            Respuesta
          </div>
          <p className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-muted">
            {question.answer}
          </p>
        </div>
      )}

      {children}
    </li>
  );
}

/** La lista entera, con su vacío. `empty` cambia según quién esté mirando. */
export function QuestionList({
  questions,
  empty,
  children,
}: {
  questions: QuestionRow[];
  empty: string;
  children?: (question: QuestionRow) => React.ReactNode;
}) {
  if (questions.length === 0) {
    return <p className="px-5 py-4 text-[13px] leading-relaxed text-faint">{empty}</p>;
  }

  return (
    <ul>
      {questions.map((question) => (
        <QuestionItem key={question.id} question={question}>
          {children?.(question)}
        </QuestionItem>
      ))}
    </ul>
  );
}
