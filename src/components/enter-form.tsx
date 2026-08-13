'use client';

import { useActionState, useState } from 'react';
import { enter, type EnterState } from '@/app/ingresar/actions';
import { CountrySelect } from '@/components/country-select';
import { DEFAULT_COUNTRY, findCountry } from '@/lib/countries';
import { expectedDigits } from '@/lib/phone';

const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-faint focus:border-primary';

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-[12.5px] text-[#c2410c] dark:text-[#f4a06a]">{message}</span>;
}

export function EnterForm({ destination }: { destination: string }) {
  const [state, action, pending] = useActionState<EnterState, FormData>(enter, {});
  // El país sobrevive a un envío fallido, para no volver a elegirlo.
  const [country, setCountry] = useState(state.values?.country ?? DEFAULT_COUNTRY);
  // Comparar contra el objeto de estado, y no un booleano, hace que "Cambiar"
  // valga solo para el paso que se está viendo: al reenviar llega otro estado.
  const [amended, setAmended] = useState<EnterState | null>(null);

  const digits = expectedDigits(country);
  const asking = state.step === 'nombre' && amended !== state;

  if (asking) {
    const values = state.values!;
    const dial = findCountry(values.country)?.dial;

    // La `key` distinta fuerza un formulario nuevo: los `defaultValue` de un
    // paso no se quedan pegados en los campos del otro.
    return (
      <form key="paso-nombre" action={action} className="flex flex-col gap-4">
        <input type="hidden" name="destino" value={destination} />
        <input type="hidden" name="codigo" value={values.code} />
        <input type="hidden" name="pais" value={values.country} />
        <input type="hidden" name="telefono" value={values.phone} />

        <div className="flex items-baseline justify-between gap-3 rounded-[10px] bg-bg px-3 py-2.5">
          <span className="min-w-0 truncate text-[13px] text-muted">
            <span className="font-mono tracking-[0.15em]">{values.code}</span>
            <span className="mx-1.5 text-faint">·</span>
            {dial ? `+${dial} ` : ''}
            {values.phone}
          </span>
          <button
            type="button"
            onClick={() => setAmended(state)}
            className="shrink-0 text-[12.5px] font-medium text-primary hover:underline"
          >
            Cambiar
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-muted">Tu nombre</span>
          <input
            name="nombre"
            autoComplete="name"
            autoFocus
            defaultValue={values.name}
            aria-invalid={Boolean(state.errors?.name)}
            className={field}
            placeholder="Nombre y apellido"
          />
          <Error message={state.errors?.name} />
          <span className="text-[12px] text-faint">
            Es la primera vez que entras con este número. La próxima vez basta con el código y el
            teléfono.
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

  return (
    <form key="paso-inicio" action={action} className="flex flex-col gap-4">
      <input type="hidden" name="destino" value={destination} />
      {/* El nombre ya escrito no se pierde si el código o el teléfono fallan. */}
      {state.values?.name ? <input type="hidden" name="nombre" value={state.values.name} /> : null}

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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="telefono" className="text-[12.5px] font-medium text-muted">
          WhatsApp
        </label>
        <div className="flex items-stretch rounded-[10px] border border-line bg-surface transition-colors focus-within:border-primary">
          <CountrySelect name="pais" value={country} onChange={setCountry} />
          <span className="my-2 w-px bg-line" aria-hidden="true" />
          <input
            id="telefono"
            name="telefono"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={15}
            defaultValue={state.values?.phone}
            aria-invalid={Boolean(state.errors?.phone)}
            className="w-full min-w-0 bg-transparent px-3 py-2.5 text-[14.5px] outline-none placeholder:text-faint"
            placeholder="311 476 9114"
          />
        </div>
        <Error message={state.errors?.phone} />
        <span className="text-[12px] text-faint">
          Tu celular a {digits} dígitos, sin el indicativo. Lo usamos para reconocerte cuando
          vuelvas y para enviarte el material de la sesión.
        </span>
      </div>

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
