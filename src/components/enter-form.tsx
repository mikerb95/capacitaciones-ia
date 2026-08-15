'use client';

import { useActionState } from 'react';
import { enter, type EnterState } from '@/app/ingresar/actions';

const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-faint focus:border-primary';

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-[12.5px] text-[#c2410c] dark:text-[#f4a06a]">{message}</span>;
}

export function EnterForm({ destination }: { destination: string }) {
  const [state, action, pending] = useActionState<EnterState, FormData>(enter, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="destino" value={destination} />

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Código de la capacitación</span>
        <input
          name="codigo"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          autoFocus
          defaultValue={state.values?.code}
          aria-invalid={Boolean(state.errors?.code)}
          className={`${field} text-center font-mono text-[26px] tracking-[0.4em]`}
          placeholder="0000"
        />
        <Error message={state.errors?.code} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">Tu nombre</span>
        <input
          name="nombre"
          autoComplete="name"
          defaultValue={state.values?.name}
          aria-invalid={Boolean(state.errors?.name)}
          className={field}
          placeholder="Nombre y apellido"
        />
        <Error message={state.errors?.name} />
        <span className="text-[12px] text-faint">
          Es lo único que guardamos, y solo para la lista de asistencia que ve tu empresa. Escríbelo
          igual cada vez y retomas donde ibas.
        </span>
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
