import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trainer } from '@/components/trainer';
import { Abbr, LevelBadge, SiteHeader } from '@/components/ui';
import { moduleLogo } from '@/lib/brand-logos';
import { retosDeModulo, seEntrena } from '@/lib/entrenador';
import { hasModule, requireScopedParticipant } from '@/lib/scope';
import { getModule } from '@/db/queries';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ platform: string; slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { platform, slug } = await params;
  const mod = await getModule(platform, slug);
  if (!mod) return {};
  return { title: `Entrenador · ${mod.name}` };
}

export default async function EntrenadorModuloPage({ params }: Params) {
  const { platform: platformId, slug } = await params;
  const { scope } = await requireScopedParticipant();

  const mod = await getModule(platformId, slug);

  // Fuera de alcance o sin material para entrenar es lo mismo desde afuera: la
  // página no existe. No se anuncia lo que no se puede abrir.
  if (!mod || !hasModule(scope, mod.id) || !seEntrena(mod)) notFound();

  const retos = retosDeModulo(mod);

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: mod.color }}>
      <SiteHeader
        title="Entrenador de prompts"
        subtitle={`${mod.name} · ${mod.platform.portalName}`}
        back={{ href: '/entrenador', label: 'Volver al entrenador' }}
      />

      <main className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Abbr
            abbr={mod.abbr}
            color={mod.color}
            size={28}
            logo={moduleLogo(platformId, mod.slug)}
          />
          <LevelBadge level={mod.level} />
          <Link
            href={`/${platformId}/${slug}`}
            className="ml-auto text-[12.5px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-primary"
          >
            Ver la ficha del módulo
          </Link>
        </div>

        <Trainer
          retos={retos}
          prompts={mod.prompts.map((p) => ({ id: p.id, tag: p.tag, text: p.text }))}
          tropiezos={mod.mistakes.map((m) => ({ id: m.id, bad: m.bad, good: m.good }))}
          platformId={platformId}
          slug={slug}
          moduloNombre={mod.name}
          plataformaNombre={mod.platform.name}
        />
      </main>
    </div>
  );
}
