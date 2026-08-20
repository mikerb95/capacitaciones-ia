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
  // Aviso al pie del bloque de planes: desde cuándo está vigente lo que se
  // muestra y de dónde salió. Los precios cambian seguido, conviene fecharlos.
  plansNote: text('plans_note'),
  status: text('status', { enum: ['completo', 'en-redaccion', 'borrador'] })
    .notNull()
    .default('borrador'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

/* ------------------------------------------------------- planes y modelos */

/** Cómo se cobra el nivel de disponibilidad: se usa en modelos y en módulos. */
export const AVAILABILITY = ['incluido', 'limitado', 'no'] as const;

/**
 * Plan de facturación de una plataforma. `tier` ordena de más barato a más
 * caro dentro de cada público, y es lo que permite decir "desde el plan X".
 */
export const platformPlans = sqliteTable(
  'platform_plans',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    key: text('key').notNull(), // 'free' | 'plus' | 'pro'...
    name: text('name').notNull(),
    price: text('price').notNull(),
    audience: text('audience', { enum: ['Personal', 'Empresa'] })
      .notNull()
      .default('Personal'),
    summary: text('summary'),
    note: text('note'), // límite general del plan, en una línea
    tier: integer('tier').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [
    uniqueIndex('platform_plans_key_idx').on(t.platformId, t.key),
    index('platform_plans_platform_idx').on(t.platformId),
  ],
);

/** Modelo que ofrece la plataforma (GPT-5.6 Sol, Opus 5, Gemini 3.1 Pro...). */
export const platformModels = sqliteTable(
  'platform_models',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [
    uniqueIndex('platform_models_key_idx').on(t.platformId, t.key),
    index('platform_models_platform_idx').on(t.platformId),
  ],
);

/** Qué modelo alcanza cada plan, y con qué recorte. */
export const platformModelPlans = sqliteTable(
  'platform_model_plans',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    modelId: integer('model_id')
      .notNull()
      .references(() => platformModels.id, { onDelete: 'cascade' }),
    planId: integer('plan_id')
      .notNull()
      .references(() => platformPlans.id, { onDelete: 'cascade' }),
    availability: text('availability', { enum: AVAILABILITY })
      .notNull()
      .default('incluido'),
    note: text('note'),
  },
  (t) => [
    uniqueIndex('platform_model_plans_pair_idx').on(t.modelId, t.planId),
    index('platform_model_plans_model_idx').on(t.modelId),
    index('platform_model_plans_plan_idx').on(t.planId),
  ],
);

/**
 * Qué plan hace falta para el caso de uso de un módulo. Sin filas, el módulo
 * se considera disponible en todos los planes: el contenido viejo no se rompe.
 */
export const modulePlans = sqliteTable(
  'module_plans',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    planId: integer('plan_id')
      .notNull()
      .references(() => platformPlans.id, { onDelete: 'cascade' }),
    availability: text('availability', { enum: AVAILABILITY })
      .notNull()
      .default('incluido'),
    note: text('note'),
  },
  (t) => [
    uniqueIndex('module_plans_pair_idx').on(t.moduleId, t.planId),
    index('module_plans_module_idx').on(t.moduleId),
    index('module_plans_plan_idx').on(t.planId),
  ],
);

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
    // Cerrar una sesión la marca, no la borra: la lista de asistencia es lo que
    // la empresa viene a ver, y desaparecía al terminar la presentación.
    endedAt: integer('ended_at', { mode: 'timestamp' }),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    // El PIN solo tiene que ser único entre las sesiones abiertas, así se puede
    // reutilizar un número una vez terminada la sesión que lo tenía.
    uniqueIndex('live_sessions_pin_idx')
      .on(t.pin)
      .where(sql`${t.endedAt} is null`),
    index('live_sessions_deck_idx').on(t.deckId),
  ],
);

