import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/ui';
import { getPlatformName } from '@/db/queries';
import { NivelChip, TIPO_ETIQUETA, TipoIcono, tipoDe } from '@/components/ruta/piezas';
import { duracion, getCurso, leccionesDe } from '@/lib/ruta';

type Params = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Params) {
  const { platform } = await params;
  const curso = getCurso(platform);
  return curso ? { title: `Temario · ${curso.titulo}` } : {};
}

/**
 * Vista pública del temario: el mismo contenido de `/ruta/[platform]`, pero
 * sin participante ni avance. Sirve para compartir el programa completo antes
 * de que la empresa tenga acceso contratado, así que no filtra por plan ni
 * por módulo: siempre es el curso entero, tal como vive en el código.
 */
export default async function TemarioPublicoPage({ params }: Params) {
  const { platform } = await params;
  const curso = getCurso(platform);
  if (!curso) notFound();

  const nombre = await getPlatformName(platform);
  const lecciones = leccionesDe(curso);
  const practicas = lecciones.filter((l) => l.leccion.tipo === 'practica').length;
  const niveles = curso.niveles.filter((n) => curso.unidades.some((u) => u.nivel === n.key));

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: curso.color }}>
      <SiteHeader title={curso.titulo} subtitle="Temario público" back={{ href: `/${platform}`, label: 'Volver al portal' }} />

      <main className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 sm:py-12">
        <section>
          <p className="flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-muted">
            <span className="size-2 rounded-full bg-[var(--tone)]" aria-hidden="true" />
            {curso.subtitulo} · {niveles.length} niveles
          </p>
          <h1 className="mt-3 max-w-[20ch] font-display text-[34px] font-semibold leading-[1.1] tracking-tight sm:text-[46px]">
            {curso.titulo}
          </h1>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">{curso.descripcion}</p>

          <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
            {[
              [String(lecciones.length), 'lecciones'],
              [duracion(lecciones.reduce((n, l) => n + l.leccion.minutos, 0)), 'de contenido'],
              [String(practicas), 'prácticas con revisión'],
              [String(lecciones.filter((l) => l.leccion.tipo === 'examen').length), 'exámenes'],
            ].map(([valor, etiqueta]) => (
              <div key={etiqueta}>
                <p className="font-display text-[20px] font-semibold tracking-tight">{valor}</p>
                <p className="text-[12.5px] text-muted">{etiqueta}</p>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="/academia#cotizar"
              className="rounded-xl bg-[var(--tone)] px-5 py-3 text-[14px] font-semibold text-white shadow-card transition-opacity hover:opacity-90"
            >
              Pedir acceso a la capacitación
            </a>
            {nombre && <p className="text-[13px] text-faint">Plataforma: {nombre}</p>}
          </div>
        </section>

        <section className="mt-14">
          <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">Temario</p>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">De cero a experto, nivel por nivel</h2>

          <div className="mt-7 flex flex-col gap-10">
            {niveles.map((nivel) => {
              const unidades = curso.unidades.filter((u) => u.nivel === nivel.key);
              return (
                <div key={nivel.key}>
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <NivelChip nivel={nivel} />
                    <p className="w-full text-[14px] leading-relaxed text-muted">{nivel.promesa}</p>
                  </div>

                  <div className="grid gap-4">
                    {unidades.map((unidad) => {
                      const minutos = unidad.lecciones.reduce((n, l) => n + l.minutos, 0);
                      return (
                        <article key={unidad.slug} className="min-w-0 rounded-card border border-line bg-surface shadow-card">
                          <header className="flex flex-wrap items-start gap-x-6 gap-y-3 p-5">
                            <div className="min-w-0 flex-1 basis-[220px]">
                              <h3 className="font-display text-[17px] font-semibold tracking-tight">{unidad.titulo}</h3>
                              <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">{unidad.descripcion}</p>
                            </div>
                            <div className="w-full text-right sm:w-44">
                              <p className="text-[12px] text-muted">{unidad.lecciones.length} lecciones</p>
                              <p className="font-mono text-[12px] text-faint">{duracion(minutos)}</p>
                            </div>
                          </header>
                          <ul className="border-t border-line">
                            {unidad.lecciones.map((l) => (
                              <li key={l.slug} className="border-b border-line px-5 py-3 last:border-0">
                                <div className="flex items-center gap-3">
                                  <span className="text-faint">
                                    <TipoIcono leccion={l} />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-[14px] font-medium text-text">{l.titulo}</span>
                                    <span className="block truncate text-[12.5px] text-muted">{l.resumen}</span>
                                  </span>
                                  <span className="hidden flex-none text-right text-[12px] text-faint sm:block">
                                    {TIPO_ETIQUETA[tipoDe(l)]} · {duracion(l.minutos)}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 flex flex-wrap items-center gap-6 rounded-card bg-[var(--tone-soft)] p-6 sm:p-8">
          <div className="min-w-[240px] flex-1">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">¿Y ahora?</p>
            <h2 className="mt-1.5 font-display text-[22px] font-semibold tracking-tight">Este es el temario completo</h2>
            <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-muted">
              Para tomar el curso, seguir el avance y rendir los exámenes hace falta una cuenta con la capacitación
              contratada.
            </p>
          </div>
          <Link
            href={`/ruta/${platform}`}
            className="whitespace-nowrap rounded-xl border border-line bg-surface px-5 py-3 text-[14px] font-semibold shadow-card transition-colors hover:bg-surface-2"
          >
            Ir a la ruta guiada
          </Link>
        </section>
      </main>
    </div>
  );
}
