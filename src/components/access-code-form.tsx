'use client';

import Link from 'next/link';
import { useActionState, useState, type ReactNode } from 'react';
import type { AccessCodeState, AccessCodeAction } from '@/app/admin/accesos/actions';
import type { CompanyKind } from '@/db/schema';
import { availabilityIn, entryPlan, type PlanInfo, type PlanRef } from '@/lib/plans';
import { Field, FormError, Step, field } from './form-kit';

export type ScopeModuleOption = {
  id: number;
  name: string;
  level: string;
  mark: ReactNode;
  plans: PlanRef[];
};

export type ScopePlatformOption = {
  id: string;
  name: string;
  color: string;
  mark: ReactNode;
  plans: PlanInfo[];
  modules: ScopeModuleOption[];
};

export type CompanyOption = { id: number; name: string; kind: CompanyKind };

/**
 * Cómo llegó el trabajo. Es la pregunta que ordena todo lo demás: de ella
 * salen quién ve la capacitación en su panel y de quién es el material que
 * descarga la gente.
 */
export type TrainingMode = 'propia' | 'directa' | 'tercerizada';

export type AccessCodeDefaults = {
  code: string;
  label: string;
  mode: TrainingMode;
  companyId: number | null;
  contractorId: number | null;
  notes: string;
  moduleIds: number[];
  /** Clave del plan contratado por plataforma. Sin entrada, sin plan definido. */
  planKeys: Record<string, string>;
};

const EMPTY: AccessCodeDefaults = {
  code: '',
  label: '',
  mode: 'propia',
  companyId: null,
  contractorId: null,
  notes: '',
  moduleIds: [],
  planKeys: {},
};

const MODES: { value: TrainingMode; title: string; hint: string }[] = [
  {
    value: 'propia',
    title: 'Es mía',
    hint: 'La dicto por mi cuenta. Nadie más ve la lista de asistentes.',
  },
  {
    value: 'directa',
    title: 'Me contrató la empresa',
    hint: 'Trato directo con la empresa cuya gente asiste.',
  },
  {
    value: 'tercerizada',
    title: 'Me contrató una capacitadora',
    hint: 'Un intermediario pone el contrato y la gente es de su cliente.',
  },
];

