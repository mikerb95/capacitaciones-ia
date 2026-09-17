import Link from 'next/link';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { Buscador } from '@/components/buscador';
import { SiteHeader } from '@/components/ui';
import { Bloques } from '@/components/ruta/bloques';
import { Chequeo } from '@/components/ruta/chequeo';
import { Examen } from '@/components/ruta/examen';
import { EstadoIcono, NivelChip, TIPO_ETIQUETA, TipoIcono, tipoDe } from '@/components/ruta/piezas';
import { Practica } from '@/components/ruta/practica';
import { Temario } from '@/components/ruta/temario';
import { InsigniaPlan, leccionConPlan, rutaConPlan } from '@/components/ruta/planes';
import { getPlatformName, recordModuleView } from '@/db/queries';
import {
  buscarLeccion,
  duracion,
  estadoDe,
  getCurso,
  leccionesDe,
  resumir,
  sinRespuestas,
} from '@/lib/ruta';
import { cargarCurso } from '@/lib/ruta/contexto';

export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ platform: string; leccion: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export async function generateMetadata({ params }: Pick<Params, 'params'>) {
  const { platform, leccion } = await params;
  const curso = getCurso(platform);
  const found = curso && buscarLeccion(curso, leccion);
  return found ? { title: `${found.leccion.titulo} · ${curso.titulo}` } : {};
}

/**
 * El reproductor de la ruta: el temario a un lado, la lección al centro y la
 * actividad al final. Una lección siempre termina en algo que se hace (una
 * comprobación, una práctica o un examen), y el "siguiente" solo se ofrece
 * cuando esa actividad está resuelta.
 */
