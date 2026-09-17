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
 * Última actualización del contenido de cada capacitación, por id de
 * plataforma. Mismo criterio que `MODELS_REVISION`: se mueve a mano cuando se
 * toca el temario de ese producto, no cuando se corre el seed. Van en formato
 * ISO (`AAAA-MM-DD`) para poder ordenarlas y formatearlas en la portada.
 */
export const PLATFORM_REVISIONS: Record<string, string> = {
  claude: '2026-09-09',
  chatgpt: '2026-09-16',
  copilot: '2026-09-16',
  gemini: '2026-09-17',
  jira: '2026-09-14',
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
