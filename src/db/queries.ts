import { asc, eq, and } from 'drizzle-orm';
import { db } from './index';
import {
  accessCodeModules,
  accessCodePlans,
  accessCodes,
  decks,
  liveSessions,
  modules,
  platformPlans,
  platforms,
} from './schema';

const bySort = <T extends { sortOrder: unknown }>(t: T) => asc(t.sortOrder as never);

/** Comparativa: solo lo que se pinta en las cards, sin traer el detalle. */
export async function getComparison() {
  return db.query.platforms.findMany({
    orderBy: (p) => [asc(p.sortOrder)],
    with: {
      modules: {
        columns: {
          id: true,
          slug: true,
          name: true,
          shortName: true,
          abbr: true,
          color: true,
          level: true,
          category: true,
          summary: true,
          meta: true,
          status: true,
        },
        orderBy: (m) => [asc(m.sortOrder)],
      },
    },
  });
}

/**
 * Catálogo para el paso de alcance del admin: lo justo para pintar el árbol de
 * módulos y, en cada uno, en qué planes entra. No se usa en la comparativa
 * pública para no mandarle la tabla de facturación al navegador de todos.
 */
export async function getScopeCatalog() {
  return db.query.platforms.findMany({
    orderBy: (p) => [asc(p.sortOrder)],
    with: {
      plans: { orderBy: (p) => [asc(p.sortOrder)] },
      modules: {
        columns: { id: true, slug: true, name: true, abbr: true, color: true, level: true },
        orderBy: (m) => [asc(m.sortOrder)],
        with: { plans: { with: { plan: { columns: { key: true } } } } },
      },
    },
  });
}

/** Portal de una IA: plataforma completa con sus módulos y todo el detalle. */
export async function getPlatform(id: string) {
  return db.query.platforms.findFirst({
    where: eq(platforms.id, id),
    with: {
      stats: { orderBy: bySort },
      specials: { orderBy: bySort },
      downloads: { orderBy: bySort },
      practices: { orderBy: bySort },
      faqs: { orderBy: bySort },
      links: { orderBy: bySort },
      plans: { orderBy: (p) => [asc(p.sortOrder)] },
      models: {
        orderBy: (m) => [asc(m.sortOrder)],
        with: { plans: { with: { plan: { columns: { key: true } } } } },
      },
      modules: {
        orderBy: (m) => [asc(m.sortOrder)],
        with: {
          outcomes: { orderBy: bySort },
          prompts: { orderBy: bySort },
          steps: { orderBy: bySort },
          roles: { orderBy: bySort },
          mistakes: { orderBy: bySort },
          plans: { with: { plan: { columns: { key: true } } } },
        },
      },
    },
  });
}

export async function getPlatformIds() {
  return db
    .select({ id: platforms.id, name: platforms.name, color: platforms.color })
    .from(platforms)
    .orderBy(asc(platforms.sortOrder));
}

/** Un módulo con todo su detalle, para la ficha y para el admin. */
export async function getModule(platformId: string, slug: string) {
  return db.query.modules.findFirst({
    where: and(eq(modules.platformId, platformId), eq(modules.slug, slug)),
    with: {
      platform: true,
      outcomes: { orderBy: bySort },
      prompts: { orderBy: bySort },
      steps: { orderBy: bySort },
      roles: { orderBy: bySort },
      mistakes: { orderBy: bySort },
      plans: { with: { plan: true } },
    },
  });
}

export async function getModuleById(id: number) {
  return db.query.modules.findFirst({
    where: eq(modules.id, id),
    with: {
      platform: true,
      outcomes: { orderBy: bySort },
      prompts: { orderBy: bySort },
      steps: { orderBy: bySort },
      roles: { orderBy: bySort },
      mistakes: { orderBy: bySort },
      plans: { with: { plan: true } },
    },
  });
}