export const attendees = sqliteTable(
  'attendees',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionId: integer('session_id')
      .notNull()
      .references(() => liveSessions.id, { onDelete: 'cascade' }),
    // Quien ya entró al portal se enlaza a su registro; queda nulo para el que
    // llega directo al PIN sin código de capacitación.
    participantId: integer('participant_id').references(() => participants.id, {
      onDelete: 'set null',
    }),
    // Copia del nombre al momento de entrar: la lista de la sesión no cambia si
    // después se corrige el nombre en el registro.
    name: text('name').notNull(),
    // Sin participante enlazado, el nombre normalizado evita que la misma
    // persona figure dos veces por recargar la página.
    nameKey: text('name_key').notNull().default(''),
    joinedAt: integer('joined_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    index('attendees_session_idx').on(t.sessionId),
    // Una asistencia por nombre y sesión, venga del portal o del PIN a secas.
    // Dos personas que se llamen igual cuentan como una: es el precio de no
    // pedir nada que las distinga, y es el precio que se decidió pagar.
    uniqueIndex('attendees_session_name_idx').on(t.sessionId, t.nameKey),
  ],
);

/* ------------------------------------------------------------------ empresas */

/**
 * Qué papel juega la empresa en las capacitaciones.
 *
 * `cliente` es quien recibe la capacitación: su gente asiste. `capacitadora`
 * es el intermediario que contrata el trabajo para dictárselo a un tercero, y
 * nunca es el destinatario. `ambas` es la que hace las dos cosas: unas veces
 * capacita a su propia gente, otras te subcontrata para sus clientes.
 */
export const COMPANY_KINDS = ['cliente', 'capacitadora', 'ambas'] as const;

/**
 * Empresa que participa en las capacitaciones, sea porque las recibe, porque
 * las contrata para un tercero, o ambas. Tiene panel propio: sus responsables
 * entran con `panelKey` y ven las capacitaciones que le tocan, sin pasar por
 * el admin.
 */
export const companies = sqliteTable(
  'companies',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    industry: text('industry'),
    /**
     * De qué lado está esta empresa. Recorta los selectores del código: en el de
     * la capacitadora no aparecen los clientes puros, y al revés.
     */
    kind: text('kind', { enum: COMPANY_KINDS }).notNull().default('cliente'),
    /**
     * Logo del cliente, como `data:` URI, para el material a medida.
     *
     * Va en la base y no en un almacenamiento aparte a propósito: son uno por
     * empresa, pesan pocos KB y hacen falta en dos sitios muy distintos (el
     * admin y el generador de documentos, que corre en consola). Una URL
     * externa obligaría a los dos a salir a la red para pintar un logo.
     */
    logo: text('logo'),
    /**
     * Hasta cuándo vale el material a medida de esta empresa. Sin fecha, o
     * pasada la fecha, el portal sirve el material genérico: nadie se queda
     * sin descargas.
     */
    materialsUntil: integer('materials_until', { mode: 'timestamp' }),
    // Clave del panel: se dicta o se manda por escrito al responsable. Es lo
    // único que hace falta para entrar, así que se puede rotar cuando convenga.
    panelKey: text('panel_key').notNull(),
    panelActive: integer('panel_active', { mode: 'boolean' }).notNull().default(true),
    // Contrato bajo el que se dictan las capacitaciones.
    contractRef: text('contract_ref'),
    contractStart: integer('contract_start', { mode: 'timestamp' }),
    contractEnd: integer('contract_end', { mode: 'timestamp' }),
    // Cuántas capacitaciones cubre el contrato: sirve para ver cuánto queda.
    contractSessions: integer('contract_sessions'),
    contractNotes: text('contract_notes'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [uniqueIndex('companies_panel_key_idx').on(t.panelKey)],
);

/**
 * Quien responde por la empresa. El primero de la lista es el responsable
 * principal, el que recibe la clave del panel.
 */
export const companyContacts = sqliteTable(
  'company_contacts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    role: text('role'),
    email: text('email'),
    phone: text('phone'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('company_contacts_company_idx').on(t.companyId)],
);

/* ------------------------------------------------------------------- acceso */

/**
 * Código alfanumérico que se entrega al inicio de una capacitación. Sirve de
 * llave para todo el sitio público: sin uno activo no se entra. Se guarda en
 * mayúsculas y sin separadores, que es la forma en que llega normalizado desde
 * el formulario de ingreso.
 */
export const accessCodes = sqliteTable(
  'access_codes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull(),
    label: text('label').notNull(),
    /**
     * La capacitación se dicta bajo contrato, en nombre de una empresa. Con
     * esto marcado la capacitación aparece en los paneles de las empresas
     * involucradas; sin marcar es una capacitación propia y nadie más la ve.
     */
    contracted: integer('contracted', { mode: 'boolean' }).notNull().default(false),
    /**
     * La empresa destinataria: de quién es la gente que asiste. Es la que
     * manda en todo lo que se ve del lado del asistente, su material a medida
     * y su logo, porque es la empresa a la que él pertenece.
     */
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'set null' }),
    /**
     * La capacitadora que contrató el trabajo, cuando es tercerizado. Vacío
     * cuando la destinataria contrató directo, que es el caso normal.
     *
     * Va aparte de `companyId` porque quien paga y quien recibe dejan de ser
     * la misma empresa en cuanto hay un intermediario, y las dos necesitan
     * cosas distintas: la capacitadora quiere la asistencia para reportarle a
     * su cliente, la destinataria quiere el avance de su gente.
     */
    contractorId: integer('contractor_id').references(() => companies.id, {
      onDelete: 'set null',
    }),
    notes: text('notes'),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    // Código maestro de pruebas: no se cierra, no se borra y su clave queda
    // reservada, así nunca se le entrega a una capacitación real.
    system: integer('system', { mode: 'boolean' }).notNull().default(false),
    ...timestamps,
  },
  (t) => [uniqueIndex('access_codes_code_idx').on(t.code)],
);

