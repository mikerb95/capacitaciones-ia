/**
 * El brief de un cliente: lo que hace que su material no sea el genérico con
 * otro logo encima.
 *
 * Vive en `clientes/<slug>.json`, fuera de git, porque lleva responsables,
 * canales internos y límites de cada empresa y este repo es público. El
 * formato está documentado en `clientes/EJEMPLO.json`, que sí se versiona.
 *
 * Lo leen dos procesos distintos y por eso es un JSON y no un módulo: el
 * script que genera el material y el servidor de desarrollo que dibuja las
 * rutas imprimibles. Los dos corren en la misma máquina durante la generación.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type BriefCase = {
  area: string;
  situacion: string;
  /** Dónde se resuelve. Solo lo usa la tabla de decisión de Copilot. */
  herramienta?: string;
  nota?: string;
};

export type CompanyBrief = {
  /** La empresa en la base: de ahí salen el nombre, el logo y la vigencia. */
  companyId: number;
  /** Apertura propia de la guía de prompts. Sin esto, va la genérica. */
  intro?: string;
  /** Las áreas reales. Rellenan la tarjeta de atajos y las plantillas. */
  areas?: string[];
  /** Quién responde, por dónde se le escribe y cada cuánto se revisa. */
  responsable?: string;
  canal?: string;
  revision?: string;
  /** Documentos de referencia de la empresa, para las plantillas. */
  documentos?: string[];
  /** Límites propios. Entran al checklist y a la política. */
  limites?: string[];
  /** Reemplazos de los huecos entre corchetes de los prompts. */
  placeholders?: Record<string, string>;
  /** Casos reales, por área. */
  casos?: BriefCase[];
};

export const briefPath = (slug: string) =>
  path.join(process.cwd(), 'clientes', `${slug}.json`);

/** Un slug de verdad, no una ruta disfrazada de slug. */
export const isSlug = (value: string) => /^[a-z0-9][a-z0-9-]{0,48}$/.test(value);

/**
 * Lee y valida el brief. Devuelve `null` si no hay archivo, que es el caso de
 * una empresa sin material a medida; los errores de formato sí se lanzan,
 * porque un brief mal escrito es un dedazo que hay que corregir, no un cliente
 * sin brief.
 */
export async function loadBrief(slug: string): Promise<CompanyBrief | null> {
  if (!isSlug(slug)) throw new Error(`"${slug}" no es un slug válido: minúsculas, números y guiones.`);

  let raw: string;
  try {
    raw = await readFile(briefPath(slug), 'utf8');
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`El brief de ${slug} no es un JSON válido: ${(error as Error).message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`El brief de ${slug} debería ser un objeto.`);
  }

  const brief = parsed as CompanyBrief;
  if (!Number.isInteger(brief.companyId) || brief.companyId <= 0) {
    throw new Error(`El brief de ${slug} necesita el companyId de la empresa en la base.`);
  }

  return brief;
}

/**
 * Todos los huecos que sabe llenar un brief: los que declara a mano más los
 * que se deducen de sus campos. Así el responsable se escribe una vez y sale
 * igual en la política, en las plantillas y en el pie.
 */
export function placeholderMap(brief: CompanyBrief | null): Record<string, string> {
  if (!brief) return {};

  const derived: Record<string, string> = {};
  if (brief.responsable) {
    derived['[responsable]'] = brief.responsable;
    derived['[responsable de TI]'] = brief.responsable;
  }
  if (brief.canal) derived['[canal]'] = brief.canal;
  if (brief.revision) derived['[tres meses]'] = brief.revision;

  // Lo declarado gana sobre lo deducido: si alguien escribe el hueco a mano en
  // el brief, es porque quiere ese texto y no el que sale del campo.
  return { ...derived, ...brief.placeholders };
}

/**
 * Llena los huecos entre corchetes. Lo que el brief no define se queda como
 * estaba, que es justo lo que hay que reemplazar a mano al usarlo.
 */
export function fillPlaceholders(text: string, map: Record<string, string>) {
  if (!Object.keys(map).length) return text;
  return text.replace(/\[[^\]]+\]/g, (hole) => map[hole] ?? hole);
}
