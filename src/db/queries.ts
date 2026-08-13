import { asc, eq, and } from 'drizzle-orm';
import { db } from './index';
import { decks, liveSessions, modules, platforms } from './schema';

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
      modules: {
        orderBy: (m) => [asc(m.sortOrder)],
        with: {
          outcomes: { orderBy: bySort },
          prompts: { orderBy: bySort },
          steps: { orderBy: bySort },
          roles: { orderBy: bySort },
          mistakes: { orderBy: bySort },
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
    with: { participants: { orderBy: (p, { desc }) => [desc(p.createdAt)] } },
  });
}

export type AccessCodeRow = Awaited<ReturnType<typeof getAccessCodes>>[number];

export type DeckRow = Awaited<ReturnType<typeof getDecks>>[number];
export type DeckFull = NonNullable<Awaited<ReturnType<typeof getDeck>>>;
