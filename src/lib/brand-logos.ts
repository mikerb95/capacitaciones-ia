import { hasLogo } from './logos';

/**
 * Qué logo le toca a cada portal y a cada módulo. Vive acá y no en la base
 * porque es una propiedad de la marca, no del contenido editable: los seeds y
 * el admin siguen guardando solo `initial` y `abbr`, que son el fallback
 * cuando el módulo no corresponde a un producto con logo propio (Cowork,
 * Gems, Canvas...).
 */
export const PLATFORM_LOGOS: Record<string, string> = {
  copilot: 'copilot',
  claude: 'claude',
  gemini: 'gemini',
  chatgpt: 'chatgpt',
};

const MODULE_LOGOS: Record<string, string> = {
  'copilot/chat': 'copilot-chat',
  'copilot/word': 'word',
  'copilot/excel': 'excel',
  'copilot/ppt': 'powerpoint',
  'copilot/teams': 'teams',
  'copilot/outlook': 'outlook',
  'claude/code': 'claude-code',
  'claude/chrome': 'chrome',
  'chatgpt/codex': 'codex',
  'chatgpt/sora': 'sora',
  'gemini/notebook': 'notebooklm',
};

export function platformLogo(platformId: string): string | undefined {
  const name = PLATFORM_LOGOS[platformId];
  return hasLogo(name) ? name : undefined;
}

export function moduleLogo(platformId: string, slug: string): string | undefined {
  const name = MODULE_LOGOS[`${platformId}/${slug}`];
  return hasLogo(name) ? name : undefined;
}
