import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPlatform } from '@/db/queries';
import { CHECKLIST, findMaterial } from '@/lib/materiales';

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
  if (doc === 'checklist-de-revision') return <Checklist platform={platform} />;

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

function Checklist({ platform }: { platform: Platform }) {
  const content = CHECKLIST[platform.id];
  if (!content) notFound();

  return (
    <Sheet>
      <header className="flex items-start justify-between gap-6 border-b border-line pb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
            {platform.portalName}
          </p>
          <h1 className="font-display mt-1.5 text-[30px] leading-tight font-semibold tracking-tight">
            Checklist de revisión
          </h1>
          <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-muted">
            {content.intro}
          </p>
        </div>
        <span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] text-[15px] font-semibold text-white"
          style={{ background: platform.color }}
        >
          {platform.initial}
        </span>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-x-7 gap-y-6">
        {content.blocks.map((block) => (
          <div key={block.title} className="avoid-break">
            <div className="mb-2.5 flex items-center gap-2">
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ background: platform.color }}
              />
              <h2 className="text-[14px] font-semibold">{block.title}</h2>
            </div>
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
