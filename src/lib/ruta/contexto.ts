import { getCourseProgress, getModuleIdsBySlug } from '@/db/queries';
import { hasModule, hasPlatform, requireScopedParticipant } from '@/lib/scope';
import { cursoEnAlcance, getCurso } from './index';

/**
 * Lo que toda página y acción de la ruta necesita antes de hacer nada: quién
 * es, el curso recortado a su capacitación y lo que ya lleva. `null` significa
 * que para esta persona el curso no existe, y desde afuera eso es un 404.
 */
export async function cargarCurso(platformId: string) {
  const { participant, scope } = await requireScopedParticipant();

  const base = getCurso(platformId);
  if (!base || !hasPlatform(scope, platformId)) return null;

  const [moduleIds, registros] = await Promise.all([
    getModuleIdsBySlug(platformId),
    getCourseProgress(participant.id, platformId),
  ]);

  const curso = cursoEnAlcance(base, (slug) => {
    const id = moduleIds.get(slug);
    return id !== undefined && hasModule(scope, id);
  });

  return { participant, curso, registros, moduleIds };
}

export type CursoCargado = NonNullable<Awaited<ReturnType<typeof cargarCurso>>>;
