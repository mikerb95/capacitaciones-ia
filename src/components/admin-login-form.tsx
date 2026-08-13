'use client';

import { useActionState } from 'react';
import { adminLogin, type LoginState } from '@/app/admin/login/actions';

const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-faint focus:border-primary';

export function AdminLoginForm({ destination }: { destination: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(adminLogin, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="destino" value={destination} />

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Usuario</span>
        <input
          name="usuario"
          autoComplete="username"
          autoFocus
          defaultValue={state.values?.user}
          aria-invalid={Boolean(state.error)}
          className={field}
          placeholder="admin"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Contraseña</span>
        <input
          name="clave"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.error)}
          className={field}
          placeholder="••••••••"
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
        {pending ? 'Entrando...' : 'Entrar al panel'}
      </button>
    </form>
  );
}
