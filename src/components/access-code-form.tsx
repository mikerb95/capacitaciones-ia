'use client';

import { useActionState, useState, type ReactNode } from 'react';
import type { AccessCodeState, AccessCodeAction } from '@/app/admin/accesos/actions';

export type ScopeModuleOption = {
  id: number;
  name: string;
  level: string;
  mark: ReactNode;
};

export type ScopePlatformOption = {
  id: string;
  name: string;
  color: string;
  mark: ReactNode;
  modules: ScopeModuleOption[];
};

export type AccessCodeDefaults = {
  code: string;
  label: string;
  company: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  notes: string;
  moduleIds: number[];
};

const EMPTY: AccessCodeDefaults = {
  code: '',
  label: '',
  company: '',
  industry: '',
  contactName: '',
  contactEmail: '',
  notes: '',
  moduleIds: [],
};

const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14px] outline-none transition-colors placeholder:text-faint focus:border-primary';

function Step({
  number,
  title,
  intro,
  children,
}: {
  number: number;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-primary-soft font-mono text-[11.5px] font-semibold text-primary">
          {number}
        </span>
        <div>
          <h2 className="font-display text-[15.5px] font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-faint">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-muted">
        {label}
        {hint && <span className="ml-1 font-normal text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function AccessCodeForm({
  action,
  platforms,
  defaults = EMPTY,
  mode,
  id,
}: {
  action: AccessCodeAction;
  platforms: ScopePlatformOption[];
  defaults?: AccessCodeDefaults;
  mode: 'create' | 'edit';
  id?: number;
}) {
  const [state, formAction, pending] = useActionState<AccessCodeState, FormData>(action, {});
  const [selected, setSelected] = useState<Set<number>>(new Set(defaults.moduleIds));
  // Sin recorte, el código abre todo el catálogo: es lo normal cuando la
  // capacitación cubre las cuatro plataformas.
  const [everything, setEverything] = useState(defaults.moduleIds.length === 0);

  const toggle = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const togglePlatform = (platform: ScopePlatformOption) =>
    setSelected((current) => {
      const next = new Set(current);
      const all = platform.modules.every((m) => next.has(m.id));
      for (const m of platform.modules) {
        if (all) next.delete(m.id);
        else next.add(m.id);
      }
      return next;
    });

  const total = platforms.reduce((n, p) => n + p.modules.length, 0);
  const chosen = everything ? total : selected.size;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {id && <input type="hidden" name="id" value={id} />}
      {!everything &&
        [...selected].map((id) => (
          <input key={id} type="hidden" name="modulos" value={id} />
        ))}
      <input type="hidden" name="alcance" value={everything ? 'todo' : 'seleccion'} />

      <Step
        number={1}
        title="El PIN"
        intro="Los cuatro dígitos que dictas al abrir la sesión. Déjalo vacío y se sortea uno libre."
      >
        <div className="flex flex-wrap items-end gap-3">
          <Field label="PIN" hint={mode === 'edit' ? 'no se cambia' : 'opcional'}>
            <input
              name="code"
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              readOnly={mode === 'edit'}
              defaultValue={defaults.code}
              aria-invalid={state.field === 'code'}
              placeholder="0000"
              className={`w-[120px] rounded-[10px] border border-line px-3 py-2.5 text-center font-mono text-[20px] tracking-[0.25em] outline-none focus:border-primary ${
                mode === 'edit' ? 'bg-surface-2 text-muted' : 'bg-surface'
              }`}
            />
          </Field>

          <div className="min-w-[240px] flex-1">
            <Field label="Nombre de la capacitación">
              <input
                name="label"
                required
                defaultValue={defaults.label}
                aria-invalid={state.field === 'label'}
                placeholder="Equipo comercial · agosto"
                className={field}
              />
            </Field>
          </div>
        </div>
      </Step>

      <Step
        number={2}
        title="Perfil de la empresa"
        intro="Para quién es la capacitación. Sirve para reconocer el PIN meses después y para saber a quién escribirle."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Empresa">
            <input
              name="company"
              defaultValue={defaults.company}
              placeholder="Ferretería del Norte S.A.S."
              className={field}
            />
          </Field>

          <Field label="Sector" hint="opcional">
            <input
              name="industry"
              defaultValue={defaults.industry}
              placeholder="Retail, salud, logística..."
              className={field}
            />
          </Field>

          <Field label="Contacto" hint="opcional">
            <input
              name="contactName"
              defaultValue={defaults.contactName}
              placeholder="Quién coordina de su lado"
              className={field}
            />
          </Field>

          <Field label="Correo del contacto" hint="opcional">
            <input
              name="contactEmail"
              type="email"
              defaultValue={defaults.contactEmail}
              aria-invalid={state.field === 'contactEmail'}
              placeholder="nombre@empresa.com"
              className={field}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Notas" hint="opcional">
              <textarea
                name="notes"
                rows={2}
                defaultValue={defaults.notes}
                placeholder="Sala, horario, acuerdos, lo que convenga recordar."
                className={`${field} resize-y`}
              />
            </Field>
          </div>
        </div>
      </Step>

      <Step
        number={3}
        title="Alcance"
        intro="Qué módulos de IA y qué componentes ve quien entra con este PIN. Lo que quede fuera no aparece en el sitio."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              ['todo', 'Todo el catálogo', `${total} módulos`],
              ['seleccion', 'A la medida', 'eliges los módulos'],
            ] as const
          ).map(([value, title, hint]) => {
            const active = everything === (value === 'todo');
            return (
              <button
                key={value}
                type="button"
                onClick={() => setEverything(value === 'todo')}
                aria-pressed={active}
                className={`rounded-[10px] border px-3.5 py-2 text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-line bg-surface text-muted hover:border-primary'
                }`}
              >
                <span className="block text-[13px] font-semibold">{title}</span>
                <span className="block text-[11.5px] opacity-80">{hint}</span>
              </button>
            );
          })}
        </div>

        {everything ? (
          <p className="rounded-[10px] bg-surface-2 px-4 py-3 text-[13px] leading-relaxed text-muted">
            Este PIN abre las {platforms.length} plataformas completas, con sus {total} módulos.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {platforms.map((platform) => {
              const picked = platform.modules.filter((m) => selected.has(m.id)).length;
              const all = picked === platform.modules.length && picked > 0;

              return (
                <div
                  key={platform.id}
                  className="tone rounded-[12px] border border-line bg-surface-2 p-3.5"
                  style={{ ['--tone' as string]: platform.color }}
                >
                  <div className="mb-2.5 flex items-center gap-2.5">
                    {platform.mark}
                    <span className="font-display text-[14px] font-semibold tracking-tight">
                      {platform.name}
                    </span>
                    <span className="flex-1 text-[12px] text-faint">
                      {picked} de {platform.modules.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className="rounded-md border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:border-[var(--tone)] hover:text-[var(--tone)]"
                    >
                      {all ? 'Ninguno' : 'Todos'}
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {platform.modules.map((m) => {
                      const on = selected.has(m.id);
                      return (
                        <label
                          key={m.id}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-[10px] border px-3 py-2 transition-colors ${
                            on
                              ? 'border-[var(--tone)] bg-surface'
                              : 'border-line bg-surface hover:border-[var(--tone)]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(m.id)}
                            className="size-[15px] flex-none accent-[var(--tone)]"
                          />
                          {m.mark}
                          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                            {m.name}
                          </span>
                          <span className="text-[11px] text-faint">{m.level}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Step>

      {state.error && (
        <p
          role="alert"
          className="rounded-[10px] bg-[#fdebe2] px-4 py-2.5 text-[13px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending
            ? 'Guardando...'
            : mode === 'create'
              ? 'Crear PIN'
              : 'Guardar cambios'}
        </button>
        <span className="text-[12.5px] text-faint">
          {chosen} de {total} módulos en alcance
        </span>
      </div>
    </form>
  );
}
