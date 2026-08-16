import { asc, desc, eq, and, isNull, sql } from 'drizzle-orm';
import { db } from './index';
import {
  accessCodeModules,
  accessCodePlans,
  accessCodes,
  attendees,
  companies,
  decks,
  liveSessions,
  moduleViews,
  modules,
  participants,
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

/**
 * Una sesión sigue abierta mientras no tenga fecha de cierre. Las cerradas se
 * conservan por su lista de asistencia, así que hay que excluirlas a mano en
 * todo lo que busque "la sesión de ahora".
 */
export const sessionOpen = isNull(liveSessions.endedAt);

/** Sesión en vivo por PIN, con el mazo y sus láminas. */
export async function getLiveByPin(pin: string) {
  return db.query.liveSessions.findFirst({
    where: and(eq(liveSessions.pin, pin), sessionOpen),
    with: { deck: { with: { slides: { orderBy: bySort } } } },
  });
}

export async function getActiveSession(deckId: number) {
  return db.query.liveSessions.findFirst({
    where: and(eq(liveSessions.deckId, deckId), sessionOpen),
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
      company: { columns: { id: true, name: true, industry: true } },
      participants: {
        orderBy: (p, { desc }) => [desc(p.createdAt)],
        with: { views: { columns: { moduleId: true } } },
      },
      scope: { columns: { moduleId: true } },
      plans: { with: { plan: { columns: { name: true } } } },
    },
  });
}

