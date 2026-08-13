import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};

/* ---------------------------------------------------------------- plataformas */

export const platforms = sqliteTable('platforms', {
  id: text('id').primaryKey(), // 'claude' | 'gemini' | 'chatgpt' | 'copilot'
  name: text('name').notNull(),
  portalName: text('portal_name').notNull(),
  initial: text('initial').notNull(),
  color: text('color').notNull(),
  tagline: text('tagline'),
  inputHint: text('input_hint'),
  badge: text('badge'),
  heroTitle: text('hero_title'),
  heroText: text('hero_text'),
  specialTitle: text('special_title'),
  specialIntro: text('special_intro'),
  helpTitle: text('help_title'),
  helpText: text('help_text'),
  description: text('description'),
  status: text('status', { enum: ['completo', 'en-redaccion', 'borrador'] })
    .notNull()
    .default('borrador'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const platformStats = sqliteTable(
  'platform_stats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    label: text('label').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('platform_stats_platform_idx').on(t.platformId)],
);

export const platformSpecials = sqliteTable(
  'platform_specials',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    kicker: text('kicker').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    example: text('example'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('platform_specials_platform_idx').on(t.platformId)],
);

export const platformDownloads = sqliteTable(
  'platform_downloads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    meta: text('meta'),
    href: text('href'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('platform_downloads_platform_idx').on(t.platformId)],
);

export const platformPractices = sqliteTable(
  'platform_practices',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    number: text('number').notNull(), // '01', '02'...
    title: text('title').notNull(),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('platform_practices_platform_idx').on(t.platformId)],
);

export const platformFaqs = sqliteTable(
  'platform_faqs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('platform_faqs_platform_idx').on(t.platformId)],
);

export const platformLinks = sqliteTable(
  'platform_links',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    href: text('href').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('platform_links_platform_idx').on(t.platformId)],
);

/* -------------------------------------------------------------------- módulos */

export const modules = sqliteTable(
  'modules',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    shortName: text('short_name').notNull(),
    abbr: text('abbr').notNull(),
    color: text('color').notNull(),
    level: text('level', { enum: ['Básico', 'Intermedio', 'Avanzado'] }).notNull(),
    category: text('category'),
    summary: text('summary').notNull(),
    intro: text('intro'),
    meta: text('meta'),
    // bloque antes / después, 1:1 con el módulo
    baIntro: text('ba_intro'),
    before: text('before'),
    beforeTime: text('before_time'),
    after: text('after'),
    afterTime: text('after_time'),
    // mock de conversación, 1:1 con el módulo
    mockTitle: text('mock_title'),
    mockPrompt: text('mock_prompt'),
    mockReply: text('mock_reply'),
    mockPanelTitle: text('mock_panel_title'),
    mockPanel: text('mock_panel'),
    status: text('status', { enum: ['publicado', 'borrador'] })
      .notNull()
      .default('publicado'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('modules_platform_slug_idx').on(t.platformId, t.slug),
    index('modules_platform_idx').on(t.platformId),
  ],
);

export const moduleOutcomes = sqliteTable(
  'module_outcomes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('module_outcomes_module_idx').on(t.moduleId)],
);

export const modulePrompts = sqliteTable(
  'module_prompts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    tag: text('tag').notNull(),
    text: text('text').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('module_prompts_module_idx').on(t.moduleId)],
);

export const moduleSteps = sqliteTable(
  'module_steps',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('module_steps_module_idx').on(t.moduleId)],
);

export const moduleRoles = sqliteTable(
  'module_roles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    task: text('task').notNull(),
    detail: text('detail').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('module_roles_module_idx').on(t.moduleId)],
);

export const moduleMistakes = sqliteTable(
  'module_mistakes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    bad: text('bad').notNull(),
    good: text('good').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('module_mistakes_module_idx').on(t.moduleId)],
);

/* ------------------------------------------------------------ presentaciones */

export const decks = sqliteTable(
  'decks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    meta: text('meta'),
    // Plataforma a la que pertenece la sesión, opcional.
    platformId: text('platform_id').references(() => platforms.id, { onDelete: 'set null' }),
    // Los <style> del artifact, compartidos por todas las láminas del mazo.
    styles: text('styles'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex('decks_slug_idx').on(t.slug)],
);

export const deckSlides = sqliteTable(
  'deck_slides',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deckId: integer('deck_id')
      .notNull()
      .references(() => decks.id, { onDelete: 'cascade' }),
    // Título derivado del primer encabezado, para el índice y las notas.
    title: text('title'),
    html: text('html').notNull(),
    notes: text('notes'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('deck_slides_deck_idx').on(t.deckId)],
);

