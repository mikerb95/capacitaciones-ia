import type { Availability } from '@/db/schema';

/** Lo mínimo que necesita la UI de una fila de disponibilidad. */
export type PlanRef = {
  availability: Availability;
  note: string | null;
  plan: { key: string };
};

/** Lo mínimo que necesita la UI de un plan. */
export type PlanInfo = {
  key: string;
  name: string;
  price: string;
  audience: 'Personal' | 'Empresa';
  summary: string | null;
  note: string | null;
  tier: number;
};

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  incluido: 'Incluido',
  limitado: 'Con límites',
  no: 'No disponible',
};

/** Clases de la insignia. El verde es del sistema, el ámbar avisa del recorte. */
export const AVAILABILITY_TONE: Record<Availability, string> = {
  incluido: 'bg-accent-soft text-accent',
  limitado: 'bg-[#fdebe2] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]',
  no: 'bg-surface-2 text-faint',
};

/**
 * Qué pasa con este contenido en el plan elegido.
 *
 * Sin plan elegido devuelve `null`: no hay filtro, se muestra todo. Un
 * contenido sin filas de plan se considera disponible en todos, así el material
 * que todavía no se revisó no desaparece del portal.
 */
export function availabilityIn(refs: PlanRef[], planKey: string | null): Availability | null {
  if (!planKey) return null;
  if (refs.length === 0) return 'incluido';
  return refs.find((r) => r.plan.key === planKey)?.availability ?? 'no';
}

export function noteIn(refs: PlanRef[], planKey: string | null): string | null {
  if (!planKey) return null;
  return refs.find((r) => r.plan.key === planKey)?.note ?? null;
}

/** Se puede dictar: sin filtro, o disponible aunque sea con recortes. */
export const applies = (availability: Availability | null) => availability !== 'no';

/**
 * El plan más barato que habilita el contenido, para el "Desde Plus" de las
 * cards. Devuelve `null` cuando ya entra en el plan más barato de todos.
 */
export function entryPlan(refs: PlanRef[], plans: PlanInfo[]): PlanInfo | null {
  if (refs.length === 0) return null;

  const available = new Set(refs.filter((r) => r.availability !== 'no').map((r) => r.plan.key));
  const ordered = [...plans].sort((a, b) => a.tier - b.tier);
  const first = ordered.find((p) => available.has(p.key));

  if (!first || first.key === ordered[0]?.key) return null;
  return first;
}