export function AccessCodeForm({
  action,
  platforms,
  companies,
  defaults = EMPTY,
  mode,
  id,
}: {
  action: AccessCodeAction;
  platforms: ScopePlatformOption[];
  companies: CompanyOption[];
  defaults?: AccessCodeDefaults;
  mode: 'create' | 'edit';
  id?: number;
}) {
  const [state, formAction, pending] = useActionState<AccessCodeState, FormData>(action, {});
  const [mode, setMode] = useState<TrainingMode>(defaults.mode);
  const [companyId, setCompanyId] = useState(defaults.companyId ? String(defaults.companyId) : '');
  const [contractorId, setContractorId] = useState(
    defaults.contractorId ? String(defaults.contractorId) : '',
  );
  const [selected, setSelected] = useState<Set<number>>(new Set(defaults.moduleIds));
  const [planKeys, setPlanKeys] = useState<Record<string, string>>(defaults.planKeys);
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

  // Una capacitadora no recibe capacitaciones, y un cliente puro no contrata a
  // nombre de otro: cada lista se queda con las que de verdad pueden ir ahí.
  const clientes = companies.filter((c) => c.kind !== 'capacitadora');
  const capacitadoras = companies.filter((c) => c.kind !== 'cliente');

  const total = platforms.reduce((n, p) => n + p.modules.length, 0);
  const chosen = everything ? total : selected.size;

  /** Módulos de la plataforma que el plan contratado no cubre. */
  const outOfPlan = (platform: ScopePlatformOption) => {
    const key = planKeys[platform.id];
    if (!key) return [];
    return platform.modules.filter((m) => availabilityIn(m.plans, key) === 'no');
  };

  const dropOutOfPlan = (platform: ScopePlatformOption) =>
    setSelected((current) => {
      const next = new Set(current);
      for (const m of outOfPlan(platform)) next.delete(m.id);
      return next;
    });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {id && <input type="hidden" name="id" value={id} />}
      {!everything &&
        [...selected].map((id) => (
          <input key={id} type="hidden" name="modulos" value={id} />
        ))}
      <input type="hidden" name="alcance" value={everything ? 'todo' : 'seleccion'} />
      {Object.entries(planKeys).map(([platformId, key]) =>
        key ? (
          <input key={platformId} type="hidden" name={`plan_${platformId}`} value={key} />
        ) : null,
      )}

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
        title="Para quién es"
        intro="Si la dictas en nombre de una empresa que te contrató, la capacitación entra en su panel: sus responsables ven a su gente y el avance de cada uno."
      >
        <input type="hidden" name="contracted" value={contracted ? '1' : ''} />

        <label className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-line bg-surface-2 px-4 py-3.5 transition-colors hover:border-primary">
          <input
            type="checkbox"
            checked={contracted}
            onChange={(e) => setContracted(e.target.checked)}
            className="mt-0.5 size-[15px] flex-none accent-primary"
          />
          <span>
            <span className="block text-[13.5px] font-semibold">
              Es parte de un contrato con una empresa, y la dicto en su nombre
            </span>
            <span className="mt-0.5 block text-[12.5px] leading-relaxed text-faint">
              Déjalo sin marcar si la capacitación es tuya: aunque asista gente de una empresa,
              nadie de su lado verá la lista de asistentes.
            </span>
          </span>
        </label>

        {contracted && (
          <div className="mt-4 grid gap-4">
            <Field label="Empresa contratante">
              <select
                name="companyId"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                aria-invalid={state.field === 'company'}
                className={field}
              >
                <option value="">Elige la empresa</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            {companies.length === 0 && (
              <p className="text-[12.5px] leading-relaxed text-faint">
                Todavía no hay empresas cargadas.{' '}
                <Link
                  href="/admin/empresas/nueva"
                  target="_blank"
                  className="font-medium text-primary"
                >
                  Crea la primera
                </Link>{' '}
                y vuelve a este formulario: ahí van el contrato, sus responsables y la clave de
                su panel.
              </p>
            )}
          </div>
        )}

        <div className="mt-4">
          <Field label="Notas" hint="opcional, solo para ti">
            <textarea
              name="notes"
              rows={2}
              defaultValue={defaults.notes}
              placeholder="Sala, horario, acuerdos, lo que convenga recordar."
              className={`${field} resize-y`}
            />
          </Field>
        </div>
      </Step>

      <Step
        number={3}
        title="Plan contratado"
        intro="Qué paga la empresa en cada plataforma. El portal abre filtrado por ese plan, y el selector sigue disponible por si conviene mostrar qué se gana subiendo."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {platforms.map((platform) => {
            const key = platform.plans.some((p) => p.key === planKeys[platform.id])
              ? planKeys[platform.id]
              : '';
            const plan = platform.plans.find((p) => p.key === key) ?? null;

            return (
              <div
                key={platform.id}
                className="tone rounded-[12px] border border-line bg-surface-2 p-3.5"
                style={{ ['--tone' as string]: platform.color }}
              >
                <div className="mb-2.5 flex items-center gap-2.5">
                  {platform.mark}
                  <span className="min-w-0 flex-1 truncate font-display text-[14px] font-semibold tracking-tight">
                    {platform.name}
                  </span>
                </div>

                {platform.plans.length === 0 ? (
                  <p className="text-[12.5px] leading-relaxed text-faint">
                    Esta plataforma todavía no tiene planes cargados.
                  </p>
                ) : (
                  <>
                    <select
                      value={key}
                      onChange={(e) =>
                        setPlanKeys((current) => ({
                          ...current,
                          [platform.id]: e.target.value,
                        }))
                      }
                      aria-label={`Plan contratado en ${platform.name}`}
                      className={field}
                    >
                      <option value="">Sin definir</option>
                      {platform.plans.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.name} · {p.price}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[12px] leading-snug text-faint">
                      {plan?.summary ?? 'El portal abre sin filtro de plan.'}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Step>

      <Step
        number={4}
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
              const plan = platform.plans.find((p) => p.key === planKeys[platform.id]) ?? null;
              const fuera = outOfPlan(platform);
              const marcadosFuera = fuera.filter((m) => selected.has(m.id));

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

                  {marcadosFuera.length > 0 && plan && (
                    <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[10px] bg-[#fdebe2] px-3 py-2 text-[12.5px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
                      <span>
                        {marcadosFuera.length}{' '}
                        {marcadosFuera.length === 1 ? 'módulo marcado no entra' : 'módulos marcados no entran'}{' '}
                        en {plan.name}.
                      </span>
                      <button
                        type="button"
                        onClick={() => dropOutOfPlan(platform)}
                        className="font-semibold underline underline-offset-2"
                      >
                        Quitarlos
                      </button>
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2">
                    {platform.modules.map((m) => {
                      const on = selected.has(m.id);
                      const sinPlan = plan ? availabilityIn(m.plans, plan.key) === 'no' : false;
                      const minimo = sinPlan ? entryPlan(m.plans, platform.plans) : null;

                      return (
                        <label
                          key={m.id}
                          title={
                            minimo ? `No entra en ${plan!.name}: necesita ${minimo.name}.` : undefined
                          }
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
                          <span
                            className={`min-w-0 flex-1 truncate text-[13px] font-medium ${
                              sinPlan ? 'text-faint line-through decoration-1' : ''
                            }`}
                          >
                            {m.name}
                          </span>
                          <span className="text-[11px] text-faint">
                            {minimo ? `desde ${minimo.name}` : m.level}
                          </span>
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

      {state.error && <FormError>{state.error}</FormError>}

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
