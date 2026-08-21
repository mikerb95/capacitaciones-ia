'use client';

import { useEffect, useState } from 'react';
import type { QuestionRow } from '@/db/queries';
import { ASKED_EVENT, ASKED_STORAGE_KEY, type AskState } from '@/lib/questions';

const fechaHora = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

/** Con menos preguntas que esto la lista se lee entera y los filtros estorban. */
const FILTERS_FROM = 4;

type Filter = 'abierta' | 'respondida' | 'todas';

/** Cómo firma una pregunta: el nombre que dejaron, o el anonimato pedido. */
export function questionAuthor(question: QuestionRow) {
  if (question.anonymous) return 'Anónimo';
  return question.name ?? 'Sin nombre';
}

/**
 * Las preguntas hechas desde este navegador. Es lo único que reconoce a una
 * anónima como propia: el servidor no guarda de quién es y no vamos a inventar
 * la forma de averiguarlo. Vive en el dispositivo, no viaja a ningún lado.
 */
function readAsked(): number[] {
  try {
    const raw = window.localStorage.getItem(ASKED_STORAGE_KEY);
    const ids: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'number') : [];
  } catch {
    return [];
  }
}

function rememberAsked(id: number) {
  try {
    const ids = [...new Set([...readAsked(), id])].slice(-50);
    window.localStorage.setItem(ASKED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Navegación privada o almacenamiento bloqueado: se pierde la marca de
    // "tuya" y no pasa nada más, la pregunta ya está guardada.
  }
}

/** Una pregunta con su respuesta, si ya la tiene, y lo que quepa debajo. */
function QuestionItem({
  question,
  mine,
  flash,
  children,
}: {
  question: QuestionRow;
  mine: boolean;
  flash: boolean;
  children?: React.ReactNode;
}) {
  const answered = question.status === 'respondida' && question.answer;

  return (
    <li
      id={`pregunta-${question.id}`}
      className={`border-b border-line px-5 py-4 transition-colors duration-700 last:border-0 ${
        flash ? 'bg-primary-soft' : 'bg-transparent'
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="text-[12.5px] font-medium text-muted">{questionAuthor(question)}</span>
        {mine && (
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
            Tuya
          </span>
        )}
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

/** Un filtro de la barra, con su cuenta. Sin preguntas de ese tipo, no se pinta. */
function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors ${
        active
          ? 'border-primary bg-primary-soft text-primary'
          : 'border-line bg-surface text-muted hover:border-primary hover:text-text'
      }`}
    >
      {label} <span className="tabular-nums opacity-70">{count}</span>
    </button>
  );
}

/**
 * La lista entera, con su vacío. Se usa igual en el portal del asistente, en el
 * panel de la empresa y en el admin: es el mismo registro, y conviene que se lea
 * igual en los tres sitios. Lo que cambia es lo que cada uno puede hacer con
 * ella, y eso entra por props.
 *
 * `extras` trae lo que va debajo de cada pregunta (el formulario de respuesta
 * del admin, por ejemplo) ya renderizado en el servidor: llega como un mapa por
 * id porque una función no cruza la frontera al cliente.
 */
export function QuestionList({
  questions,
  empty,
  extras,
  ownIds,
  removable,
  onRemove,
  removeLabel = 'Borrar',
  defaultFilter = 'todas',
}: {
  questions: QuestionRow[];
  empty: string;
  extras?: Record<number, React.ReactNode>;
  /** Las firmadas por quien mira, que el servidor sí sabe cuáles son. */
  ownIds?: number[];
  /** Las que todavía se pueden deshacer, dentro de la ventana de gracia. */
  removable?: number[];
  onRemove?: (formData: FormData) => void | Promise<void>;
  removeLabel?: string;
  defaultFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [asked, setAsked] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);

  // Lo recién enviado: el formulario avisa con el id y aquí se guarda, se
  // marca como propia y se lleva a la vista, que si no la pregunta cae al
  // fondo de una lista larga y parece que no pasó nada.
  useEffect(() => {
    setAsked(readAsked());

    const onAsked = (event: Event) => {
      const { questionId } = (event as CustomEvent<AskState>).detail ?? {};
      if (!questionId) return;

      rememberAsked(questionId);
      setAsked(readAsked());
      setFilter('todas');
      setFlash(questionId);
    };

    window.addEventListener(ASKED_EVENT, onAsked);
    return () => window.removeEventListener(ASKED_EVENT, onAsked);
  }, []);

  // El resalte espera a que la pregunta exista en el DOM: entre el envío y la
  // lista nueva hay un viaje al servidor, y el aviso llega antes que la fila.
  useEffect(() => {
    if (flash === null) return;
    if (!questions.some((q) => q.id === flash)) return;

    document
      .getElementById(`pregunta-${flash}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const timer = setTimeout(() => setFlash(null), 2400);
    return () => clearTimeout(timer);
  }, [flash, questions]);

  if (questions.length === 0) {
    return <p className="px-5 py-4 text-[13px] leading-relaxed text-faint">{empty}</p>;
  }

  const open = questions.filter((q) => q.status === 'abierta');
  const answered = questions.filter((q) => q.status === 'respondida');

  // Los filtros aparecen cuando hay algo que filtrar: lista larga y las dos
  // pilas con contenido. Con todo sin responder, la barra no diría nada.
  const withFilters = questions.length >= FILTERS_FROM && open.length > 0 && answered.length > 0;

  const shown = !withFilters
    ? questions
    : filter === 'abierta'
      ? open
      : filter === 'respondida'
        ? answered
        : questions;

  const mine = new Set([...(ownIds ?? []), ...asked]);
  const canRemove = new Set(removable ?? []);

  return (
    <>
      {withFilters && (
        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
          <FilterChip
            label="Sin responder"
            count={open.length}
            active={filter === 'abierta'}
            onClick={() => setFilter('abierta')}
          />
          <FilterChip
            label="Respondidas"
            count={answered.length}
            active={filter === 'respondida'}
            onClick={() => setFilter('respondida')}
          />
          <FilterChip
            label="Todas"
            count={questions.length}
            active={filter === 'todas'}
            onClick={() => setFilter('todas')}
          />
        </div>
      )}

      <ul>
        {shown.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            mine={mine.has(question.id)}
            flash={flash === question.id}
          >
            {onRemove && canRemove.has(question.id) && (
              <form action={onRemove} className="mt-2.5">
                <input type="hidden" name="id" value={question.id} />
                <button
                  type="submit"
                  className="text-[12px] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-[#c2410c]"
                >
                  {removeLabel}
                </button>
              </form>
            )}
            {extras?.[question.id]}
          </QuestionItem>
        ))}
      </ul>
    </>
  );
}
