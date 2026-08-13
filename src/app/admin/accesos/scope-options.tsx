import { Abbr, PlatformMark } from '@/components/ui';
import type { ScopePlatformOption } from '@/components/access-code-form';
import { moduleLogo, platformLogo } from '@/lib/brand-logos';
import { getComparison } from '@/db/queries';

/**
 * El árbol de módulos de IA con sus componentes, para el paso de alcance. Los
 * cuadritos de marca se arman acá, en el servidor, para no mandar el catálogo
 * de logos SVG al bundle del navegador.
 */
export async function getScopeOptions(): Promise<ScopePlatformOption[]> {
  const platforms = await getComparison();

  return platforms.map((platform) => ({
    id: platform.id,
    name: platform.name,
    color: platform.color,
    mark: (
      <PlatformMark
        initial={platform.initial}
        color={platform.color}
        size={24}
        logo={platformLogo(platform.id)}
      />
    ),
    modules: platform.modules.map((m) => ({
      id: m.id,
      name: m.name,
      level: m.level,
      mark: (
        <Abbr abbr={m.abbr} color={m.color} size={20} logo={moduleLogo(platform.id, m.slug)} />
      ),
    })),
  }));
}
