import { notFound } from 'next/navigation';
import { PlanExplorer } from '@/components/plan-explorer';
import { Card, PlatformMark, SectionTitle, SiteHeader, StatusBadge } from '@/components/ui';
import { getPlatform, getPlatformIds } from '@/db/queries';
import { moduleLogo, platformLogo } from '@/lib/brand-logos';
import { hasModule, hasPlatform, requireScopedParticipant } from '@/lib/scope';

export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ platform: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export async function generateStaticParams() {
  const ids = await getPlatformIds();
  return ids.map(({ id }) => ({ platform: id }));
}

export async function generateMetadata({ params }: Params) {
  const { platform } = await params;
  const data = await getPlatform(platform);
  return data ? { title: data.portalName } : {};
}

export default async function PlatformPage({ params, searchParams }: Params) {
  const { scope, plans } = await requireScopedParticipant();

  const { platform: id } = await params;
  const { plan } = await searchParams;
  const found = await getPlatform(id);

  // Fuera del alcance del código, el portal no existe para esta persona.
  if (!found || !hasPlatform(scope, found.id)) notFound();

  const platform = {
    ...found,
    modules: found.modules.filter((m) => hasModule(scope, m.id)),
  };

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: platform.color }}>
      <SiteHeader
        title={platform.portalName}
        subtitle={platform.tagline ?? undefined}
        back={{ href: '/', label: 'Inicio' }}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {/* Hero */}
        <section className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <PlatformMark
              initial={platform.initial}
              color={platform.color}
              size={44}
              logo={platformLogo(platform.id)}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[16px] font-semibold">{platform.name}</span>
                <StatusBadge status={platform.status} />
              </div>
              {platform.badge && <p className="text-[12.5px] text-faint">{platform.badge}</p>}
            </div>
          </div>
          <h1 className="max-w-[24ch] font-display text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]">
            {platform.heroTitle}
          </h1>
          {platform.heroText && (
            <p className="mt-3 max-w-[70ch] text-[16px] leading-relaxed text-muted">
              {platform.heroText}
            </p>
          )}

          {platform.stats.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {platform.stats.map((s) => (
                <div key={s.id} className="rounded-card border border-line bg-surface p-4 shadow-card">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span
                      className="block font-display text-[26px] font-semibold leading-none"
                      style={{ color: platform.color }}
                    >
                      {s.value}
                    </span>
                    <span className="mt-1.5 block text-[12.5px] leading-snug text-muted">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Planes, modelos y módulos: el filtro por facturación manda sobre todo
            el listado, así que las tres cosas viven juntas. */}
        <PlanExplorer
          platformId={platform.id}
          color={platform.color}
          note={platform.plansNote}
          // El plan de la URL manda sobre el contratado: así el enlace que se
          // comparte en la sesión se ve igual para todos.
          initialPlan={plan ?? plans.get(platform.id) ?? null}
          contractedPlan={plans.get(platform.id) ?? null}
          plans={platform.plans.map((p) => ({
            key: p.key,
            name: p.name,
            price: p.price,
            audience: p.audience,
            summary: p.summary,
            note: p.note,
            tier: p.tier,
          }))}
          models={platform.models.map((m) => ({
            id: m.id,
            name: m.name,
            description: m.description,
            plans: m.plans,
          }))}
          modules={platform.modules.map((m) => ({
            id: m.id,
            slug: m.slug,
            name: m.name,
            summary: m.summary,
            level: m.level,
            meta: m.meta,
            color: m.color,
            abbr: m.abbr,
            logo: moduleLogo(platform.id, m.slug),
            plans: m.plans,
          }))}
        />

        {/* Diferenciales */}
        {platform.specials.length > 0 && (
          <section className="mb-16">
            <SectionTitle
              kicker="Diferenciales"
              title={platform.specialTitle ?? 'Lo que solo se hace acá'}
              intro={platform.specialIntro ?? undefined}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {platform.specials.map((s) => (
                <Card key={s.id}>
                  <div
                    className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                    style={{ color: platform.color }}
                  >
                    <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                    {s.kicker}
                  </div>
                  <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.description}</p>
                  {s.example && (
                    <p className="mt-4 rounded-lg bg-surface-2 px-3.5 py-2.5 font-mono text-[12.5px] leading-relaxed text-muted">
                      {s.example}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Buenas prácticas */}
        {platform.practices.length > 0 && (
          <section className="mb-16">
            <SectionTitle kicker="Método" title="Cuatro prácticas que valen para todo" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {platform.practices.map((p) => (
                <Card key={p.id}>
                  <div className="mb-2 font-mono text-[13px] font-semibold text-faint">{p.number}</div>
                  <h3 className="font-display text-[14.5px] font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.description}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Preguntas frecuentes */}
        {platform.faqs.length > 0 && (
          <section className="mb-16">
            <SectionTitle kicker="Dudas" title="Preguntas frecuentes" />
            <div className="flex flex-col gap-2.5">
              {platform.faqs.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-card border border-line bg-surface px-5 py-4 shadow-card"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-[14.5px] font-semibold tracking-tight">
                    {f.question}
                    <span
                      className="flex-none text-[18px] leading-none text-faint transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 max-w-[75ch] text-[13.5px] leading-relaxed text-muted">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Material y enlaces */}
        <section className="grid gap-10 md:grid-cols-2">
          {platform.downloads.length > 0 && (
            <div>
              <SectionTitle kicker="Material" title="Para llevarse" />
              <div className="flex flex-col gap-2.5">
                {platform.downloads.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-semibold">{d.title}</h3>
                      {d.description && (
                        <p className="text-[12.5px] leading-snug text-muted">{d.description}</p>
                      )}
                    </div>
                    {d.meta && (
                      <span className="flex-none font-mono text-[11.5px] text-faint">{d.meta}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {platform.links.length > 0 && (
            <div>
              <SectionTitle kicker="Referencia" title="Enlaces oficiales" />
              <div className="flex flex-col gap-2.5">
                {platform.links.map((l) => (
                  <a
                    key={l.id}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 text-[14px] font-medium shadow-card transition-colors hover:text-primary"
                  >
                    {l.label}
                    <span aria-hidden="true" className="text-faint">
                      &nearr;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