/** Un código con su empresa y su alcance, para la pantalla de edición. */
export async function getAccessCode(id: number) {
  return db.query.accessCodes.findFirst({
    where: eq(accessCodes.id, id),
    with: {
      company: { columns: { id: true, name: true } },
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

/**
 * Las plataformas que le tocan al material a medida de una empresa: la unión
 * de los alcances de todos sus códigos.
 *
 * Un código sin filas de alcance abre el catálogo entero, así que si la
 * empresa tiene uno así, le corresponden todas las plataformas. Devuelve
 * `null` en ese caso, con el mismo significado que en `Scope`: sin recorte.
 */
export async function getCompanyPlatforms(companyId: number): Promise<string[] | null> {
  const codes = await db
    .select({ id: accessCodes.id })
    .from(accessCodes)
    .where(eq(accessCodes.companyId, companyId));

  if (codes.length === 0) return [];

  const scopes = await Promise.all(codes.map((c) => getScopeModuleIds(c.id)));
  if (scopes.some((rows) => rows.length === 0)) return null;

  return [...new Set(scopes.flat().map((r) => r.platformId))].sort();
}

export type AccessCodeRow = Awaited<ReturnType<typeof getAccessCodes>>[number];
export type AccessCodeFull = NonNullable<Awaited<ReturnType<typeof getAccessCode>>>;

/* ----------------------------------------------------------------- empresas */

const byOrder = <T extends { sortOrder: unknown; id: unknown }>(t: T) => [
  asc(t.sortOrder as never),
  asc(t.id as never),
];

/** Empresas del admin, con sus responsables y las capacitaciones que llevan. */
export async function getCompanies() {
  return db.query.companies.findMany({
    orderBy: (c) => [asc(c.name)],
    with: {
      contacts: { orderBy: byOrder },
      accessCodes: {
        columns: { id: true, code: true, label: true, active: true, contracted: true },
        orderBy: (c, { desc }) => [desc(c.createdAt)],
        with: { participants: { columns: { id: true } } },
      },
    },
  });
}

/** Una empresa con todo lo suyo, para la pantalla de edición. */
export async function getCompany(id: number) {
  return db.query.companies.findFirst({
    where: eq(companies.id, id),
    with: {
      contacts: { orderBy: byOrder },
      accessCodes: {
        orderBy: (c, { desc }) => [desc(c.createdAt)],
        with: { participants: { columns: { id: true } } },
      },
    },
  });
}

/** Empresas para el selector del formulario de capacitación. */
export async function getCompanyOptions() {
  return db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .orderBy(asc(companies.name));
}

/**
 * Lo que ve el panel de la empresa: solo las capacitaciones marcadas como
 * dictadas bajo contrato, con su gente y los módulos que cada uno recorrió.
 * El teléfono no sale de aquí: lo dieron para la capacitación, no para la
 * empresa.
 */
export async function getCompanyTrainings(companyId: number) {
  return db.query.accessCodes.findMany({
    where: and(eq(accessCodes.companyId, companyId), eq(accessCodes.contracted, true)),
    orderBy: (c, { desc }) => [desc(c.createdAt)],
    columns: { id: true, code: true, label: true, active: true, createdAt: true, notes: true },
    with: {
      scope: { columns: { moduleId: true } },
      plans: {
        with: {
          plan: { columns: { name: true } },
          platform: { columns: { id: true, name: true } },
        },
      },
      participants: {
        columns: { id: true, name: true, createdAt: true, lastSeenAt: true },
        orderBy: (p, { desc }) => [desc(p.createdAt)],
        with: { views: { columns: { moduleId: true, views: true, lastSeenAt: true } } },
      },
    },
  });
}

/**
 * Asistencia a las sesiones en vivo de una capacitación, agrupada por sesión.
 * Se llega a ellas por la gente: una sesión pertenece a la capacitación si
 * asistió alguien que entró con su código.
 */
export async function getTrainingSessions(accessCodeId: number) {
  const rows = await db
    .select({
      sessionId: attendees.sessionId,
      startedAt: liveSessions.startedAt,
      endedAt: liveSessions.endedAt,
      deckTitle: decks.title,
      name: attendees.name,
      joinedAt: attendees.joinedAt,
    })
    .from(attendees)
    .innerJoin(participants, eq(attendees.participantId, participants.id))
    .innerJoin(liveSessions, eq(attendees.sessionId, liveSessions.id))
    .innerJoin(decks, eq(liveSessions.deckId, decks.id))
    .where(eq(participants.accessCodeId, accessCodeId))
    .orderBy(desc(liveSessions.startedAt), asc(attendees.name));

  const bySession = new Map<number, TrainingSession>();

  for (const row of rows) {
    const session = bySession.get(row.sessionId) ?? {
      id: row.sessionId,
      title: row.deckTitle,
      startedAt: row.startedAt,
      endedAt: row.endedAt,
      people: [] as { name: string; joinedAt: Date }[],
    };

    session.people.push({ name: row.name, joinedAt: row.joinedAt });
    bySession.set(row.sessionId, session);
  }

  return [...bySession.values()];
}

export type TrainingSession = {
  id: number;
  title: string;
  startedAt: Date;
  endedAt: Date | null;
  people: { name: string; joinedAt: Date }[];
};

export type CompanyRow = Awaited<ReturnType<typeof getCompanies>>[number];
export type CompanyFull = NonNullable<Awaited<ReturnType<typeof getCompany>>>;
export type CompanyTraining = Awaited<ReturnType<typeof getCompanyTrainings>>[number];

/* ------------------------------------------------------------------- avance */

/**
 * Deja constancia de que el asistente abrió un módulo. Se cuenta la apertura y
 * se pisa la fecha, así el panel puede decir cuándo fue la última vez.
 */
export async function recordModuleView(participantId: number, moduleId: number) {
  const now = new Date();

  await db
    .insert(moduleViews)
    .values({ participantId, moduleId, views: 1, firstSeenAt: now, lastSeenAt: now })
    .onConflictDoUpdate({
      target: [moduleViews.participantId, moduleViews.moduleId],
      set: { views: sql`${moduleViews.views} + 1`, lastSeenAt: now },
    });
}

export type DeckRow = Awaited<ReturnType<typeof getDecks>>[number];
export type DeckFull = NonNullable<Awaited<ReturnType<typeof getDeck>>>;
