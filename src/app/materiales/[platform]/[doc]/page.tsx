import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PlatformMark } from '@/components/ui';
import { getPlatform } from '@/db/queries';
import { platformLogo } from '@/lib/brand-logos';
import { ATAJOS, CHECKLIST, DECISION, POLITICA, findMaterial } from '@/lib/materiales';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ platform: string; doc: string }> };

/**
 * En desarrollo se abren en el navegador para revisarlas. En producción no son
 * una página del sitio: solo contesta el generador, que manda la clave. Sin
 * clave configurada, no contesta nadie.
 */
async function assertBuilder() {
  if (process.env.NODE_ENV !== 'production') return;

  const key = process.env.MATERIALES_BUILD_KEY;
  const sent = (await headers()).get('x-materiales-key');
  if (!key || sent !== key) notFound();
}

/**
 * Rutas imprimibles del material. Son insumo del generador de PDF, no una
 * sección del portal: fuera de desarrollo solo responden si quien las pide es
 * el propio script, que se identifica con MATERIALES_BUILD_KEY.
 */
export default async function MaterialPage({ params }: Params) {
  await assertBuilder();
  const { platform: id, doc } = await params;

  const material = findMaterial(id, doc);
  if (!material || material.source !== 'print') notFound();

  const platform = await getPlatform(id);
  if (!platform) notFound();

  if (doc === 'guia-de-prompts') return <PromptGuide platform={platform} />;
  if (doc.startsWith('checklist-')) return <Checklist platform={platform} title={material.title} />;
  if (doc === 'tarjeta-de-atajos') return <ShortcutCard platform={platform} />;
  if (doc === 'politica-de-uso-de-ia') return <Policy platform={platform} />;
  if (doc === 'cuando-usar-chat-agente-o-cowork') return <Decision platform={platform} />;

  notFound();
}

type Platform = NonNullable<Awaited<ReturnType<typeof getPlatform>>>;

// --- Piezas compartidas ----------------------------------------------------

function Sheet({ children }: { children: React.ReactNode }) {
  return <section className="sheet flex flex-col">{children}</section>;
}

/** Pie de página del documento. Puppeteer numera; aquí va la procedencia. */
function Footnote({ platform }: { platform: Platform }) {
  return (
    <p className="mt-auto pt-8 text-[10px] text-faint">
      {platform.portalName} · Material de la capacitación. Uso interno.
    </p>
  );
}

/**
 * Encabezado de los documentos de una hoja: el título grande a la izquierda y
 * el distintivo de la plataforma a la derecha.
 */
function DocHead({ platform, title, intro }: { platform: Platform; title: string; intro: string }) {
  return (
    <header className="flex items-start justify-between gap-6 border-b border-line pb-5">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
          {platform.portalName}
        </p>
        <h1 className="font-display mt-1.5 text-[30px] leading-tight font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-muted">{intro}</p>
      </div>
      <span
        className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] text-[15px] font-semibold text-white"
        style={{ background: platform.color }}
      >
        {platform.initial}
      </span>
    </header>
  );
}

/** Título de sección: el punto de color de la marca y el texto al lado. */
function SectionTitle({ platform, children }: { platform: Platform; children: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="h-2 w-2 flex-none rounded-full" style={{ background: platform.color }} />
      <h2 className="text-[14px] font-semibold">{children}</h2>
    </div>
  );
}

/**
 * Los prompts traen huecos entre corchetes ([área], [empresa]) que la persona
 * reemplaza. Se tiñen para que se vean como lo que son: algo que falta.
 */
