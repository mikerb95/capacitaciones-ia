'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { ask, QUESTION_MAX, type AskState } from '@/app/preguntas/actions';

const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-faint focus:border-primary';

/**
 * Buzón de preguntas del asistente. El nombre viene puesto con el de la sesión
 * porque es lo más común, pero se puede borrar o tapar con el anónimo: quien
 * quiere preguntar sin firmar no tiene que pelearse con el formulario.
 */
export function QuestionForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState<AskState, FormData>(ask, {});
  const [anonymous, setAnonymous] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  // Enviada la pregunta, el formulario queda limpio para la siguiente.
  useEffect(() => {
    if (state.ok) {
      form.current?.reset();
      setAnonymous(false);
    }
  }, [state.ok]);

  return (
    <form ref={form} action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Tu pregunta</span>
        <textarea
          name="pregunta"
          rows={4}
          maxLength={QUESTION_MAX}
          defaultValue={state.error ? state.values?.body : ''}
          aria-invalid={Boolean(state.error)}
          className={`${field} resize-y leading-relaxed`}
          placeholder="¿Cómo le pido a la IA que respete el formato de nuestros informes?"
        />
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
            No guardamos tu nombre ni queda registro de quién la escribió.
          </span>
        </span>
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-[10px] bg-[#fdebe2] px-4 py-2.5 text-[13px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]"
        >
          {state.error}
        </p>
      )}

      {state.ok && (
        <p
          role="status"
          className="rounded-[10px] bg-accent-soft px-4 py-2.5 text-[13px] text-accent"
        >
          Pregunta enviada. Queda anotada para responderla en la capacitación.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Enviando...' : 'Enviar pregunta'}
      </button>
    </form>
  );
}
