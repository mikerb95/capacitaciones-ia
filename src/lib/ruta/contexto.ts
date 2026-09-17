import { getCourseProgress, getModuleIdsBySlug, getPlatformPlanMatrix } from '@/db/queries';
import { certificadosHabilitados } from '@/lib/ajustes';
import { SIN_PLAN, applies, availabilityIn, entryPlan, noteIn, type PlanInfo, type PlanRef } from '@/lib/plans';
import { hasModule, hasPlatform, requireScopedParticipant } from '@/lib/scope';
import { cursoEnAlcance, getCurso } from './index';

/**
 * El plan con el que se mira la ruta: el que pide la URL, y si no hay, el que
 * la empresa tiene contratado. Una clave que no existe se ignora, así un
 * enlace viejo no deja a nadie con el curso vacío.
 */
function resolverPlan(
  pedido: string | null | undefined,
  contratado: string | null,
  planes: PlanInfo[],
): string | null {
  if (pedido === SIN_PLAN) return null;
  const clave = pedido ?? contratado;
  return clave && planes.some((p) => p.key === clave) ? clave : null;
}

/**
 * Lo que toda página y acción de la ruta necesita antes de hacer nada: quién
 * es, el curso recortado a su capacitación y lo que ya lleva. `null` significa
 * que para esta persona el curso no existe, y desde afuera eso es un 404.
 *
 * Sobre el alcance del código se aplica un segundo recorte, el del plan de
 * facturación: no tiene sentido que alguien con Copilot Chat gratis dedique
 * horas a las unidades de Word o Excel, que su licencia no habilita. Ese
 * recorte es de lectura, no de permisos: viaja en la URL, se puede cambiar
 * desde el selector y las páginas siguen entregando `cursoCompleto` para lo
 * que tiene que seguir contando entero (el certificado, una lección abierta
 * por enlace directo). Las acciones que guardan avance no pasan plan: quien
 * llegó a una lección fuera de su plan igual puede terminarla.
 */
export async function cargarCurso(platformId: string, planPedido?: string | null) {
  const { participant, scope, plans: contratados } = await requireScopedParticipant();

  const base = getCurso(platformId);
  if (!base || !hasPlatform(scope, platformId)) return null;

  const [moduleIds, registros, certificados, matriz] = await Promise.all([
    getModuleIdsBySlug(platformId),
    getCourseProgress(participant.id, platformId),
    certificadosHabilitados(),
    getPlatformPlanMatrix(platformId),
  ]);

  const cursoCompleto = cursoEnAlcance(base, (slug) => {
    const id = moduleIds.get(slug);
    return id !== undefined && hasModule(scope, id);
  });

  const planContratado = contratados.get(platformId) ?? null;
  const plan = resolverPlan(planPedido, planContratado, matriz.plans);
  const refsDe = (modulo: string): PlanRef[] => matriz.porModulo.get(modulo) ?? [];

  const curso = plan ? cursoEnAlcance(cursoCompleto, (slug) => applies(availabilityIn(refsDe(slug), plan))) : cursoCompleto;

  return {
    participant,
    /** El curso que se muestra: alcance del código y, encima, el plan elegido. */
    curso,
    /** El mismo curso sin el recorte del plan. */
    cursoCompleto,
    registros,
    moduleIds,
    certificados,
    planes: matriz.plans,
    /** La clave del plan con el que se está mirando, o `null` si se ve todo. */
    plan,
    planContratado,
    planElegido: plan ? (matriz.plans.find((p) => p.key === plan) ?? null) : null,
    /** Qué pasa con el módulo de una unidad en el plan elegido. */
    disponibilidad: (modulo: string) => availabilityIn(refsDe(modulo), plan),
    /** El recorte a avisar cuando el módulo entra "con límites". */
    notaDePlan: (modulo: string) => noteIn(refsDe(modulo), plan),
    /** El plan más barato que habilita el módulo, para el "necesita X". */
    planMinimo: (modulo: string) => entryPlan(refsDe(modulo), matriz.plans),
  };
}

export type CursoCargado = NonNullable<Awaited<ReturnType<typeof cargarCurso>>>;
