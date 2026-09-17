import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/ui';
import { Certificado } from '@/components/ruta/certificado';
import { EstadoIcono } from '@/components/ruta/piezas';
import { SIN_PLAN } from '@/lib/plans';
import { duracion, estadoDe, getCurso, leccionesDe, resumir } from '@/lib/ruta';
import { cargarCurso } from '@/lib/ruta/contexto';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Params) {
  const { platform } = await params;
  const curso = getCurso(platform);
  return curso ? { title: `Certificado · ${curso.titulo}` } : {};
}

/**
 * El certificado, o lo que falta para tenerlo. Mientras no esté listo, la
 * página es una lista de requisitos con enlace a cada uno: nadie debería tener
 * que adivinar qué le falta.
 */
export default async function CertificadoPage({ params }: Params) {
  const { platform } = await params;
  // El diploma no se recorta con el plan: mide el curso entero.
  const cargado = await cargarCurso(platform, SIN_PLAN);
  if (!cargado) notFound();

  // Con los certificados apagados desde el panel, la página no existe.
  const { curso, registros, participant, certificados } = cargado;
  if (!certificados) notFound();
  const resumen = resumir(curso, registros);
  const porSlug = new Map(registros.map((r) => [r.lessonSlug, r]));

  const requisitos = leccionesDe(curso).filter(
    (l) => l.leccion.tipo === 'examen' || (l.leccion.tipo === 'practica' && l.leccion.proyecto),
  );

  const header = (
    <SiteHeader
      title="Certificado"
      subtitle={curso.titulo}
      back={{ href: `/ruta/${platform}`, label: 'Volver al curso' }}
    />
  );

  if (!resumen.certificable) {
    const hechos = requisitos.filter((r) => porSlug.get(r.leccion.slug)?.completed).length;
    return (
      <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: curso.color }}>
        {header}
        <main className="mx-auto max-w-[680px] px-4 py-10 sm:px-6">
          <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight">
            Te faltan {requisitos.length - hechos} de {requisitos.length} para el certificado
          </h1>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
            El certificado pide aprobar cada examen de nivel con 80% o más y el proyecto final. Las lecciones no son
            obligatorias: si ya sabes el tema, puedes presentar el examen directamente.
          </p>
          <ul className="mt-7 flex flex-col gap-2.5">
            {requisitos.map((r) => {
              const reg = porSlug.get(r.leccion.slug);
              const nivel = curso.niveles.find((n) => n.key === r.unidad.nivel)!;
              return (
                <li key={r.leccion.slug}>
                  <Link
                    href={`/ruta/${platform}/${r.leccion.slug}`}
                    className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:bg-[var(--tone-soft)]"
                  >
                    <EstadoIcono estado={estadoDe(reg)} color={nivel.color} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium">{r.leccion.titulo}</span>
                      <span className="block text-[12.5px] text-muted">{nivel.titulo}</span>
                    </span>
                    <span className="font-mono text-[12px] text-faint">
                      {reg?.completed ? `${reg.score ?? 100}%` : reg?.attempts ? `mejor ${reg.score ?? 0}%` : 'pendiente'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </main>
      </div>
    );
  }

  // La fecha del certificado es la del último requisito cumplido, no la de hoy:
  // abrir la página otro día no cambia cuándo terminó.
  const fechas = requisitos
    .map((r) => registros.find((x) => x.lessonSlug === r.leccion.slug)?.completedAt)
    .filter((d): d is Date => d instanceof Date);
  const terminado = fechas.length ? new Date(Math.max(...fechas.map((d) => d.getTime()))) : new Date();
  const fecha = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(terminado);
  const folio = `${platform.toUpperCase()}-${participant.id.toString().padStart(5, '0')}-${terminado
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '')}`;

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: curso.color }}>
      <div className="no-print">{header}</div>
      <main className="mx-auto max-w-[860px] px-4 py-10 sm:px-6 print:max-w-none print:p-0">
        <Certificado
          nombreInicial={participant.name ?? ''}
          curso={curso.titulo}
          capacitacion={participant.accessCode.label}
          fecha={fecha}
          folio={folio}
          horas={duracion(resumen.minutosTotales)}
          niveles={curso.niveles
            .filter((n) => curso.unidades.some((u) => u.nivel === n.key))
            .map((n) => ({ titulo: n.titulo, color: n.color }))}
          color={curso.color}
        />
      </main>
    </div>
  );
}
