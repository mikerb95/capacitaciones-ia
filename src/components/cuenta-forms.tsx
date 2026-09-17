'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  redeemSignInLink,
  register,
  requestReset,
  setNewPassword,
  signIn,
  type AccountFormState,
} from '@/app/cuenta/actions';
import { Field, FormError, field } from '@/components/form-kit';
import { CODE_MAX } from '@/lib/access-code';

const PASSWORD_HINT = 'Mínimo 10 caracteres, con letras y números.';

const primaryButton =
  'rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60';

const secondaryButton =
  'rounded-[10px] border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-muted transition-colors hover:border-primary hover:text-text disabled:opacity-60';

const textLink =
  'font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-primary';

/** Para qué se usa el correo. Va en cada formulario que lo pide. */
export function PrivacyNote() {
  return (
    <p className="flex gap-2.5 rounded-[10px] bg-surface-2 px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 flex-none text-primary">
        <path d="M8 1.5 2.5 3.5v4c0 3.3 2.3 5.9 5.5 7 3.2-1.1 5.5-3.7 5.5-7v-4L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="m5.6 8 1.7 1.7 3.2-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        Tu correo es solo para iniciar sesión. No te enviaremos campañas, boletines ni anuncios, y
        no lo compartiremos con terceros.
      </span>
    </p>
  );
}

