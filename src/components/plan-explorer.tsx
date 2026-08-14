'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Level } from '@/db/schema';
import {
  AVAILABILITY_LABEL,
  AVAILABILITY_TONE,
  applies,
  availabilityIn,
  entryPlan,
  noteIn,
  type PlanInfo,
  type PlanRef,
} from '@/lib/plans';
import { Abbr, Card, LevelBadge, SectionTitle } from './ui';

type ModuleCard = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  level: Level;
  meta: string | null;
  color: string;
  abbr: string;
  logo?: string;
  plans: PlanRef[];
};

type ModelCard = {
  id: number;
  name: string;
  description: string | null;
  plans: PlanRef[];
};

function AvailabilityBadge({ refs, plan }: { refs: PlanRef[]; plan: string | null }) {
  const availability = availabilityIn(refs, plan);
  if (!availability) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${AVAILABILITY_TONE[availability]}`}
    >
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}

/**
 * Selector de plan de facturación del portal.
 *
 * Es lo primero que hay que resolver antes de armar una capacitación: según lo
 * que pague el cliente, hay módulos que no se pueden dictar y modelos que no
 * va a poder elegir. Al elegir un plan, el listado se recorta a lo que aplica y
 * lo que queda fuera se puede desplegar aparte, que también sirve para
 * argumentar una mejora de plan.
 */
export function PlanExplorer({
  platformId,
  color,
  plans,
  models,
  modules,
  note,
  initialPlan,
  contractedPlan = null,
}: {
  platformId: string;
  color: string;
  plans: PlanInfo[];
  models: ModelCard[];
  modules: ModuleCard[];
  note: string | null;
  initialPlan: string | null;
  /** El que quedó guardado en el PIN de la empresa, si lo hay. */
  contractedPlan?: string | null;
}) {
  const known = plans.some((p) => p.key === initialPlan);
  const [plan, setPlan] = useState<string | null>(known ? initialPlan : null);

  const selected = plans.find((p) => p.key === plan) ?? null;
  const [showExcluded, setShowExcluded] = useState(false);

  function choose(key: string | null) {
    setPlan(key);
    setShowExcluded(false);
    // La URL se actualiza sin volver al servidor: así el enlace se puede
    // compartir con el plan ya elegido y la ficha de cada módulo lo hereda.
    const url = key ? `/${platformId}?plan=${key}` : `/${platformId}`;
    window.history.replaceState(null, '', url);
  }

  const { included, limited, excluded } = useMemo(() => {
    const counts = { included: 0, limited: 0, excluded: 0 };
    for (const m of modules) {
      const availability = availabilityIn(m.plans, plan);
      if (availability === 'no') counts.excluded += 1;
      else if (availability === 'limitado') counts.limited += 1;
      else counts.included += 1;
    }
    return counts;
  }, [modules, plan]);

  const visible = modules.filter((m) => applies(availabilityIn(m.plans, plan)));
  const hidden = modules.filter((m) => !applies(availabilityIn(m.plans, plan)));
  const href = (slug: string) => (plan ? `/${platformId}/${slug}?plan=${plan}` : `/${platformId}/${slug}`);

  return (
    <>
      {plans.length > 0 && (
        <section className="mb-16">
          <SectionTitle
            kicker="Facturación"
            title="Elige el plan del cliente"
            intro="Cada plan habilita distintos modelos y distintos casos de uso. Al elegir uno, el programa se recorta a lo que esa empresa puede hacer de verdad."
          />

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => choose(null)}
              aria-pressed={plan === null}
              className={`rounded-card border px-4 py-3 text-left transition-colors ${
                plan === null
                  ? 'border-transparent bg-[var(--tone-soft)]'
                  : 'border-line bg-surface hover:bg-surface-2'
              }`}
            >
              <span className="block text-[13.5px] font-semibold">Todos los planes</span>
              <span className="mt-0.5 block text-[12px] text-faint">Sin recorte</span>
            </button>

            {plans.map((p) => {
              const active = p.key === plan;
              return (
                <button
                  key={p.key}
                  onClick={() => choose(p.key)}
                  aria-pressed={active}
                  className={`rounded-card border px-4 py-3 text-left transition-colors ${
                    active
                      ? 'border-transparent bg-[var(--tone-soft)]'
                      : 'border-line bg-surface hover:bg-surface-2'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                    {active && (
                      <span
                        className="size-1.5 flex-none rounded-full"
                        style={{ background: color }}
                        aria-hidden="true"
                      />
                    )}
                    {p.name}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-faint">
                    {p.price} · {p.audience}
                  </span>
                  {p.key === contractedPlan && (
                    <span className="mt-1 block text-[11px] font-semibold" style={{ color }}>
                      Plan contratado
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <Card className="mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
                  {selected.name}
                </h3>
                <span className="font-mono text-[12.5px] text-faint">{selected.price}</span>
              </div>
              {selected.summary && (
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{selected.summary}</p>
              )}
              {selected.note && (
                <p className="mt-1 text-[13px] leading-relaxed text-faint">{selected.note}</p>
              )}
              <p className="mt-3 border-t border-line pt-3 text-[13px] text-muted">
                De {modules.length} módulos:{' '}
                <strong className="font-semibold text-text">{included} sin restricciones</strong>,{' '}
                {limited} con límites y {excluded} fuera del plan.
              </p>
            </Card>
          )}

          {models.length > 0 && (
            <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface shadow-card">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line text-[11.5px] uppercase tracking-[0.06em] text-faint">
                    <th className="px-4 py-2.5 font-medium">Modelo</th>
                    {selected ? (
                      <th className="px-4 py-2.5 font-medium">En {selected.name}</th>
                    ) : (
                      plans.map((p) => (
                        <th key={p.key} className="px-4 py-2.5 font-medium">
                          {p.name}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.id} className="border-b border-line last:border-0 align-top">
                      <td className="px-4 py-3">
                        <span className="block text-[13.5px] font-semibold">{m.name}</span>
                        {m.description && (
                          <span className="mt-0.5 block max-w-[46ch] text-[12.5px] leading-snug text-muted">
                            {m.description}
                          </span>
                        )}
                      </td>
                      {selected ? (
                        <td className="px-4 py-3">
                          <AvailabilityBadge refs={m.plans} plan={selected.key} />
                          {noteIn(m.plans, selected.key) && (
                            <span className="mt-1 block max-w-[38ch] text-[12.5px] leading-snug text-faint">
                              {noteIn(m.plans, selected.key)}
                            </span>
                          )}
                        </td>
                      ) : (
                        plans.map((p) => (
                          <td key={p.key} className="px-4 py-3">
                            <AvailabilityBadge refs={m.plans} plan={p.key} />
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {note && <p className="mt-3 text-[12.5px] leading-relaxed text-faint">{note}</p>}
        </section>
      )}

      <section className="mb-16">
        <SectionTitle
          kicker="Contenido"
          title="Módulos del programa"
          intro={
            selected
              ? `Lo que se puede dictar con ${selected.name}. Se pueden dar en el orden que quieras.`
              : 'Se pueden dictar en el orden que quieras. Cada módulo trae prompts, casos por área y errores frecuentes.'
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => {
            const availability = availabilityIn(m.plans, plan);
            const entry = plan ? null : entryPlan(m.plans, plans);
            return (
              <Link
                key={m.id}
                href={href(m.slug)}
                className="tone group rounded-card border border-line bg-surface p-5 shadow-card transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[var(--tone-soft)] hover:shadow-lift"
                style={{ ['--tone' as string]: m.color }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <Abbr abbr={m.abbr} color={m.color} logo={m.logo} />
                  <h3 className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold tracking-tight">
                    {m.name}
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed text-muted">{m.summary}</p>
                {availability === 'limitado' && noteIn(m.plans, plan) && (
                  <p className="mt-2 text-[12.5px] leading-snug text-faint">{noteIn(m.plans, plan)}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <LevelBadge level={m.level} />
                    {availability === 'limitado' && (
                      <AvailabilityBadge refs={m.plans} plan={plan} />
                    )}
                    {entry && (
                      <span className="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted">
                        Desde {entry.name}
                      </span>
                    )}
                  </span>
                  {m.meta && <span className="text-[11.5px] text-faint">{m.meta}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        {hidden.length > 0 && (
          <div className="mt-5">
            <button
              onClick={() => setShowExcluded((v) => !v)}
              className="text-[13px] font-medium text-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {showExcluded ? 'Ocultar' : 'Ver'} los {hidden.length} módulos que{' '}
              {selected?.name ?? 'el plan'} no cubre
            </button>

            {showExcluded && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hidden.map((m) => {
                  const entry = entryPlan(m.plans, plans);
                  return (
                    <div
                      key={m.id}
                      className="rounded-card border border-dashed border-line bg-surface-2 p-5"
                    >
                      <div className="mb-3 flex items-center gap-2.5 opacity-60">
                        <Abbr abbr={m.abbr} color={m.color} logo={m.logo} />
                        <h3 className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold tracking-tight">
                          {m.name}
                        </h3>
                      </div>
                      <p className="text-[13px] leading-relaxed text-muted">{m.summary}</p>
                      <p className="mt-3 text-[12.5px] font-medium text-faint">
                        {entry
                          ? `Necesita ${entry.name} o superior.`
                          : 'No está disponible en este plan.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