/** Admin: listado plano de módulos con su plataforma. */
export async function getAllModules() {
  return db.query.modules.findMany({
    orderBy: (m) => [asc(m.platformId), asc(m.sortOrder)],
    with: { platform: { columns: { id: true, name: true, color: true, initial: true } } },
  });
}

export type Comparison = Awaited<ReturnType<typeof getComparison>>;
export type ScopeCatalog = Awaited<ReturnType<typeof getScopeCatalog>>;
export type PlatformFull = NonNullable<Awaited<ReturnType<typeof getPlatform>>>;
export type ModuleFull = NonNullable<Awaited<ReturnType<typeof getModule>>>;
export type ModuleRow = Awaited<ReturnType<typeof getAllModules>>[number];

/* ------------------------------------------------------------ presentaciones */

export async function getDecks() {
  return db.query.decks.findMany({
    orderBy: (d) => [asc(d.sortOrder), asc(d.id)],
    with: {
      platform: { columns: { id: true, name: true, color: true, initial: true } },
      slides: { columns: { id: true, title: true, sortOrder: true }, orderBy: bySort },
    },
  });
}

export async function getDeck(slug: string) {
  return db.query.decks.findFirst({
    where: eq(decks.slug, slug),
    with: {
      platform: true,
      slides: { orderBy: bySort },
    },
  });
}

/** Sesión en vivo por PIN, con el mazo y sus láminas. */
export async function getLiveByPin(pin: string) {
  return db.query.liveSessions.findFirst({
    where: eq(liveSessions.pin, pin),
    with: { deck: { with: { slides: { orderBy: bySort } } } },
  });
}

export async function getActiveSession(deckId: number) {
  return db.query.liveSessions.findFirst({
    where: eq(liveSessions.deckId, deckId),
    orderBy: (s, { desc }) => [desc(s.startedAt)],
    with: { attendees: true },
  });
}

/* ------------------------------------------------------------------- acceso */

/** Códigos de capacitación con la gente que entró con cada uno. */
export async function getAccessCodes() {
  return db.query.accessCodes.findMany({
    orderBy: (c, { desc }) => [desc(c.active), desc(c.createdAt)],
    with: {
      participants: { orderBy: (p, { desc }) => [desc(p.createdAt)] },
      scope: { columns: { moduleId: true } },
      plans: { with: { plan: { columns: { name: true } } } },
    },
  });
}

/** Un código con su perfil de empresa y su alcance, para la pantalla de edición. */
export async function getAccessCode(id: number) {
  return db.query.accessCodes.findFirst({
    where: eq(accessCodes.id, id),
    with: {
      scope: { columns: { moduleId: true } },
      plans: { with: { plan: { columns: { key: true } } } },
    },
  });
}

/**
 * Plan contratado por plataforma, para el portal. Devuelve la clave del plan,
 * que es lo que entiende el filtro (`?plan=pro`).
 */
export async function getCodePlanKeys(accessCodeId: number) {
  const rows = await db
    .select({ platformId: accessCodePlans.platformId, key: platformPlans.key })
    .from(accessCodePlans)
    .innerJoin(platformPlans, eq(accessCodePlans.planId, platformPlans.id))
    .where(eq(accessCodePlans.accessCodeId, accessCodeId));

  return rows;
}

/** Los módulos de IA en scope de un código, con su plataforma. */
export async function getScopeModuleIds(accessCodeId: number) {
  const rows = await db
    .select({ moduleId: accessCodeModules.moduleId, platformId: modules.platformId })
    .from(accessCodeModules)
    .innerJoin(modules, eq(accessCodeModules.moduleId, modules.id))
    .where(eq(accessCodeModules.accessCodeId, accessCodeId));

  return rows;
}

export type AccessCodeRow = Awaited<ReturnType<typeof getAccessCodes>>[number];
export type AccessCodeFull = NonNullable<Awaited<ReturnType<typeof getAccessCode>>>;

export type DeckRow = Awaited<ReturnType<typeof getDecks>>[number];
export type DeckFull = NonNullable<Awaited<ReturnType<typeof getDeck>>>;