function SentNotice({ email, children }: { email: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="flex flex-col gap-3 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="m3 5.5 7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="font-display text-[18px] font-semibold tracking-tight">Revisa tu correo</h2>
      <p className="text-[14px] leading-relaxed text-muted">
        Si <strong className="font-semibold text-text">{email}</strong> está bien escrito, en un
        momento te llega un enlace. Vence en 30 minutos y sirve una sola vez.
      </p>
      {children}
      <p className="text-[12.5px] leading-relaxed text-faint">
        ¿No llega? Revisa la carpeta de spam o promociones antes de pedir otro.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ registro */

type Method = 'enlace' | 'contrasena';

const METHODS: { value: Method; label: string; hint: string }[] = [
  { value: 'enlace', label: 'Enlace al correo', hint: 'Sin contraseña: cada vez que entres te mandamos un enlace.' },
  { value: 'contrasena', label: 'Contraseña', hint: 'Confirmas el correo una vez y después entras con tu contraseña.' },
];

export function RegisterForm({
  destination,
  trainingLabel,
}: {
  destination: string;
  /** Capacitación abierta en el navegador. Sin ella, se pide el código. */
  trainingLabel?: string;
}) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(register, {});
  const [method, setMethod] = useState<Method>('enlace');

  if (state.sent) {
    return (
      <SentNotice email={state.sent}>
        {method === 'contrasena' && (
          <p className="text-[13.5px] leading-relaxed text-muted">
            Al abrirlo queda lista tu cuenta. Desde ahí puedes entrar con tu contraseña.
          </p>
        )}
      </SentNotice>
    );
  }

  const selected = METHODS.find((m) => m.value === method)!;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="destino" value={destination} />

      <Field label="Nombre">
        <input
          name="nombre"
          autoComplete="name"
          required
          maxLength={80}
          defaultValue={state.values?.name}
          className={field}
          placeholder="Como quieres que aparezca en tu certificado"
        />
      </Field>

      <Field label="Correo">
        <input
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          defaultValue={state.values?.email}
          className={field}
          placeholder="tu@empresa.com"
        />
      </Field>

      {trainingLabel ? (
        <p className="text-[12.5px] text-faint">
          Capacitación: <span className="font-medium text-muted">{trainingLabel}</span>
        </p>
      ) : (
        <Field label="Código de la capacitación">
          <input
            name="codigo"
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            required
            maxLength={CODE_MAX}
            defaultValue={state.values?.code}
            className={`${field} font-mono uppercase tracking-[0.2em]`}
            placeholder="K7M4RD"
          />
        </Field>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[12.5px] font-medium text-muted">¿Cómo quieres entrar?</legend>
        <div className="grid grid-cols-2 gap-1 rounded-[12px] bg-surface-2 p-1">
          {METHODS.map((m) => (
            <label
              key={m.value}
              className="cursor-pointer rounded-[9px] px-3 py-2 text-center text-[13px] font-medium text-muted transition-colors has-[:checked]:bg-surface has-[:checked]:text-text has-[:checked]:shadow-card has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
            >
              <input
                type="radio"
                name="metodo"
                value={m.value}
                checked={method === m.value}
                onChange={() => setMethod(m.value)}
                className="sr-only"
              />
              {m.label}
            </label>
          ))}
        </div>
        <p className="text-[12.5px] leading-relaxed text-faint">{selected.hint}</p>
      </fieldset>

      {method === 'contrasena' && (
        <Field label="Contraseña" hint={PASSWORD_HINT}>
          <input
            name="contrasena"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            maxLength={200}
            className={field}
          />
        </Field>
      )}

      <PrivacyNote />

      {state.error && <FormError>{state.error}</FormError>}

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? 'Enviando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}

/* -------------------------------------------------------------------- ingreso */

export function SignInForm({ destination }: { destination: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(signIn, {});

  if (state.sent) return <SentNotice email={state.sent} />;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="destino" value={destination} />

      <Field label="Correo">
        <input
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          defaultValue={state.values?.email}
          className={field}
          placeholder="tu@empresa.com"
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="contrasena" className="text-[12.5px] font-medium text-muted">
            Contraseña
          </label>
          <Link href="/cuenta/recuperar" className="text-[12px] text-faint transition-colors hover:text-primary">
            ¿La olvidaste?
          </Link>
        </div>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          maxLength={200}
          className={field}
        />
      </div>

      {state.error && <FormError>{state.error}</FormError>}

      <button type="submit" name="modo" value="contrasena" disabled={pending} className={primaryButton}>
        Entrar
      </button>

      <div className="flex items-center gap-3 text-[12px] text-faint">
        <span className="h-px flex-1 bg-line" />o sin contraseña
        <span className="h-px flex-1 bg-line" />
      </div>

      <button type="submit" name="modo" value="enlace" formNoValidate disabled={pending} className={secondaryButton}>
        Enviarme un enlace al correo
      </button>

      <PrivacyNote />
    </form>
  );
}

/* ------------------------------------------------------------------ recuperar */

export function ResetRequestForm() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(requestReset, {});

  if (state.sent) return <SentNotice email={state.sent} />;

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Correo de tu cuenta">
        <input
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          autoFocus
          defaultValue={state.values?.email}
          className={field}
          placeholder="tu@empresa.com"
        />
      </Field>

      {state.error && <FormError>{state.error}</FormError>}

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? 'Enviando...' : 'Enviarme el enlace'}
      </button>
    </form>
  );
}

/* --------------------------------------------------------------------- enlace */

export function RedeemLinkForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(redeemSignInLink, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      {state.error && (
        <>
          <FormError>{state.error}</FormError>
          <Link href="/cuenta/entrar" className={`${secondaryButton} text-center`}>
            Pedir otro enlace
          </Link>
        </>
      )}
      {!state.error && (
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? 'Entrando...' : 'Continuar al Aula Virtual'}
        </button>
      )}
    </form>
  );
}

export function NewPasswordForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(setNewPassword, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      {/* Para que el gestor de contraseñas sepa a qué cuenta guardarla. */}
      <input type="email" value={email} autoComplete="username" hidden readOnly />

      <Field label="Contraseña nueva" hint={PASSWORD_HINT}>
        <input
          name="contrasena"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={200}
          autoFocus
          className={field}
        />
      </Field>

      <Field label="Repítela">
        <input
          name="confirmacion"
          type="password"
          autoComplete="new-password"
          required
          maxLength={200}
          className={field}
        />
      </Field>

      {state.error && <FormError>{state.error}</FormError>}

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? 'Guardando...' : 'Guardar y entrar'}
      </button>

      <p className="text-center text-[12.5px] leading-relaxed text-faint">
        Al cambiarla se cierra la sesión en tus otros dispositivos.{' '}
        <Link href="/cuenta/entrar" className={textLink}>
          Volver
        </Link>
      </p>
    </form>
  );
}
