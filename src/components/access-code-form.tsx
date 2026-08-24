'use client';

import Link from 'next/link';
import { useActionState, useMemo, useState, type ReactNode } from 'react';
import type { AccessCodeState, AccessCodeAction } from '@/app/admin/(panel)/accesos/actions';
import type { CompanyKind } from '@/db/schema';
import { CODE_MAX } from '@/lib/access-code';
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
  /** `YYYY-MM-DDTHH:mm`, que es lo que entiende un input datetime-local. */
  sessionAt: string;
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
  sessionAt: '',
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
  // `mode` ya es el de la pantalla (crear o editar), así que el del trabajo va
  // con su propio nombre.
  const [origin, setOrigin] = useState<TrainingMode>(defaults.mode);
  const [companyId, setCompanyId] = useState(defaults.companyId ? String(defaults.companyId) : '');
  const [contractorId, setContractorId] = useState(
    defaults.contractorId ? String(defaults.contractorId) : '',
  );
  const [planKeys, setPlanKeys] = useState<Record<string, string>>(defaults.planKeys);

  const allIds = useMemo(
    () => platforms.flatMap((p) => p.modules.map((m) => m.id)),
    [platforms],
  );

  // Al crear no viene nada marcado: una capacitación es de una plataforma, o de
  // dos, y abrir el catálogo entero tiene que ser una decisión y no el descuido
  // de pasar de largo por este paso. Al editar, un código sin recorte llega con
  // todo marcado, que es exactamente lo que abre hoy.
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(mode === 'create' || defaults.moduleIds.length ? defaults.moduleIds : allIds),
  );

  // Marcado todo el catálogo, se guarda como ausencia de recorte: así un módulo
  // nuevo entra solo en los códigos que de verdad abren todo.
  const everything = allIds.length > 0 && allIds.every((id) => selected.has(id));

  const toggle = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  /**
   * La plataforma entra entera o no entra. Con algo marcado, el clic la saca:
   * es lo que espera quien ve la casilla del encabezado marcada.
   */
  const togglePlatform = (platform: ScopePlatformOption) =>
    setSelected((current) => {
      const next = new Set(current);
      const some = platform.modules.some((m) => next.has(m.id));
      for (const m of platform.modules) {
        if (some) next.delete(m.id);
        else next.add(m.id);
      }
      return next;
    });

  // Una capacitadora no recibe capacitaciones, y un cliente puro no contrata a
  // nombre de otro: cada lista se queda con las que de verdad pueden ir ahí.
  const clientes = companies.filter((c) => c.kind !== 'capacitadora');
  const capacitadoras = companies.filter((c) => c.kind !== 'cliente');

  const total = platforms.reduce((n, p) => n + p.modules.length, 0);
  const chosen = selected.size;

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
        title="El código"
        intro="La clave que dictas al abrir la sesión: letras y números, hasta 12. Puedes escribir uno que se recuerde fácil, o dejarlo vacío y se sortea uno libre."
      >
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Código" hint={mode === 'edit' ? 'no se cambia' : 'opcional'}>
            <input
              name="code"
              maxLength={CODE_MAX}
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              readOnly={mode === 'edit'}
              defaultValue={defaults.code}
              aria-invalid={state.field === 'code'}
              placeholder="ACME24"
              className={`w-[180px] rounded-[10px] border border-line px-3 py-2.5 text-center font-mono text-[20px] uppercase tracking-[0.2em] outline-none focus:border-primary ${
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

          {/*
            Sin fecha la capacitación es de autoservicio: el código queda
            abierto y cada uno entra cuando puede. Con fecha, el panel sabe
            cuál viene ahora y puede avisar de la de mañana.
          */}
          <div className="min-w-[210px]">
            <Field label="Cuándo se dicta" hint="opcional">
              <input
                type="datetime-local"
                name="sessionAt"
                defaultValue={defaults.sessionAt}
                className={field}
              />
            </Field>
          </div>
        </div>
      </Step>

      <Step
        number={2}
        title="Cómo llegó el trabajo"
        intro="De aquí sale quién ve la capacitación en su panel. Cuando hay un intermediario de por medio, quien la contrata y quien la recibe dejan de ser la misma empresa, y las dos necesitan verla."
      >
        <input type="hidden" name="modo" value={origin} />

        <div className="grid gap-2 sm:grid-cols-3">
          {MODES.map((option) => {
            const active = origin === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setOrigin(option.value)}
                aria-pressed={active}
                className={`rounded-[10px] border px-3.5 py-3 text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-line bg-surface text-muted hover:border-primary'
                }`}
              >
                <span className="block text-[13px] font-semibold">{option.title}</span>
                <span className="mt-0.5 block text-[11.5px] leading-snug opacity-80">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>

        {origin !== 'propia' && (
          <div className="mt-4 grid gap-4">
            {origin === 'tercerizada' && (
              <Field
                label="Capacitadora que te contrató"
                hint="quien pone el contrato y factura"
              >
                <select
                  name="contractorId"
                  value={contractorId}
                  onChange={(e) => setContractorId(e.target.value)}
                  aria-invalid={state.field === 'contractor'}
                  className={field}
                >
                  <option value="">Elige la capacitadora</option>
                  {capacitadoras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {capacitadoras.length === 0 && (
                  <span className="text-[11.5px] leading-relaxed text-faint">
                    Ninguna empresa está marcada como capacitadora todavía. Abre su ficha en{' '}
                    <Link href="/admin/empresas" target="_blank" className="font-medium text-primary">
                      Empresas
                    </Link>{' '}
                    y cámbiale el tipo, o crea la que falta.
                  </span>
                )}
              </Field>
            )}

            <Field
              label={origin === 'tercerizada' ? 'Empresa que recibe la capacitación' : 'Empresa que te contrató'}
              hint="de quién es la gente que asiste"
            >
              <select
                name="companyId"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                aria-invalid={state.field === 'company'}
                className={field}
              >
                <option value="">Elige la empresa</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-[11.5px] leading-relaxed text-faint">
                Es la que manda en el material a medida: su logo y sus casos son los que descarga
                su gente desde el portal.
              </span>
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
        intro="Qué plataformas cubre la capacitación. Lo que quede fuera no existe para quien entra con este código: no sale en la portada, ni en la comparativa, ni en los materiales."
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelected(new Set(allIds))}
            className="rounded-[10px] border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Todo el catálogo
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="rounded-[10px] border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Limpiar
          </button>
          <span className="text-[12.5px] text-faint">
            {selected.size === 0
              ? 'Marca la plataforma de la capacitación.'
              : everything
                ? `Las ${platforms.length} plataformas completas, con sus ${total} módulos.`
                : `${chosen} de ${total} módulos.`}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {platforms.map((platform) => {
            const picked = platform.modules.filter((m) => selected.has(m.id)).length;
            const on = picked > 0;
            const all = picked === platform.modules.length;
            const plan = platform.plans.find((p) => p.key === planKeys[platform.id]) ?? null;
            const marcadosFuera = outOfPlan(platform).filter((m) => selected.has(m.id));

            return (
              <div
                key={platform.id}
                className={`tone rounded-[12px] border p-3.5 transition-colors ${
                  on ? 'border-[var(--tone)] bg-surface-2' : 'border-line bg-surface'
                }`}
                style={{ ['--tone' as string]: platform.color }}
              >
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => togglePlatform(platform)}
                    className="size-[16px] flex-none accent-[var(--tone)]"
                  />
                  {platform.mark}
                  <span
                    className={`font-display text-[14px] font-semibold tracking-tight ${
                      on ? '' : 'text-muted'
                    }`}
                  >
                    {platform.name}
                  </span>
                  <span className="flex-1 text-[12px] text-faint">
                    {on
                      ? all
                        ? `sus ${platform.modules.length} módulos`
                        : `${picked} de ${platform.modules.length} módulos`
                      : 'fuera de la capacitación'}
                  </span>
                </label>

                {on && (
                  <>
                    {marcadosFuera.length > 0 && plan && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[10px] bg-[#fdebe2] px-3 py-2 text-[12.5px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
                        <span>
                          {marcadosFuera.length}{' '}
                          {marcadosFuera.length === 1
                            ? 'módulo marcado no entra'
                            : 'módulos marcados no entran'}{' '}
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

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {platform.modules.map((m) => {
                        const marked = selected.has(m.id);
                        const sinPlan = plan ? availabilityIn(m.plans, plan.key) === 'no' : false;
                        const minimo = sinPlan ? entryPlan(m.plans, platform.plans) : null;

                        return (
                          <label
                            key={m.id}
                            title={
                              minimo
                                ? `No entra en ${plan!.name}: necesita ${minimo.name}.`
                                : undefined
                            }
                            className={`flex cursor-pointer items-center gap-2.5 rounded-[10px] border px-3 py-2 transition-colors ${
                              marked
                                ? 'border-[var(--tone)] bg-surface'
                                : 'border-line bg-surface hover:border-[var(--tone)]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={marked}
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
                  </>
                )}
              </div>
            );
          })}
        </div>
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
              ? 'Crear código'
              : 'Guardar cambios'}
        </button>
        <span className="text-[12.5px] text-faint">
          {chosen} de {total} módulos en alcance
        </span>
      </div>
    </form>
  );
}
