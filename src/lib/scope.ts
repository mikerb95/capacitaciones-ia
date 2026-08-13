import { cache } from 'react';
import { getScopeModuleIds } from '@/db/queries';
import { requireParticipant } from './session';

/**
 * Alcance de una capacitación: los módulos de IA que el admin dejó marcados al
 * crear el PIN. `null` significa "sin recorte", es decir, todo el catálogo: así
 * los códigos viejos (y el maestro de pruebas) siguen viendo todo.
 */
export type Scope = {
  modules: Set<number>;
  platforms: Set<string>;
} | null;

export const getScope = cache(async (accessCodeId: number): Promise<Scope> => {
  const rows = await getScopeModuleIds(accessCodeId);
  if (rows.length === 0) return null;

  return {
    modules: new Set(rows.map((r) => r.moduleId)),
    platforms: new Set(rows.map((r) => r.platformId)),
  };
});

/** Sesión del asistente más el alcance de su código, de una sola vez. */
export async function requireScopedParticipant() {
  const participant = await requireParticipant();
  const scope = await getScope(participant.accessCodeId);
  return { participant, scope };
}

export const hasModule = (scope: Scope, moduleId: number) => !scope || scope.modules.has(moduleId);

export const hasPlatform = (scope: Scope, platformId: string) =>
  !scope || scope.platforms.has(platformId);

/**
 * Recorta una comparativa al alcance del código: se van los módulos fuera de
 * alcance y, con ellos, las plataformas que quedan vacías.
 */
export function scopeComparison<
  P extends { id: string; modules: { id: number }[] },
>(platforms: P[], scope: Scope): P[] {
  if (!scope) return platforms;

  return platforms
    .map((platform) => ({
      ...platform,
      modules: platform.modules.filter((m) => scope.modules.has(m.id)),
    }))
    .filter((platform) => platform.modules.length > 0);
}
