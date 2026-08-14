'use client';

import { useActionState } from 'react';
import { enterCompanyPanel, type CompanyLoginState } from '@/app/empresa/actions';

export function CompanyLoginForm() {
  const [state, action, pending] = useActionState<CompanyLoginState, FormData>(
    enterCompanyPanel,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Clave del panel</span>
        <input
          name="clave"
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={13}
          aria-invalid={Boolean(state.error)}
          placeholder="K7M2P-9XQ4R"
          className="w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-center font-mono text-[18px] uppercase tracking-[0.16em] outline-none transition-colors placeholder:text-faint focus:border-primary"
        />
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-[10px] bg-[#fdebe2] px-3 py-2 text-[12.5px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]"
        >
          {state.error}
        </p>
      )}

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
