/**
 * Última revisión del catálogo de modelos y planes.
 *
 * Es un dato editorial, no un timestamp: se actualiza a mano cuando alguien
 * vuelve a mirar las páginas de precios y modelos de cada plataforma. Correr
 * el seed no la mueve, y eso es a propósito: la fecha dice cuándo se revisó
 * el contenido, no cuándo se escribió la base.
 *
 * Se muestra en la portada y, dentro de la nota de planes, en cada portal.
 */
export const MODELS_REVISION = 'septiembre de 2026';

/**
 * Cuándo se revisaron por última vez los modelos y planes de cada plataforma
 * contra las páginas del fabricante, por id de plataforma. Mismo criterio que
 * `MODELS_REVISION`: se mueve a mano solo cuando se vuelve a mirar la web del
 * fabricante y se vuelcan los cambios al seed, no cuando se corrige un texto
 * del temario. Van en formato ISO (`AAAA-MM-DD`) para formatearlas en la
 * portada.
 */
export const PLATFORM_REVISIONS: Record<string, string> = {
  claude: '2026-09-09',
  chatgpt: '2026-09-09',
  copilot: '2026-09-09',
  gemini: '2026-09-09',
  jira: '2026-09-12',
};

const FORMATO_FECHA = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** La fecha legible de una plataforma, o `null` si todavía no tiene una. */
export function platformRevision(platformId: string) {
  const iso = PLATFORM_REVISIONS[platformId];
  if (!iso) return null;
  return { iso, texto: FORMATO_FECHA.format(new Date(`${iso}T00:00:00Z`)) };
}