/**
 * Alcance de la capacitación: qué módulos de IA ve quien entra con el código.
 * Sin filas, el código abre todo el catálogo.
 */
export const accessCodeModules = sqliteTable(
  'access_code_modules',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    accessCodeId: integer('access_code_id')
      .notNull()
      .references(() => accessCodes.id, { onDelete: 'cascade' }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('access_code_modules_pair_idx').on(t.accessCodeId, t.moduleId),
    index('access_code_modules_code_idx').on(t.accessCodeId),
  ],
);

/**
 * Plan que tiene contratado la empresa en cada plataforma. Es un dato del
 * cliente, no un recorte: el portal abre filtrado por él, pero el selector de
 * plan sigue ahí, que sirve para mostrar en la sesión qué se ganaría subiendo.
 * Sin fila, el portal abre sin filtro.
 */
export const accessCodePlans = sqliteTable(
  'access_code_plans',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    accessCodeId: integer('access_code_id')
      .notNull()
      .references(() => accessCodes.id, { onDelete: 'cascade' }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
    planId: integer('plan_id')
      .notNull()
      .references(() => platformPlans.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('access_code_plans_pair_idx').on(t.accessCodeId, t.platformId),
    index('access_code_plans_code_idx').on(t.accessCodeId),
  ],
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
    // El nombre normalizado (minúsculas, sin tildes) es lo único que identifica
    // a alguien aquí. No verifica nada: sirve para no duplicar a quien vuelve
    // desde otro dispositivo, y el portal no protege nada que valga suplantar.
    nameKey: text('name_key').notNull().default(''),
    token: text('token').notNull(),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('participants_token_idx').on(t.token),
    uniqueIndex('participants_code_name_idx').on(t.accessCodeId, t.nameKey),
    index('participants_code_idx').on(t.accessCodeId),
  ],
);

/**
 * Avance del asistente: un módulo abierto en el portal deja fila. Se cuenta la
 * apertura, no la lectura, así que el panel de la empresa habla de "módulos
 * recorridos" y no promete más de lo que el dato sabe.
 */
export const moduleViews = sqliteTable(
  'module_views',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    participantId: integer('participant_id')
      .notNull()
      .references(() => participants.id, { onDelete: 'cascade' }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    views: integer('views').notNull().default(1),
    firstSeenAt: integer('first_seen_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex('module_views_pair_idx').on(t.participantId, t.moduleId),
    index('module_views_participant_idx').on(t.participantId),
    index('module_views_module_idx').on(t.moduleId),
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
  plans: many(platformPlans),
  models: many(platformModels),
}));

