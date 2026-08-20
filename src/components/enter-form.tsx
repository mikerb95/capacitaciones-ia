'use client';

import { useActionState } from 'react';
import { enter, type EnterState } from '@/app/ingresar/actions';
import { CODE_MAX } from '@/lib/access-code';

export function EnterForm({ destination }: { destination: string }) {
  const [state, action, pending] = useActionState<EnterState, FormData>(enter, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="destino" value={destination} />

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Código de la capacitación</span>
        <input
          name="codigo"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={CODE_MAX}
          autoFocus
          defaultValue={state.value}
          aria-invalid={Boolean(state.error)}
          className="w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-center font-mono text-[26px] uppercase tracking-[0.3em] outline-none transition-colors placeholder:text-faint focus:border-primary"
          placeholder="K7M4RD"
        />
        {state.error && (
          <span className="text-[12.5px] text-[#c2410c] dark:text-[#f4a06a]">{state.error}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
