import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Buscador } from '@/components/buscador';
import { SiteHeader } from '@/components/ui';
import { getPlatformName } from '@/db/queries';
import { Anillo, Barra, EstadoIcono, NivelChip, TIPO_ETIQUETA, TipoIcono, tipoDe } from '@/components/ruta/piezas';
import { InsigniaPlan, SelectorPlan, leccionConPlan } from '@/components/ruta/planes';
import { getCurso, duracion, estadoDe, leccionesDe, resumir } from '@/lib/ruta';
import { cargarCurso } from '@/lib/ruta/contexto';

export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ platform: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export async function generateMetadata({ params }: Pick<Params, 'params'>) {
  const { platform } = await params;
  const curso = getCurso(platform);
  return curso ? { title: curso.titulo } : {};
}

/**
 * Portada de la ruta guiada: la promesa, el avance propio, el temario completo
 * y, si el panel lo tiene encendido, el camino al certificado. Es la página a
 * la que se vuelve cada vez, así que lo primero que se ve es "continuar donde
 * quedaste", no la descripción.
 */
export default async function RutaPage({ params, searchParams }: Params) {
  const { platform } = await params;
  const { plan: planPedido } = await searchParams;
  const cargado = await cargarCurso(platform, planPedido);
  if (!cargado) notFound();

  const {
    curso,
    cursoCompleto,
    registros,
    certificados,
    planes,
    plan,
    planContratado,
    disponibilidad,
    notaDePlan,
    participant,
  } = cargado;
  const resumen = resumir(curso, registros);
  // El certificado no se recorta con el plan: pide el curso entero, igual que
  // en su propia página. Con un plan puesto, lo que se ve arriba es el avance
  // sobre lo que ese plan deja hacer; abajo se aclara qué pide el diploma.
  const resumenTotal = plan ? resumir(cursoCompleto, registros) : resumen;
  const totalCompleto = leccionesDe(cursoCompleto).length;
  const unidadesFuera = cursoCompleto.unidades.length - curso.unidades.length;
  const nombre = await getPlatformName(platform);
  const lecciones = leccionesDe(curso);
  const porSlug = new Map(registros.map((r) => [r.lessonSlug, r]));
  const orden = curso.niveles.map((n) => n.key);
  const niveles = curso.niveles.filter((n) => curso.unidades.some((u) => u.nivel === n.key));
  const practicas = lecciones.filter((l) => l.leccion.tipo === 'practica').length;
  const empezo = resumen.completadas > 0 || resumen.partida !== null;
  const partida = resumen.partida ? curso.niveles.find((n) => n.key === resumen.partida) : null;

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: curso.color }}>
      <SiteHeader
        title={curso.titulo}
        subtitle={curso.subtitulo}
        back={{ href: `/${platform}`, label: 'Volver al portal' }}
        search={<Buscador plataforma={{ id: platform, name: nombre ?? curso.titulo }} />}
      />

      <main className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 sm:py-12">
        {/* Hero y avance */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <p className="flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-muted">
              <span className="size-2 rounded-full bg-[var(--tone)]" aria-hidden="true" />
              {curso.subtitulo} · {niveles.length} niveles
            </p>
            <h1 className="mt-3 max-w-[20ch] font-display text-[34px] font-semibold leading-[1.1] tracking-tight sm:text-[46px]">
              {curso.titulo}
            </h1>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">{curso.descripcion}</p>

            <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              <Meta valor={String(resumen.total)} etiqueta="lecciones" />
              <Meta valor={duracion(resumen.minutosTotales)} etiqueta="de contenido" />
              <Meta valor={String(practicas)} etiqueta="prácticas con revisión" />
              <Meta valor={String(resumen.examenes.total)} etiqueta="exámenes" />
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {resumen.siguiente ? (
                <Link
                  href={leccionConPlan(platform, resumen.siguiente.leccion.slug, plan)}
                  className="rounded-xl bg-[var(--tone)] px-5 py-3 text-[14px] font-semibold text-white shadow-card transition-opacity hover:opacity-90"
                >
                  {empezo ? 'Continuar' : 'Empezar desde cero'}
                  <span className="ml-1.5 font-normal opacity-85">· {resumen.siguiente.leccion.titulo}</span>
                </Link>
              ) : certificados ? (
                <Link
                  href={`/ruta/${platform}/certificado`}
                  className="rounded-xl bg-[var(--tone)] px-5 py-3 text-[14px] font-semibold text-white shadow-card transition-opacity hover:opacity-90"
                >
                  Ver mi certificado
                </Link>
              ) : (
                <span className="rounded-xl bg-[var(--tone-soft)] px-5 py-3 text-[14px] font-semibold text-[var(--tone)]">
                  Ruta completada
                </span>
              )}
              <Link
                href={`/ruta/${platform}/diagnostico`}
                className="rounded-xl border border-line bg-surface px-5 py-3 text-[14px] font-semibold text-muted transition-colors hover:border-[var(--tone)] hover:text-text"
              >
                {partida ? 'Repetir el diagnóstico' : '¿Ya sabes algo? Haz el diagnóstico'}
              </Link>
            </div>
          </div>

          <aside className="rounded-card border border-line bg-surface p-5 shadow-card">
            <div className="flex items-center gap-4">
              <Anillo porcentaje={resumen.porcentaje} color={curso.color} size={92} />
              <div className="min-w-0">
                <p className="font-display text-[16px] font-semibold tracking-tight">Tu avance</p>
                <p className="text-[13px] text-muted">
                  {resumen.completadas} de {resumen.total} lecciones
                </p>
                <p className="text-[13px] text-muted">
                  {resumen.minutosRestantes > 0 ? `Te faltan ${duracion(resumen.minutosRestantes)}` : 'Contenido terminado'}
                </p>
              </div>
            </div>
            <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4 text-[13px]">
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted">Punto de partida</span>
                {partida ? <NivelChip nivel={partida} corto /> : <span className="text-faint">Sin diagnóstico</span>}
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted">Exámenes aprobados</span>
                <span className="font-mono font-semibold">
                  {resumen.examenes.aprobados}/{resumen.examenes.total}
                </span>
              </li>
              {resumen.proyecto && (
                <li className="flex items-center justify-between gap-3">
                  <span className="text-muted">Proyecto final</span>
                  <span className={resumen.proyecto.entregado ? 'font-semibold text-accent' : 'text-faint'}>
                    {resumen.proyecto.entregado ? 'Aprobado' : 'Pendiente'}
                  </span>
                </li>
              )}
            </ul>
            {certificados && (
              <Link
                href={`/ruta/${platform}/certificado`}
                className={`mt-4 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
                  resumenTotal.certificable
                    ? 'bg-accent-soft text-accent hover:opacity-90'
                    : 'bg-surface-2 text-muted hover:text-text'
                }`}
              >
                {resumenTotal.certificable ? 'Tu certificado está listo' : 'Qué pide el certificado'}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
            {participant.accountId === null ? (
              <p className="mt-4 rounded-xl bg-primary-soft px-3.5 py-3 text-[12.5px] leading-relaxed text-text">
                Este avance vive solo en este navegador.{' '}
                <Link
                  href={`/cuenta/crear?destino=${encodeURIComponent(`/ruta/${platform}`)}`}
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  Crea una cuenta
                </Link>{' '}
                para no perderlo y seguir desde cualquier dispositivo.
              </p>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-[12px] text-faint">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                Guardado en tu cuenta
              </p>
            )}
          </aside>
        </section>

        {/* Qué se lleva */}
        <section className="mt-16 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-[19px] font-semibold tracking-tight">Lo que vas a poder hacer</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {curso.aprendizajes.map((a) => (
                <li key={a} className="flex gap-2.5 text-[14px] leading-relaxed text-muted">
                  <svg className="mt-[3px] flex-none text-[var(--tone)]" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-surface-2 p-6">
            <h2 className="font-display text-[19px] font-semibold tracking-tight">Antes de empezar</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {curso.requisitos.map((r) => (
                <li key={r} className="flex gap-2.5 text-[14px] leading-relaxed text-muted">
                  <span className="mt-[9px] size-1.5 flex-none rounded-full bg-faint" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="mt-16">
          <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">Método</p>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">Cómo funciona la ruta</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Diagnóstico', 'Diez preguntas para saber desde qué nivel te conviene arrancar. Cinco minutos.'],
              ['Lecciones cortas', 'Entre 10 y 20 minutos, con ejemplos de pantalla y una comprobación al final.'],
              ['Prácticas revisadas', 'Resuelves un caso real y una IA te revisa con la rúbrica de la práctica.'],
              certificados
                ? ['Exámenes y certificado', 'Un examen por nivel y un proyecto final. Aprobados todos, tienes tu certificado.']
                : ['Exámenes', 'Un examen por nivel y un proyecto final que integra todo lo aprendido.'],
            ].map(([titulo, texto], i) => (
              <li key={titulo} className="rounded-card border border-line bg-surface p-5 shadow-card">
                <span className="grid size-8 place-items-center rounded-full bg-[var(--tone-soft)] font-mono text-[13px] font-semibold text-[var(--tone)]">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-[15px] font-semibold tracking-tight">{titulo}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Temario */}
        <section className="mt-16" id="temario">
          <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">Temario</p>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">De cero a experto, nivel por nivel</h2>

          <div className="mt-6">
            <SelectorPlan
              platform={platform}
              planes={planes}
              plan={plan}
              contratado={planContratado}
              recorte={{ dentro: resumen.total, total: totalCompleto }}
            />
          </div>

          {niveles.length === 0 && (
            <p className="mt-6 rounded-card border border-line bg-surface-2 p-6 text-[14px] leading-relaxed text-muted">
              Este plan no habilita ninguna de las unidades de tu capacitación. Elige otro plan arriba para ver el
              temario completo.
            </p>
          )}

          <div className="mt-7 flex flex-col gap-10">
            {niveles.map((nivel) => {
              const unidades = curso.unidades.filter((u) => u.nivel === nivel.key);
              const repaso = resumen.partida !== null && orden.indexOf(nivel.key) < orden.indexOf(resumen.partida);

              return (
                <div key={nivel.key}>
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <NivelChip nivel={nivel} />
                    {repaso && (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
                        Repaso opcional según tu diagnóstico
                      </span>
                    )}
                    <p className="w-full text-[14px] leading-relaxed text-muted">{nivel.promesa}</p>
                  </div>

                  <div className="grid gap-4">
                    {unidades.map((unidad) => {
                      const hechas = unidad.lecciones.filter((l) => porSlug.get(l.slug)?.completed).length;
                      const minutos = unidad.lecciones.reduce((n, l) => n + l.minutos, 0);
                      const pct = Math.round((hechas / unidad.lecciones.length) * 100);
                      // Con un plan puesto, lo que queda en pantalla se puede usar. Lo que
                      // hay que avisar es el recorte: "sí, pero con límites".
                      const limitada = unidad.modulo && disponibilidad(unidad.modulo) === 'limitado';
                      const nota = unidad.modulo ? notaDePlan(unidad.modulo) : null;

                      return (
                        <article key={unidad.slug} className="min-w-0 rounded-card border border-line bg-surface shadow-card">
                          <header className="flex flex-wrap items-start gap-x-6 gap-y-3 p-5">
                            <div className="min-w-0 flex-1 basis-[220px]">
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                <h3 className="font-display text-[17px] font-semibold tracking-tight">{unidad.titulo}</h3>
                                {limitada && <InsigniaPlan availability="limitado" />}
                              </div>
                              <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">{unidad.descripcion}</p>
                              {limitada && nota && (
                                <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-snug text-faint">{nota}</p>
                              )}
                            </div>
                            <div className="w-full sm:w-44">
                              <p className="mb-1.5 flex justify-between text-[12px] text-muted">
                                <span>
                                  {hechas}/{unidad.lecciones.length} lecciones
                                </span>
                                <span className="font-mono text-faint">{duracion(minutos)}</span>
                              </p>
                              <Barra porcentaje={pct} color={nivel.color} />
                            </div>
                          </header>
                          <ul className="border-t border-line">
                            {unidad.lecciones.map((l) => {
                              const reg = porSlug.get(l.slug);
                              const estado = estadoDe(reg);
                              return (
                                <li key={l.slug} className="border-b border-line last:border-0">
                                  <Link
                                    href={leccionConPlan(platform, l.slug, plan)}
                                    className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--tone-soft)]"
                                  >
                                    <EstadoIcono estado={estado} color={nivel.color} />
                                    <span className="text-faint">
                                      <TipoIcono leccion={l} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-[14px] font-medium text-text">{l.titulo}</span>
                                      <span className="block truncate text-[12.5px] text-muted">{l.resumen}</span>
                                    </span>
                                    {reg?.score !== null && reg?.score !== undefined && l.tipo !== 'lectura' && (
                                      <span
                                        className={`hidden rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold sm:inline ${
                                          reg.completed ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted'
                                        }`}
                                      >
                                        {reg.score}%
                                      </span>
                                    )}
                                    <span className="hidden flex-none text-right text-[12px] text-faint sm:block">
                                      {TIPO_ETIQUETA[tipoDe(l)]} · {duracion(l.minutos)}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
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

        {/* Certificado */}
        {certificados && (
          <section className="mt-16 flex flex-wrap items-center gap-6 rounded-card bg-[var(--tone-soft)] p-6 sm:p-8">
            <div className="min-w-[240px] flex-1">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Al final</p>
              <h2 className="mt-1.5 font-display text-[22px] font-semibold tracking-tight">Un certificado que dice qué sabes hacer</h2>
              <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-muted">
                Se obtiene aprobando los {resumenTotal.examenes.total} exámenes con 80% o más y el proyecto final. No
                cuenta clics: cuenta lo que demostraste.
              </p>
              {plan && unidadesFuera > 0 && (
                <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-muted">
                  El certificado mide el curso completo, también las unidades que tu plan no habilita. Para obtenerlo
                  hay que ver todo el temario sin filtrar.
                </p>
              )}
            </div>
            <Link
              href={`/ruta/${platform}/certificado`}
              className="rounded-xl bg-[var(--tone)] px-5 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {resumenTotal.certificable ? 'Ver mi certificado' : 'Ver requisitos'}
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

function Meta({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-[12.5px] text-muted">{etiqueta}</dt>
      <dd className="font-display text-[22px] font-semibold tracking-tight">{valor}</dd>
    </div>
  );
}
