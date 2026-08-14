import { Abbr, PlatformMark } from '@/components/ui';
import type { ScopePlatformOption } from '@/components/access-code-form';
import { moduleLogo, platformLogo } from '@/lib/brand-logos';
import { getScopeCatalog } from '@/db/queries';

/**
 * El árbol de módulos de IA con sus componentes y los planes de cada
 * plataforma, para los pasos de plan y de alcance. Los cuadritos de marca se
 * arman acá, en el servidor, para no mandar el catálogo de logos SVG al bundle
 * del navegador.
 */
export async function getScopeOptions(): Promise<ScopePlatformOption[]> {
  const platforms = await getScopeCatalog();

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
    plans: platform.plans.map((p) => ({
      key: p.key,
      name: p.name,
      price: p.price,
      audience: p.audience,
      summary: p.summary,
      note: p.note,
      tier: p.tier,
    })),
    modules: platform.modules.map((m) => ({
      id: m.id,
      name: m.name,
      level: m.level,
      plans: m.plans.map((p) => ({
        availability: p.availability,
        note: p.note,
        plan: { key: p.plan.key },
      })),
      mark: (
        <Abbr abbr={m.abbr} color={m.color} size={20} logo={moduleLogo(platform.id, m.slug)} />
      ),
    })),
  }));
}
