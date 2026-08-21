import Link from 'next/link';
import { Abbr, LevelBadge, PlatformMark, SiteHeader } from '@/components/ui';
import { moduleLogo, platformLogo } from '@/lib/brand-logos';
import { seEntrena } from '@/lib/entrenador';
import { hasModule, requireScopedParticipant } from '@/lib/scope';
import { getTrainerCatalog } from '@/db/queries';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Entrenador de prompts · Academia IA' };

export default async function EntrenadorPage() {
  const { scope } = await requireScopedParticipant();
  const catalogo = await getTrainerCatalog();

  // Solo lo que abre el código de la empresa, y solo lo que tiene casos por
  // área con qué armar un reto.
  const plataformas = catalogo
    .map((p) => ({
      ...p,
      modules: p.modules.filter((m) => hasModule(scope, m.id) && seEntrena(m)),
    }))
    .filter((p) => p.modules.length > 0);

  const total = plataformas.reduce((n, p) => n + p.modules.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Entrenador de prompts"
        subtitle="Practica con casos de tu trabajo"
        back={{ href: '/', label: 'Volver al portal' }}
      />

      <main className="mx-auto flex max-w-[860px] flex-col gap-7 px-4 py-8 sm:px-6">
        <section className="max-w-[64ch]">
          <h2 className="font-display text-[22px] font-semibold tracking-tight">
            Leer prompts buenos no enseña a escribirlos
          </h2>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">
            Acá se hace al revés que en la ficha del módulo: primero te ponemos un caso real de tu
            área y escribes tú, y solo después ves la lista de chequeo y los prompts modelo. Nada
            de lo que escribas se guarda ni lo ve nadie.
          </p>
        </section>

        {total === 0 ? (
          <p className="rounded-card border border-line bg-surface p-5 text-[13.5px] leading-relaxed text-muted shadow-card">
            Tu capacitación todavía no tiene módulos con casos por área, que es de donde salen los
            retos. Escríbenos y lo dejamos listo para la próxima sesión.
          </p>
        ) : (
          plataformas.map((plataforma) => (
            <section key={plataforma.id}>
              <div className="mb-3.5 flex items-center gap-2.5">
                <PlatformMark
                  initial={plataforma.initial}
                  color={plataforma.color}
                  size={26}
                  logo={platformLogo(plataforma.id)}
                />
                <h3 className="font-display text-[16px] font-semibold tracking-tight">
                  {plataforma.name}
                </h3>
                <span className="text-[12.5px] text-faint">
                  {plataforma.modules.length}{' '}
                  {plataforma.modules.length === 1 ? 'módulo' : 'módulos'}
                </span>
              </div>

              <ul className="grid gap-2.5 sm:grid-cols-2">
                {plataforma.modules.map((mod) => (
                  <li key={mod.id}>
                    <Link
                      href={`/entrenador/${plataforma.id}/${mod.slug}`}
                      className="tone flex h-full flex-col gap-2 rounded-card border border-line bg-surface p-4 shadow-card transition-all hover:border-[var(--tone-line)] hover:shadow-lift"
                      style={{ ['--tone' as string]: mod.color }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Abbr
                          abbr={mod.abbr}
                          color={mod.color}
                          size={26}
                          logo={moduleLogo(plataforma.id, mod.slug)}
                        />
                        <span className="min-w-0 flex-1 truncate font-display text-[14.5px] font-semibold tracking-tight">
                          {mod.name}
                        </span>
                        <LevelBadge level={mod.level} />
                      </div>
                      <p className="text-[13px] leading-relaxed text-muted">{mod.summary}</p>
                      <span className="mt-auto pt-1 font-mono text-[11.5px] text-faint">
                        {mod.roles.length} {mod.roles.length === 1 ? 'reto' : 'retos'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
