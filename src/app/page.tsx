import Link from 'next/link';
import { LeaveButton } from '@/components/leave-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlatformMark, StatusBadge } from '@/components/ui';
import { platformLogo } from '@/lib/brand-logos';
import { getComparison } from '@/db/queries';
import { MODELS_REVISION } from '@/lib/revision';
import { requireScopedParticipant, scopeComparison } from '@/lib/scope';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Academia IA' };

/** Solo el primer nombre: la portada saluda, no llena un formulario. */
const firstName = (name: string) => name.split(' ')[0];

/** El titular cuenta con palabras, y el alcance del código decide cuántas son. */
const WORDS = ['Ninguna', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'];
const spell = (n: number) => WORDS[n] ?? String(n);

export default async function Home() {
  const { participant, scope } = await requireScopedParticipant();
  const platforms = scopeComparison(await getComparison(), scope);
  const totalModules = platforms.reduce((n, p) => n + p.modules.length, 0);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="flex items-center gap-3 px-4 py-4 sm:px-8">
        <span className="flex-1 font-display text-[15px] font-semibold tracking-tight">
          Academia IA
        </span>
        <LeaveButton name={participant.name} />
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-[1080px] flex-1 px-4 pb-16 pt-6 sm:px-8 sm:pt-14">
        <section className="max-w-[62ch]">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-faint">
            Hola, {firstName(participant.name)}
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.15] tracking-tight sm:text-[42px]">
            {spell(platforms.length)}{' '}
            {platforms.length === 1 ? 'plataforma de IA, explicada' : 'plataformas de IA, explicadas'}{' '}
            para tu trabajo
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
            Elige la herramienta con la que vamos a trabajar y entra a sus módulos: qué hace, qué
            prompts usar y en qué casos conviene.
          </p>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {platforms.map((platform) => (
            <Link
              key={platform.id}
              href={`/${platform.id}`}
              className="tone group flex items-start gap-4 rounded-card border border-line bg-surface p-5 shadow-card transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[var(--tone-soft)] hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tone)]"
              style={{ ['--tone' as string]: platform.color }}
            >
              <PlatformMark
                initial={platform.initial}
                color={platform.color}
                size={40}
                logo={platformLogo(platform.id)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-[17px] font-semibold tracking-tight">
                    {platform.name}
                  </h2>
                  <StatusBadge status={platform.status} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
                  {platform.description ?? platform.tagline}
                </p>
                <p className="mt-3 text-[12.5px] text-faint transition-colors group-hover:text-[var(--tone)]">
                  {platform.modules.length} módulos
                </p>
              </div>
            </Link>
          ))}
        </section>

        <p className="mt-4 flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-faint">
          <span aria-hidden className="size-1.5 rounded-full bg-primary/60" />
          Modelos y planes revisados en {MODELS_REVISION}
        </p>

        <section className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface-2 px-5 py-4">
          <p className="text-[13.5px] leading-relaxed text-muted">
            ¿Quieres verlas en paralelo? La comparativa pone los {totalModules} módulos lado a
            lado.
          </p>
          <Link
            href="/comparativa"
            className="rounded-[10px] bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ver comparativa
          </Link>
        </section>

        <section className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface-2 px-5 py-4">
          <p className="text-[13.5px] leading-relaxed text-muted">
            ¿Te quedó una duda? Déjala anotada y la respondemos en la capacitación. Puedes
            preguntar con tu nombre o en anónimo.
          </p>
          <Link
            href="/preguntas"
            className="rounded-[10px] border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-muted transition-colors hover:border-primary hover:text-text"
          >
            Dejar una pregunta
          </Link>
        </section>
      </main>

      <footer className="px-4 py-6 text-center sm:px-8">
        <Link href="/admin" className="text-[12px] text-faint transition-colors hover:text-primary">
          Administrar
        </Link>
      </footer>
    </div>
  );
}
