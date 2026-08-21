'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { ask } from '@/app/preguntas/actions';
import { ASKED_EVENT, QUESTION_MAX, QUESTION_MIN, type AskState } from '@/lib/questions';

const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-faint focus:border-primary';

/** Desde cuándo avisar que se está acercando al tope. */
const NEAR_MAX = QUESTION_MAX - 100;

/**
 * Los campos, aparte del formulario y con vida propia: enviada la pregunta, el
 * padre los vuelve a montar con otra llave y quedan limpios para la siguiente,
 * sin tener que sincronizar nada a mano.
 */
function Fields({
  name,
  error,
  pending,
  notice,
}: {
  name: string;
  error?: string;
  pending: boolean;
  // El aviso del último envío. Entra como prop para quedar pegado al botón,
  // que es donde se mira después de darle.
  notice?: React.ReactNode;
}) {
  const [anonymous, setAnonymous] = useState(false);
  const [body, setBody] = useState('');

  const box = useRef<HTMLTextAreaElement>(null);

  const faltan = QUESTION_MIN - body.trim().length;
  const restantes = QUESTION_MAX - body.length;

  // Al montarse (también al volver de un envío) el cursor queda donde se
  // escribe: dos preguntas seguidas no obligan a buscar el campo otra vez.
  useEffect(() => {
    box.current?.focus();
  }, []);

  // El campo crece con lo escrito hasta un tope. Una pregunta larga se lee
  // entera antes de enviarla, y el formulario no se come la página.
  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  };

  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Tu pregunta</span>
        <textarea
          ref={box}
          name="pregunta"
          rows={4}
          maxLength={QUESTION_MAX}
          aria-invalid={Boolean(error)}
          aria-describedby="pregunta-medida"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            grow(e.target);
          }}
          className={`${field} resize-y leading-relaxed`}
          placeholder="¿Cómo le pido a la IA que respete el formato de nuestros informes?"
        />
        <span id="pregunta-medida" className="text-[12px] text-faint">
          {body.length === 0
            ? 'Una o dos frases bastan: lo que preguntarías en voz alta.'
            : faltan > 0
              ? `Un poco más de detalle: faltan ${faltan} ${faltan === 1 ? 'carácter' : 'caracteres'}.`
              : body.length >= NEAR_MAX
                ? `Te quedan ${restantes} ${restantes === 1 ? 'carácter' : 'caracteres'}.`
                : 'Lista para enviar.'}
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">
          Tu nombre <span className="font-normal text-faint">(opcional)</span>
        </span>
        <input
          name="nombre"
          autoComplete="name"
          defaultValue={name}
          disabled={anonymous}
          className={`${field} disabled:bg-surface-2 disabled:text-faint`}
          placeholder="Nombre y apellido"
        />
      </label>

      <label className="flex items-start gap-2.5 rounded-[10px] bg-surface-2 px-3.5 py-3">
        <input
          type="checkbox"
          name="anonimo"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-0.5 size-4 flex-none accent-[var(--primary)]"
        />
        <span className="text-[13px] leading-relaxed text-muted">
          Preguntar de forma anónima
          <span className="block text-[12px] text-faint">
            No guardamos tu nombre ni queda registro de quién la escribió, así que tampoco podrás
            borrarla después.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending || faltan > 0}
        className="rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Enviando...' : 'Enviar pregunta'}
      </button>
    </>
  );
}

/**
 * Buzón de preguntas del asistente. El nombre viene puesto con el de la sesión
 * porque es lo más común, pero se puede borrar o tapar con el anónimo: quien
 * quiere preguntar sin firmar no tiene que pelearse con el formulario.
 */
export function QuestionForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState<AskState, FormData>(ask, {});

  // Guardada la pregunta, la lista de abajo tiene que saber cuál es para
  // marcarla y llevarla a la vista. Van por un aviso del navegador y no por un
  // contexto porque son dos hermanos sueltos dentro de la misma página.
  useEffect(() => {
    if (!state.sentAt) return;
    window.dispatchEvent(new CustomEvent<AskState>(ASKED_EVENT, { detail: state }));
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Fields key={state.sentAt ?? 'nueva'} name={name} error={state.error} pending={pending} />

      {state.error && (
        <p
          role="alert"
          className="rounded-[10px] bg-[#fdebe2] px-4 py-2.5 text-[13px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]"
        >
          {state.error}
        </p>
      )}

      {state.sentAt && (
        <p
          role="status"
          className="rounded-[10px] bg-accent-soft px-4 py-2.5 text-[13px] text-accent"
        >
          Pregunta enviada. Queda anotada abajo para responderla en la capacitación.
        </p>
      )}
    </form>
  );
}
