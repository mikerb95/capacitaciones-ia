import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PromptList } from '@/components/prompt-list';
import { Abbr, Card, LevelBadge, SectionTitle, SiteHeader } from '@/components/ui';
import { moduleLogo } from '@/lib/brand-logos';
import { hasModule, requireScopedParticipant } from '@/lib/scope';
import { AVAILABILITY_LABEL, AVAILABILITY_TONE, availabilityIn, noteIn } from '@/lib/plans';
import { getModule, getPlatform } from '@/db/queries';

export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ platform: string; slug: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { platform, slug } = await params;
  const mod = await getModule(platform, slug);
  if (!mod) return {};
  return { title: `${mod.name} · ${mod.platform.portalName}` };
}

export default async function ModulePage({ params, searchParams }: Params) {
  const { platform: platformId, slug } = await params;
  const { plan: planParam } = await searchParams;
  const { scope } = await requireScopedParticipant();

  const [mod, platform] = await Promise.all([
    getModule(platformId, slug),
    getPlatform(platformId),
  ]);

  if (!mod || !platform || !hasModule(scope, mod.id)) notFound();

  // La navegación anterior/siguiente solo salta entre módulos en alcance.
  const siblings = platform.modules.filter((m) => hasModule(scope, m.id));
  const index = siblings.findIndex((m) => m.id === mod.id);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: mod.color }}>
      <SiteHeader
        title={mod.name}
        subtitle={mod.platform.portalName}
        back={{ href: `/${platformId}`, label: `Volver a ${mod.platform.name}` }}
      />

      <main className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
        {/* Encabezado del módulo */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <Abbr
              abbr={mod.abbr}
              color={mod.color}
              size={32}
              logo={moduleLogo(platformId, mod.slug)}
            />
            <LevelBadge level={mod.level} />
            {mod.category && (
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11.5px] font-medium text-muted">
                {mod.category}
              </span>
            )}
            {mod.meta && <span className="text-[12.5px] text-faint">{mod.meta}</span>}
          </div>
          <h1 className="font-display text-[30px] font-semibold leading-tight tracking-tight sm:text-[36px]">
            {mod.name}
          </h1>
          <p className="mt-2 max-w-[70ch] text-[16px] leading-relaxed text-muted">
            {mod.summary}
          </p>
          {mod.intro && (
            <p className="mt-3 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">
              {mod.intro}
            </p>
          )}
        </div>

        {mod.outcomes.length > 0 && (
          <section className="mb-9">
            <SectionTitle kicker="Al terminar" title="Qué se lleva cada quien" />
            <ul className="grid gap-2.5 sm:grid-cols-3">
              {mod.outcomes.map((o) => (
                <li
                  key={o.id}
                  className="rounded-card border border-line bg-surface p-4 text-[13.5px] leading-relaxed text-muted shadow-card"
                >
                  <span
                    className="mb-2 block size-2 rounded-full"
                    style={{ background: mod.color }}
                    aria-hidden="true"
                  />
                  {o.text}
                </li>
              ))}
            </ul>
          </section>
        )}

        {mod.prompts.length > 0 && (
          <section className="mb-9">
            <SectionTitle
              kicker="Para copiar"
              title="Prompts del módulo"
              intro="Reemplaza lo que está entre corchetes por los datos reales del área antes de usarlos."
            />
            <PromptList prompts={mod.prompts} />
          </section>
        )}

        {(mod.before || mod.after) && (
          <section className="mb-9">
            <SectionTitle kicker="El caso" title="Antes y después" intro={mod.baIntro ?? undefined} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                  Como se hace hoy
                </div>
                <p className="text-[14px] leading-relaxed text-muted">{mod.before}</p>
                {mod.beforeTime && (
                  <p className="mt-3 border-t border-line pt-3 text-[13px] font-medium text-text">
                    {mod.beforeTime}
                  </p>
                )}
              </Card>
              <Card
                style={{
                  background: `color-mix(in srgb, ${mod.color} 9%, var(--surface))`,
                  borderColor: `color-mix(in srgb, ${mod.color} 28%, var(--border))`,
                }}
              >
                <div
                  className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: mod.color }}
                >
                  Con la herramienta
                </div>
                <p className="text-[14px] leading-relaxed text-muted">{mod.after}</p>
                {mod.afterTime && (
                  <p
                    className="mt-3 border-t pt-3 text-[13px] font-semibold"
                    style={{
                      borderColor: `color-mix(in srgb, ${mod.color} 25%, transparent)`,
                      color: mod.color,
                    }}
                  >
                    {mod.afterTime}
                  </p>
                )}
              </Card>
            </div>
          </section>
        )}

        {mod.steps.length > 0 && (
          <section className="mb-9">
            <SectionTitle kicker="Cómo se hace" title="Paso a paso" />
            <ol className="flex flex-col gap-2.5">
              {mod.steps.map((s, i) => (
                <li key={s.id} className="flex gap-3.5 rounded-card border border-line bg-surface p-4 shadow-card">
                  <span
                    className="grid size-7 flex-none place-items-center rounded-full font-mono text-[12px] font-semibold"
                    style={{
                      background: `color-mix(in srgb, ${mod.color} 14%, transparent)`,
                      color: mod.color,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[15px] font-semibold tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">
                      {s.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {mod.roles.length > 0 && (
          <section className="mb-9">
            <SectionTitle kicker="Por área" title="Quién lo usa y para qué" />
            <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line text-[11.5px] uppercase tracking-[0.06em] text-faint">
                    <th className="px-4 py-2.5 font-medium">Área</th>
                    <th className="px-4 py-2.5 font-medium">Caso de uso</th>
                    <th className="px-4 py-2.5 font-medium">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {mod.roles.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 text-[13.5px] font-semibold">{r.role}</td>
                      <td className="px-4 py-3 text-[13.5px] text-muted">{r.task}</td>
                      <td className="px-4 py-3 text-[13.5px] leading-relaxed text-muted">
                        {r.detail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {mod.mistakes.length > 0 && (
          <section className="mb-9">
            <SectionTitle kicker="Ojo con esto" title="Errores frecuentes" />
            <div className="flex flex-col gap-2.5">
              {mod.mistakes.map((m) => (
                <div
                  key={m.id}
                  className="grid gap-3 rounded-card border border-line bg-surface p-4 shadow-card sm:grid-cols-2"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#c2410c] dark:text-[#f4a06a]">
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      Así no
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-muted">{m.bad}</p>
                  </div>
                  <div className="border-t border-line pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                    <div className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-accent">
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      Así sí
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-muted">{m.good}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {mod.mockPrompt && (
          <section className="mb-9">
            <SectionTitle kicker="Ejemplo" title={mod.mockTitle ?? 'Cómo se ve en pantalla'} />
            <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
              <Card className="flex flex-col gap-3">
                <div className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-primary-soft px-3.5 py-2.5 text-[13.5px] leading-relaxed text-text">
                  {mod.mockPrompt}
                </div>
                <div className="self-start max-w-[90%] rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-muted">
                  {mod.mockReply}
                </div>
              </Card>
              {mod.mockPanel && (
                <Card className="bg-surface-2">
                  <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                    {mod.mockPanelTitle ?? 'Panel'}
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-muted">
                    {mod.mockPanel}
                  </pre>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Navegación entre módulos, útil para dictar la sesión en orden */}
        <nav className="no-print mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          {previous ? (
            <Link
              href={`/${platformId}/${previous.slug}`}
              className="flex items-center gap-2 text-[13.5px] text-muted transition-colors hover:text-primary"
            >
              <span aria-hidden="true">&larr;</span>
              {previous.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/${platformId}/${next.slug}`}
              className="flex items-center gap-2 text-[13.5px] text-muted transition-colors hover:text-primary"
            >
              {next.name}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </div>
  );
}