function PromptText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span
            key={i}
            className="mx-[-2px] rounded bg-primary-soft px-[3px] font-medium text-primary"
            style={{ boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// --- Guía de prompts -------------------------------------------------------

function PromptGuide({ platform }: { platform: Platform }) {
  const total = platform.modules.reduce((n, m) => n + m.prompts.length, 0);

  return (
    <>
      <Sheet>
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 flex-none items-center justify-center rounded-[12px] text-[17px] font-semibold text-white"
            style={{ background: platform.color }}
          >
            {platform.initial}
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
              {platform.portalName}
            </p>
            <p className="text-[13px] text-muted">Material de la capacitación</p>
          </div>
        </div>

        <h1 className="font-display mt-14 text-[42px] leading-[1.05] font-semibold tracking-tight">
          Guía de prompts
        </h1>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted">
          Los {total} prompts del programa, agrupados por módulo y listos para copiar. Lo que va{' '}
          <span className="rounded bg-primary-soft px-1 font-medium text-primary">
            [entre corchetes]
          </span>{' '}
          se reemplaza por lo tuyo antes de enviarlo: el área, el cliente, el documento.
        </p>

        <div className="mt-14">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
            Contenido
          </p>
          <ol className="flex flex-col">
            {platform.modules.map((m, i) => (
              <li
                key={m.id}
                className="flex items-baseline gap-3 border-b border-line py-2.5 last:border-0"
              >
                <span className="font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[14px] font-semibold">{m.name}</span>
                <span className="text-[12px] text-faint">{m.level}</span>
                <span className="ml-auto font-mono text-[11px] text-faint">
                  {m.prompts.length} prompts
                </span>
              </li>
            ))}
          </ol>
        </div>

        <Footnote platform={platform} />
      </Sheet>

      {platform.modules.map((m) => (
        <Sheet key={m.id}>
          <header className="border-b border-line pb-5">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ background: m.color ?? platform.color }}
              />
              <span className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
                {m.category ?? m.level}
              </span>
            </div>
            <h2 className="font-display mt-2 text-[27px] leading-tight font-semibold tracking-tight">
              {m.name}
            </h2>
            <p className="mt-2 max-w-[70ch] text-[13.5px] leading-relaxed text-muted">
              {m.summary}
            </p>
          </header>

          <div className="mt-6 flex flex-col gap-3">
            {m.prompts.map((p) => (
              <article
                key={p.id}
                className="avoid-break rounded-[12px] border border-line bg-surface-2 p-4"
              >
                <p className="mb-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                  {p.tag}
                </p>
                <p className="text-[13.5px] leading-relaxed">
                  <PromptText text={p.text} />
                </p>
              </article>
            ))}
          </div>

          {m.outcomes.length > 0 && (
            <div className="avoid-break mt-7 border-t border-line pt-4">
              <p className="mb-2 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                Con esto deberías poder
              </p>
              <ul className="flex flex-col gap-1">
                {m.outcomes.map((o) => (
                  <li key={o.id} className="flex gap-2 text-[12.5px] leading-snug text-muted">
                    <span className="text-accent">·</span>
                    {o.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Footnote platform={platform} />
        </Sheet>
      ))}
    </>
  );
}

// --- Checklist de revisión -------------------------------------------------

function Checklist({ platform, title }: { platform: Platform; title: string }) {
  const content = CHECKLIST[platform.id];
  if (!content) notFound();

  return (
    <Sheet>
      <DocHead platform={platform} title={title} intro={content.intro} />

      <div className="mt-6 grid grid-cols-2 gap-x-7 gap-y-6">
        {content.blocks.map((block) => (
          <div key={block.title} className="avoid-break">
            <SectionTitle platform={platform}>{block.title}</SectionTitle>
            <ul className="flex flex-col gap-2">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-[3px] h-3 w-3 flex-none rounded-[3px] border border-line bg-surface-2" />
                  <span className="text-[12px] leading-snug text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {platform.practices.length > 0 && (
        <div className="avoid-break mt-8 rounded-[12px] bg-surface-2 p-5">
          <p className="mb-3 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
            Si solo te acuerdas de cuatro cosas
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {platform.practices.map((p) => (
              <div key={p.id} className="flex gap-2.5">
                <span className="font-mono text-[11px] text-faint">{p.number}</span>
                <div>
                  <p className="text-[12.5px] font-semibold">{p.title}</p>
                  <p className="text-[11.5px] leading-snug text-muted">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footnote platform={platform} />
    </Sheet>
  );
}

// --- Tarjeta de atajos -----------------------------------------------------

/**
 * Una hoja para imprimir y dejar a la vista: dónde vive Copilot en cada
 * aplicación y qué se le pide ahí. Va en dos columnas porque se lee de un
 * vistazo, no de corrido.
 */
function ShortcutCard({ platform }: { platform: Platform }) {
  const content = ATAJOS[platform.id];
  if (!content) notFound();

  return (
    <Sheet>
      <DocHead platform={platform} title="Tarjeta de atajos" intro={content.intro} />

      <div className="mt-6 grid grid-cols-2 gap-x-7 gap-y-5">
        {content.apps.map((app) => (
          <div key={app.app} className="avoid-break">
            <SectionTitle platform={platform}>{app.app}</SectionTitle>
            <p className="mb-1.5 text-[11.5px] leading-snug text-faint">{app.where}</p>
            <ul className="flex flex-col gap-1">
              {app.asks.map((ask) => (
                <li key={ask} className="flex gap-2 text-[12px] leading-snug text-muted">
                  <span className="text-accent">·</span>
                  {ask}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="avoid-break mt-8 rounded-[12px] bg-surface-2 p-5">
        <p className="mb-3 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
          {content.formula.title}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {content.formula.items.map((item, i) => (
            <div key={item} className="flex gap-2.5">
              <span className="font-mono text-[11px] text-faint">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-[12px] leading-snug text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <Footnote platform={platform} />
    </Sheet>
  );
}

// --- Política de uso de IA -------------------------------------------------

/**
 * Base de política para adaptar. Los corchetes se dejan teñidos igual que en la
 * guía de prompts: marcan lo que cada empresa tiene que reemplazar.
 */
function Policy({ platform }: { platform: Platform }) {
  const content = POLITICA[platform.id];
  if (!content) notFound();

  return (
    <>
      {content.pages.map((sections, page) => (
        <Sheet key={page}>
          {page === 0 && (
            <>
              <DocHead platform={platform} title="Política de uso de IA" intro={content.intro} />
              <p className="mt-5 rounded-[12px] bg-surface-2 p-4 text-[12px] leading-relaxed text-muted">
                {content.note}
              </p>
            </>
          )}

          <div className={`flex flex-col gap-5 ${page === 0 ? 'mt-6' : ''}`}>
            {sections.map((section) => (
              <div key={section.title} className="avoid-break">
                <SectionTitle platform={platform}>{section.title}</SectionTitle>
                {section.body && (
                  <p className="max-w-[78ch] text-[12.5px] leading-relaxed text-muted">
                    <PromptText text={section.body} />
                  </p>
                )}
                {section.items && (
                  <ul className="flex flex-col gap-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[12.5px] leading-snug text-muted">
                        <span className="text-accent">·</span>
                        <span>
                          <PromptText text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <Footnote platform={platform} />
        </Sheet>
      ))}
    </>
  );
}

// --- Cuándo usar chat, modo agente o Cowork --------------------------------

/** Tabla de decisión: tres tarjetas con las herramientas y los casos abajo. */
function Decision({ platform }: { platform: Platform }) {
  const content = DECISION[platform.id];
  if (!content) notFound();

  return (
    <Sheet>
      <DocHead
        platform={platform}
        title="Cuándo usar chat, modo agente o Cowork"
        intro={content.intro}
      />

      <div className="mt-5 grid grid-cols-3 gap-3">
        {content.tools.map((tool) => (
          <div key={tool.name} className="avoid-break rounded-[12px] border border-line p-3.5">
            <SectionTitle platform={platform}>{tool.name}</SectionTitle>
            <p className="text-[12px] leading-snug font-medium">{tool.when}</p>
            <p className="mt-1 text-[11px] leading-snug text-muted">{tool.note}</p>
          </div>
        ))}
      </div>

      <div className="avoid-break mt-5">
        <p className="mb-2 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
          Lo que llega en el día
        </p>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="w-[46%] pb-2 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">
                Situación
              </th>
              <th className="w-[22%] pb-2 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">
                Dónde
              </th>
              <th className="pb-2 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">
                Por qué
              </th>
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row) => (
              <tr key={row.situation} className="avoid-break border-b border-line last:border-0">
                <td className="py-2 pr-3 align-top text-[12px] leading-snug">{row.situation}</td>
                <td className="py-2 pr-3 align-top text-[12px] leading-snug font-semibold">
                  {row.tool}
                </td>
                <td className="py-2 align-top text-[11.5px] leading-snug text-muted">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="avoid-break mt-5 rounded-[12px] bg-surface-2 p-4 text-[12px] leading-relaxed text-muted">
        {content.closing}
      </p>

      <Footnote platform={platform} />
    </Sheet>
  );
}
