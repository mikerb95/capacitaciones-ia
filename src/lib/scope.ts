import { cache } from 'react';
import { getCodePlanKeys, getScopeModuleIds } from '@/db/queries';
import { requireParticipant } from './session';

/**
 * Alcance de una capacitación: los módulos de IA que el admin dejó marcados al
 * crear el código. `null` significa "sin recorte", es decir, todo el catálogo: así
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

/**
 * Plan contratado por la empresa en cada plataforma. Es una preselección del
 * filtro del portal, no un recorte: lo que no cubre el plan se sigue pudiendo
 * mirar, que es lo que sirve para argumentar una mejora en la sesión.
 */
export const getCodePlans = cache(async (accessCodeId: number) => {
  const rows = await getCodePlanKeys(accessCodeId);
  return new Map(rows.map((r) => [r.platformId, r.key]));
});

/** Sesión del asistente más el alcance de su código, de una sola vez. */
export async function requireScopedParticipant() {
  const participant = await requireParticipant();
  const [scope, plans] = await Promise.all([
    getScope(participant.accessCodeId),
    getCodePlans(participant.accessCodeId),
  ]);
  return { participant, scope, plans };
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