/** Sesión en vivo: el expositor manda, la audiencia sigue por PIN. */
export const liveSessions = sqliteTable(
  'live_sessions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deckId: integer('deck_id')
      .notNull()
      .references(() => decks.id, { onDelete: 'cascade' }),
    pin: text('pin').notNull(),
    slide: integer('slide').notNull().default(0),
    playing: integer('playing', { mode: 'boolean' }).notNull().default(true),
    startedAt: integer('started_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('live_sessions_pin_idx').on(t.pin)],
);

export const attendees = sqliteTable(
  'attendees',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionId: integer('session_id')
      .notNull()
      .references(() => liveSessions.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    phone: text('phone'),
    joinedAt: integer('joined_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index('attendees_session_idx').on(t.sessionId)],
);

/* ------------------------------------------------------------------- acceso */

/**
 * Código de 4 dígitos que se entrega al inicio de una capacitación. Sirve de
 * llave para todo el sitio público: sin uno activo no se entra.
 */
export const accessCodes = sqliteTable(
  'access_codes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull(),
    label: text('label').notNull(),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    // Código maestro de pruebas: no se cierra, no se borra y su número queda
    // reservado, así nunca se le entrega a una capacitación real.
    system: integer('system', { mode: 'boolean' }).notNull().default(false),
    ...timestamps,
  },
  (t) => [uniqueIndex('access_codes_code_idx').on(t.code)],
);

/**
 * Quien entró con un código. El token es lo que viaja en la cookie: así la
 * sesión se puede revocar desde la base y la cookie no lleva datos personales.
 */
export const participants = sqliteTable(
  'participants',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    accessCodeId: integer('access_code_id')
      .notNull()
      .references(() => accessCodes.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    phone: text('phone').notNull(), // normalizado a +dígitos, listo para WhatsApp
    token: text('token').notNull(),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('participants_token_idx').on(t.token),
    // El mismo teléfono en la misma capacitación es la misma persona.
    uniqueIndex('participants_code_phone_idx').on(t.accessCodeId, t.phone),
    index('participants_code_idx').on(t.accessCodeId),
  ],
);

/* ------------------------------------------------------------------ relations */

export const platformsRelations = relations(platforms, ({ many }) => ({
  modules: many(modules),
  stats: many(platformStats),
  specials: many(platformSpecials),
  downloads: many(platformDownloads),
  practices: many(platformPractices),
  faqs: many(platformFaqs),
  links: many(platformLinks),
}));

export const platformStatsRelations = relations(platformStats, ({ one }) => ({
  platform: one(platforms, { fields: [platformStats.platformId], references: [platforms.id] }),
}));

export const platformSpecialsRelations = relations(platformSpecials, ({ one }) => ({
  platform: one(platforms, { fields: [platformSpecials.platformId], references: [platforms.id] }),
}));

export const platformDownloadsRelations = relations(platformDownloads, ({ one }) => ({
  platform: one(platforms, { fields: [platformDownloads.platformId], references: [platforms.id] }),
}));

export const platformPracticesRelations = relations(platformPractices, ({ one }) => ({
  platform: one(platforms, { fields: [platformPractices.platformId], references: [platforms.id] }),
}));

export const platformFaqsRelations = relations(platformFaqs, ({ one }) => ({
  platform: one(platforms, { fields: [platformFaqs.platformId], references: [platforms.id] }),
}));

export const platformLinksRelations = relations(platformLinks, ({ one }) => ({
  platform: one(platforms, { fields: [platformLinks.platformId], references: [platforms.id] }),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  platform: one(platforms, { fields: [modules.platformId], references: [platforms.id] }),
  outcomes: many(moduleOutcomes),
  prompts: many(modulePrompts),
  steps: many(moduleSteps),
  roles: many(moduleRoles),
  mistakes: many(moduleMistakes),
}));

export const moduleOutcomesRelations = relations(moduleOutcomes, ({ one }) => ({
  module: one(modules, { fields: [moduleOutcomes.moduleId], references: [modules.id] }),
}));

export const modulePromptsRelations = relations(modulePrompts, ({ one }) => ({
  module: one(modules, { fields: [modulePrompts.moduleId], references: [modules.id] }),
}));

export const moduleStepsRelations = relations(moduleSteps, ({ one }) => ({
  module: one(modules, { fields: [moduleSteps.moduleId], references: [modules.id] }),
}));

export const moduleRolesRelations = relations(moduleRoles, ({ one }) => ({
  module: one(modules, { fields: [moduleRoles.moduleId], references: [modules.id] }),
}));

export const moduleMistakesRelations = relations(moduleMistakes, ({ one }) => ({
  module: one(modules, { fields: [moduleMistakes.moduleId], references: [modules.id] }),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  platform: one(platforms, { fields: [decks.platformId], references: [platforms.id] }),
  slides: many(deckSlides),
  sessions: many(liveSessions),
}));

export const deckSlidesRelations = relations(deckSlides, ({ one }) => ({
  deck: one(decks, { fields: [deckSlides.deckId], references: [decks.id] }),
}));

export const liveSessionsRelations = relations(liveSessions, ({ one, many }) => ({
  deck: one(decks, { fields: [liveSessions.deckId], references: [decks.id] }),
  attendees: many(attendees),
}));

export const attendeesRelations = relations(attendees, ({ one }) => ({
  session: one(liveSessions, { fields: [attendees.sessionId], references: [liveSessions.id] }),
}));

export const accessCodesRelations = relations(accessCodes, ({ many }) => ({
  participants: many(participants),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  accessCode: one(accessCodes, {
    fields: [participants.accessCodeId],
    references: [accessCodes.id],
  }),
}));

/* ---------------------------------------------------------------------- tipos */

export type Platform = typeof platforms.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type ModulePrompt = typeof modulePrompts.$inferSelect;
export type ModuleStep = typeof moduleSteps.$inferSelect;
export type ModuleRole = typeof moduleRoles.$inferSelect;
export type ModuleMistake = typeof moduleMistakes.$inferSelect;
export type ModuleOutcome = typeof moduleOutcomes.$inferSelect;
export type Level = Module['level'];
export type Deck = typeof decks.$inferSelect;
export type DeckSlide = typeof deckSlides.$inferSelect;
export type LiveSession = typeof liveSessions.$inferSelect;
export type AccessCode = typeof accessCodes.$inferSelect;
export type Participant = typeof participants.$inferSelect;