export default async function LeccionPage({ params, searchParams }: Params) {
  const { platform, leccion: slug } = await params;
  const { plan: planPedido } = await searchParams;
  const cargado = await cargarCurso(platform, planPedido);
  if (!cargado) notFound();

  const {
    cursoCompleto,
    registros,
    participant,
    moduleIds,
    certificados,
    plan,
    planElegido,
    disponibilidad,
    notaDePlan,
    planMinimo,
  } = cargado;

  // A una lección que el plan oculta solo se llega por un enlace directo o por
  // un cambio de plan a media ruta. No se esconde: se abre con un aviso arriba
  // y con el temario completo al costado, porque ocultarla dejaría a la
  // persona mirando un 404 sin entender qué pasó.
  const enPlan = buscarLeccion(cargado.curso, slug) !== null;
  const curso = enPlan ? cargado.curso : cursoCompleto;
  const found = buscarLeccion(curso, slug);
  if (!found) notFound();

  const { leccion, unidad, indice, numero } = found;
  const fueraDePlan = !enPlan && planElegido !== null;
  const limitada = unidad.modulo ? disponibilidad(unidad.modulo) === 'limitado' : false;
  const notaModulo = unidad.modulo ? notaDePlan(unidad.modulo) : null;
  const minimo = unidad.modulo && fueraDePlan ? planMinimo(unidad.modulo) : null;
  const nivel = curso.niveles.find((n) => n.key === unidad.nivel)!;
  const registro = registros.find((r) => r.lessonSlug === slug);
  const estado = estadoDe(registro);
  const resumen = resumir(curso, registros);

  // Recorrer la unidad cuenta como haber abierto su módulo, que es lo que ve
  // el panel de la empresa. Se anota después de responder, como en la ficha.
  const moduleId = unidad.modulo ? moduleIds.get(unidad.modulo) : undefined;
  if (moduleId !== undefined) {
    const participantId = participant.id;
    after(() => recordModuleView(participantId, moduleId));
  }

  const lista = leccionesDe(curso);
  const nombre = await getPlatformName(platform);
  const anterior = lista[indice - 1];
  const posterior = lista[indice + 1];
  const siguiente = posterior
    ? { href: leccionConPlan(platform, posterior.leccion.slug, plan), titulo: posterior.leccion.titulo }
    : certificados
      ? { href: `/ruta/${platform}/certificado`, titulo: 'Tu certificado' }
      : { href: rutaConPlan(platform, plan), titulo: 'Volver al curso' };

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: nivel.color }}>
      <SiteHeader
        title={curso.titulo}
        subtitle={`${nivel.titulo} · ${unidad.titulo}`}
        back={{ href: rutaConPlan(platform, plan), label: 'Volver al curso' }}
        search={<Buscador plataforma={{ id: platform, name: nombre ?? curso.titulo }} />}
      >
        <span className="hidden items-center gap-2 text-[12px] text-muted sm:flex">
          <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
            <span className="block h-full rounded-full bg-[var(--tone)]" style={{ width: `${resumen.porcentaje}%` }} />
          </span>
          <span className="font-mono">{resumen.porcentaje}%</span>
        </span>
      </SiteHeader>

      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-8">
        {/* Temario: desplegable en móvil, fijo al costado en escritorio */}
        <details className="rounded-card border border-line bg-surface shadow-card lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13.5px] font-semibold">
            Temario · lección {indice + 1} de {lista.length}
            <span className="text-faint" aria-hidden="true">
              &#9662;
            </span>
          </summary>
          <div className="border-t border-line p-2">
            <Temario curso={curso} registros={registros} actual={slug} partida={resumen.partida} certificados={certificados} plan={plan} />
          </div>
        </details>
        <aside className="hidden lg:block">
          <div className="sticky top-[76px] max-h-[calc(100vh-96px)] overflow-y-auto rounded-card border border-line bg-surface p-2 shadow-card">
            <Temario curso={curso} registros={registros} actual={slug} partida={resumen.partida} certificados={certificados} plan={plan} />
          </div>
        </aside>

        <main className="mx-auto w-full max-w-[780px] min-w-0">
          {fueraDePlan && planElegido && (
            <div className="mb-6 rounded-card border border-dashed border-line bg-surface-2 p-4">
              <p className="flex items-center gap-2 text-[13.5px] font-semibold">
                <span className="size-1.5 flex-none rounded-full bg-[var(--tone)]" aria-hidden="true" />
                Esto no entra en {planElegido.name}
              </p>
              <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
                {minimo
                  ? `Lo que enseña esta lección necesita ${minimo.name} o superior.`
                  : 'Lo que enseña esta lección no está habilitado en ese plan.'}{' '}
                Puedes hacerla igual, pero con tu licencia actual no vas a poder aplicarla en tu trabajo.
              </p>
              <Link
                href={rutaConPlan(platform, plan, '#temario')}
                className="mt-2.5 inline-flex text-[13px] font-semibold text-[var(--tone)] underline-offset-4 hover:underline"
              >
                Volver a lo que sí cubre tu plan &rarr;
              </Link>
            </div>
          )}

          {!fueraDePlan && limitada && notaModulo && planElegido && (
            <div className="mb-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-card bg-surface-2 px-4 py-3">
              <InsigniaPlan availability="limitado" />
              <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-muted">
                En {planElegido.name}: {notaModulo}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
            <NivelChip nivel={nivel} corto />
            <span aria-hidden="true">/</span>
            <span>{unidad.titulo}</span>
            <span aria-hidden="true">/</span>
            <span>
              {numero} de {unidad.lecciones.length}
            </span>
          </div>

          <h1 className="mt-3 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">
            {leccion.titulo}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <TipoIcono leccion={leccion} />
              {TIPO_ETIQUETA[tipoDe(leccion)]}
            </span>
            <span>{duracion(leccion.minutos)}</span>
            <span className="flex items-center gap-1.5">
              <EstadoIcono estado={estado} color={nivel.color} />
              {estado === 'completada'
                ? registro?.score !== null && registro?.score !== undefined && leccion.tipo !== 'lectura'
                  ? `Completada · ${registro.score}%`
                  : 'Completada'
                : estado === 'reprobada'
                  ? `Intentada · mejor nota ${registro?.score ?? 0}%`
                  : 'Pendiente'}
            </span>
            {unidad.modulo && (
              <Link
                href={`/${platform}/${unidad.modulo}`}
                className="underline decoration-line underline-offset-4 transition-colors hover:text-[var(--tone)]"
              >
                Ficha del módulo
              </Link>
            )}
          </div>
          <p className="mt-4 max-w-[66ch] text-[16px] leading-relaxed text-muted">{leccion.resumen}</p>

          <div className="mt-8 flex flex-col gap-8">
            {leccion.tipo === 'lectura' && (
              <>
                <section className="rounded-card bg-surface-2 p-5">
                  <h2 className="font-display text-[14.5px] font-semibold tracking-tight">Al terminar esta lección podrás</h2>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {leccion.objetivos.map((o) => (
                      <li key={o} className="flex gap-2.5 text-[14px] leading-relaxed text-muted">
                        <span className="mt-[9px] size-1.5 flex-none rounded-full bg-[var(--tone)]" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </section>
                <Bloques bloques={leccion.bloques} />
                <Chequeo
                  platformId={platform}
                  slug={slug}
                  preguntas={leccion.chequeo}
                  completada={estado === 'completada'}
                  siguiente={siguiente}
                />
              </>
            )}

            {leccion.tipo === 'practica' && (
              <>
                <Bloques bloques={leccion.bloques} />
                <Practica
                  platformId={platform}
                  slug={slug}
                  proyecto={Boolean(leccion.proyecto)}
                  caso={leccion.caso}
                  consigna={leccion.consigna}
                  placeholder={leccion.placeholder}
                  rubrica={leccion.rubrica}
                  pistas={leccion.pistas}
                  solucion={leccion.solucion}
                  previo={{ completada: estado === 'completada', puntaje: registro?.score ?? null }}
                  siguiente={siguiente}
                />
              </>
            )}

            {leccion.tipo === 'examen' && (
              <Examen
                platformId={platform}
                slug={slug}
                preguntas={sinRespuestas(leccion.preguntas)}
                aprobacion={leccion.aprobacion}
                previo={{
                  aprobado: estado === 'completada',
                  mejorPuntaje: registro?.score ?? null,
                  intentos: registro?.attempts ?? 0,
                }}
                siguiente={siguiente}
              />
            )}
          </div>

          <nav className="no-print mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {anterior ? (
              <Link
                href={leccionConPlan(platform, anterior.leccion.slug, plan)}
                className="rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:bg-[var(--tone-soft)]"
              >
                <span className="block text-[12px] text-faint">&larr; Anterior</span>
                <span className="mt-0.5 block text-[14px] font-medium">{anterior.leccion.titulo}</span>
              </Link>
            ) : (
              <span />
            )}
            <Link
              href={siguiente.href}
              className="rounded-card border border-line bg-surface p-4 text-right shadow-card transition-colors hover:bg-[var(--tone-soft)]"
            >
              <span className="block text-[12px] text-faint">Siguiente &rarr;</span>
              <span className="mt-0.5 block text-[14px] font-medium">{siguiente.titulo}</span>
            </Link>
          </nav>
        </main>
      </div>
    </div>
  );
}
