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
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-muted">WhatsApp</span>
        <div className="flex items-center gap-2 rounded-[10px] border border-line bg-surface pl-3 transition-colors focus-within:border-primary">
          <span className="font-mono text-[14.5px] text-faint">+</span>
          <input
            name="telefono"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={state.values?.phone}
            aria-invalid={Boolean(state.errors?.phone)}
            className="w-full bg-transparent py-2.5 pr-3 text-[14.5px] outline-none placeholder:text-faint"
            placeholder="51 987 654 321"
          />
        </div>
        <Error message={state.errors?.phone} />
        <span className="text-[12px] text-faint">
          Con el código de país. Lo usamos para enviarte el material de la sesión.
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