export const platformPlansRelations = relations(platformPlans, ({ one, many }) => ({
  platform: one(platforms, { fields: [platformPlans.platformId], references: [platforms.id] }),
  models: many(platformModelPlans),
  modules: many(modulePlans),
}));

export const platformModelsRelations = relations(platformModels, ({ one, many }) => ({
  platform: one(platforms, { fields: [platformModels.platformId], references: [platforms.id] }),
  plans: many(platformModelPlans),
}));

export const platformModelPlansRelations = relations(platformModelPlans, ({ one }) => ({
  model: one(platformModels, {
    fields: [platformModelPlans.modelId],
    references: [platformModels.id],
  }),
  plan: one(platformPlans, {
    fields: [platformModelPlans.planId],
    references: [platformPlans.id],
  }),
}));

export const modulePlansRelations = relations(modulePlans, ({ one }) => ({
  module: one(modules, { fields: [modulePlans.moduleId], references: [modules.id] }),
  plan: one(platformPlans, { fields: [modulePlans.planId], references: [platformPlans.id] }),
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
  plans: many(modulePlans),
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
  participant: one(participants, {
    fields: [attendees.participantId],
    references: [participants.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  contacts: many(companyContacts),
  // Las que recibe su gente, y las que contrató para otros. Van con nombre
  // explícito porque las dos salen de la misma tabla y drizzle no adivina
  // cuál columna es cuál.
  accessCodes: many(accessCodes, { relationName: 'destinataria' }),
  brokeredCodes: many(accessCodes, { relationName: 'capacitadora' }),
}));

export const companyContactsRelations = relations(companyContacts, ({ one }) => ({
  company: one(companies, { fields: [companyContacts.companyId], references: [companies.id] }),
}));

export const accessCodesRelations = relations(accessCodes, ({ one, many }) => ({
  company: one(companies, {
    fields: [accessCodes.companyId],
    references: [companies.id],
    relationName: 'destinataria',
  }),
  contractor: one(companies, {
    fields: [accessCodes.contractorId],
    references: [companies.id],
    relationName: 'capacitadora',
  }),
  participants: many(participants),
  scope: many(accessCodeModules),
  plans: many(accessCodePlans),
}));

export const accessCodePlansRelations = relations(accessCodePlans, ({ one }) => ({
  accessCode: one(accessCodes, {
    fields: [accessCodePlans.accessCodeId],
    references: [accessCodes.id],
  }),
  platform: one(platforms, {
    fields: [accessCodePlans.platformId],
    references: [platforms.id],
  }),
  plan: one(platformPlans, {
    fields: [accessCodePlans.planId],
    references: [platformPlans.id],
  }),
}));

export const accessCodeModulesRelations = relations(accessCodeModules, ({ one }) => ({
  accessCode: one(accessCodes, {
    fields: [accessCodeModules.accessCodeId],
    references: [accessCodes.id],
  }),
  module: one(modules, { fields: [accessCodeModules.moduleId], references: [modules.id] }),
}));

export const participantsRelations = relations(participants, ({ one, many }) => ({
  accessCode: one(accessCodes, {
    fields: [participants.accessCodeId],
    references: [accessCodes.id],
  }),
  views: many(moduleViews),
}));

export const moduleViewsRelations = relations(moduleViews, ({ one }) => ({
  participant: one(participants, {
    fields: [moduleViews.participantId],
    references: [participants.id],
  }),
  module: one(modules, { fields: [moduleViews.moduleId], references: [modules.id] }),
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
export type PlatformPlan = typeof platformPlans.$inferSelect;
export type PlatformModel = typeof platformModels.$inferSelect;
export type Availability = (typeof AVAILABILITY)[number];
export type Deck = typeof decks.$inferSelect;
export type DeckSlide = typeof deckSlides.$inferSelect;
export type LiveSession = typeof liveSessions.$inferSelect;
export type AccessCode = typeof accessCodes.$inferSelect;
export type AccessCodeModule = typeof accessCodeModules.$inferSelect;
export type AccessCodePlan = typeof accessCodePlans.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type CompanyKind = (typeof COMPANY_KINDS)[number];
export type CompanyContact = typeof companyContacts.$inferSelect;
export type ModuleView = typeof moduleViews.$inferSelect;
