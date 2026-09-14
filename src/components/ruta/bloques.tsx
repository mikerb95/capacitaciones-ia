import type { Bloque } from '@/lib/ruta';
import { Copiar } from './copiar';

/**
 * Pinta el contenido de una lección. Cada tipo de bloque tiene una sola forma
 * de verse en todo el curso, así quien lo recorre aprende a leer la página: lo
 * teñido del color del curso es la idea clave, lo naranja es un aviso, lo que
 * parece Jira es un ejemplo de pantalla.
 */
export function Bloques({ bloques }: { bloques: Bloque[] }) {
  return (
    <div className="flex flex-col gap-5">
      {bloques.map((b, i) => (
        <BloqueUno key={i} bloque={b} />
      ))}
    </div>
  );
}

const NOTA = {
  clave: { etiqueta: 'Idea clave', fondo: 'bg-[var(--tone-soft)]', punto: 'var(--tone)' },
  ojo: {
    etiqueta: 'Ojo',
    fondo: 'bg-[#fdf1e8] dark:bg-[#2a1a10]',
    punto: '#c2410c',
  },
  dato: { etiqueta: 'Dato', fondo: 'bg-surface-2', punto: 'var(--faint)' },
} as const;

function BloqueUno({ bloque: b }: { bloque: Bloque }) {
  switch (b.tipo) {
    case 'texto':
      return <p className="max-w-[68ch] text-[15px] leading-[1.75] text-text/90">{b.texto}</p>;

    case 'subtitulo':
      return (
        <h3 className="mt-3 font-display text-[18px] font-semibold tracking-tight">{b.texto}</h3>
      );

    case 'lista': {
      const Tag = b.ordenada ? 'ol' : 'ul';
      return (
        <Tag className="flex max-w-[68ch] flex-col gap-2.5">
          {b.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-text/90">
              {b.ordenada ? (
                <span className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-[var(--tone-soft)] font-mono text-[11.5px] font-semibold text-[var(--tone)]">
                  {i + 1}
                </span>
              ) : (
                <span
                  className="mt-[9px] size-1.5 flex-none rounded-full bg-[var(--tone)]"
                  aria-hidden="true"
                />
              )}
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </Tag>
      );
    }

    case 'nota': {
      const t = NOTA[b.tono];
      return (
        <aside className={`rounded-card p-4 sm:p-5 ${t.fondo}`}>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="size-2 flex-none rounded-full" style={{ background: t.punto }} aria-hidden="true" />
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted">
              {t.etiqueta}
            </span>
          </div>
          <p className="font-display text-[15px] font-semibold tracking-tight">{b.titulo}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">{b.texto}</p>
        </aside>
      );
    }

    case 'conceptos':
      return (
        <dl className="grid gap-2.5 sm:grid-cols-2">
          {b.items.map((c) => (
            <div key={c.termino} className="rounded-card border border-line bg-surface p-4 shadow-card">
              <dt className="font-display text-[14.5px] font-semibold tracking-tight">{c.termino}</dt>
              <dd className="mt-1 text-[13.5px] leading-relaxed text-muted">{c.definicion}</dd>
            </div>
          ))}
        </dl>
      );

    case 'codigo':
      return (
        <figure className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
            <figcaption className="text-[12.5px] font-semibold text-muted">
              {b.titulo ?? 'Código'}
            </figcaption>
            <Copiar texto={b.codigo} />
          </div>
          <pre className="overflow-x-auto bg-surface-2 px-4 py-3.5 font-mono text-[13px] leading-relaxed text-text">
            <code>{b.codigo}</code>
          </pre>
          {b.explicacion && (
            <p className="px-4 py-3 text-[13.5px] leading-relaxed text-muted">{b.explicacion}</p>
          )}
        </figure>
      );

    case 'prompt':
      return (
        <div className="rounded-card border border-[var(--tone-line)] bg-surface shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--tone-line)] px-4 py-2">
            <span className="flex items-center gap-2 text-[12.5px] font-semibold text-muted">
              <span className="size-1.5 rounded-full bg-[var(--tone)]" aria-hidden="true" />
              {b.etiqueta}
            </span>
            <Copiar texto={b.texto} />
          </div>
          <p className="whitespace-pre-line px-4 py-3.5 text-[14px] leading-relaxed text-text">{b.texto}</p>
        </div>
      );

    case 'comparar':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-surface-2 p-4">
            <div className="mb-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-faint">
              {b.antes.titulo}
            </div>
            <p className="text-[14px] leading-relaxed text-muted">{b.antes.texto}</p>
          </div>
          <div className="rounded-card border border-[var(--tone-line)] bg-[var(--tone-soft)] p-4">
            <div className="mb-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--tone)]">
              {b.despues.titulo}
            </div>
            <p className="text-[14px] leading-relaxed text-text">{b.despues.texto}</p>
          </div>
        </div>
      );

    case 'ticket':
      return (
        <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5 text-[12px]">
            <span className="rounded bg-[#e5484d] px-1.5 py-0.5 text-[10.5px] font-semibold text-white">
              {b.tipoIssue}
            </span>
            <span className="font-mono font-semibold text-muted">{b.clave}</span>
            <span className="ml-auto rounded bg-[var(--tone-soft)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--tone)]">
              {b.estado}
            </span>
          </div>
          <div className="grid md:grid-cols-[1fr_240px]">
            <div className="p-4">
              <p className="font-display text-[16px] font-semibold leading-snug tracking-tight">{b.resumen}</p>
              {b.descripcion && (
                <>
                  <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-wide text-faint">
                    Descripción
                  </p>
                  <p className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-muted">
                    {b.descripcion}
                  </p>
                </>
              )}
            </div>
            <dl className="grid content-start gap-2.5 border-t border-line p-4 md:border-t-0 md:border-l">
              {b.campos.map((c) => (
                <div key={c.campo} className="grid grid-cols-[92px_1fr] gap-2 text-[12.5px]">
                  <dt className="text-faint">{c.campo}</dt>
                  <dd className="font-medium text-text">{c.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      );

    case 'chat':
      return (
        <figure className="rounded-card border border-line bg-surface p-4 shadow-card">
          {b.titulo && (
            <figcaption className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-faint">
              {b.titulo}
            </figcaption>
          )}
          <div className="flex flex-col gap-2.5">
            <p className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-[var(--tone-soft)] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-text">
              {b.pregunta}
            </p>
            <p className="max-w-[92%] self-start rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-muted">
              {b.respuesta}
            </p>
          </div>
        </figure>
      );

    case 'tablero':
      return (
        <figure className="rounded-card border border-line bg-surface p-4 shadow-card">
          {b.titulo && (
            <figcaption className="mb-3 text-[12.5px] font-semibold text-muted">{b.titulo}</figcaption>
          )}
          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-4 gap-2.5">
              {b.columnas.map((col) => (
                <div key={col.nombre} className="rounded-xl bg-surface-2 p-2.5">
                  <p className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-faint">
                    {col.nombre}
                    <span className="font-mono">{col.tarjetas.length}</span>
                  </p>
                  <ul className="flex flex-col gap-2">
                    {col.tarjetas.map((t) => (
                      <li key={t.clave} className="rounded-lg border border-line bg-surface p-2.5 shadow-card">
                        <p className="text-[12.5px] leading-snug text-text">{t.texto}</p>
                        <p className="mt-1.5 font-mono text-[10.5px] text-faint">{t.clave}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </figure>
      );
  }
}
