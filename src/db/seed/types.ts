import type { Availability, Level } from '../schema';

/** Un plan de facturación de la plataforma. `tier` ordena de menor a mayor. */
export type PlanSeed = {
  key: string;
  name: string;
  price: string;
  audience: 'Personal' | 'Empresa';
  summary?: string;
  note?: string;
  tier: number;
};

/** Disponibilidad de algo (modelo o módulo) dentro de un plan. */
export type PlanRefSeed = { plan: string; availability?: Availability; note?: string };

export type ModelSeed = {
  key: string;
  name: string;
  description?: string;
  plans: PlanRefSeed[];
};

/**
 * Todo lo que sabe una plataforma sobre facturación: sus planes, sus modelos y
 * en qué plan entra cada módulo. Vive aparte del contenido editorial porque se
 * revisa con otra frecuencia: los precios cambian, los módulos no.
 */
export type PlansSeed = {
  note: string;
  plans: PlanSeed[];
  models: ModelSeed[];
  /** slug del módulo -> planes que lo incluyen */
  modules: Record<string, PlanRefSeed[]>;
};

export type ModuleSeed = {
  slug: string;
  name: string;
  shortName: string;
  abbr: string;
  color: string;
  level: Level;
  category?: string;
  summary: string;
  intro?: string;
  meta?: string;
  outcomes?: string[];
  prompts?: { tag: string; text: string }[];
  baIntro?: string;
  before?: string;
  beforeTime?: string;
  after?: string;
  afterTime?: string;
  steps?: { title: string; description: string }[];
  roles?: { role: string; task: string; detail: string }[];
  mistakes?: { bad: string; good: string }[];
  mockTitle?: string;
  mockPrompt?: string;
  mockReply?: string;
  mockPanelTitle?: string;
  mockPanel?: string;
  status?: 'publicado' | 'borrador';
};

export type PlatformSeed = {
  id: string;
  name: string;
  portalName: string;
  initial: string;
  color: string;
  description?: string;
  tagline?: string;
  inputHint?: string;
  badge?: string;
  heroTitle?: string;
  heroText?: string;
  specialTitle?: string;
  specialIntro?: string;
  helpTitle?: string;
  helpText?: string;
  status: 'completo' | 'en-redaccion' | 'borrador';
  stats?: { value: string; label: string }[];
  specials?: { kicker: string; title: string; description: string; example?: string }[];
  downloads?: { title: string; description?: string; meta?: string; href?: string }[];
  practices?: { number: string; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  links?: { label: string; href: string }[];
  modules: ModuleSeed[];
};
