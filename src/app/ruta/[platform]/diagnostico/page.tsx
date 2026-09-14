import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/ui';
import { Diagnostico } from '@/components/ruta/diagnostico';
import { getCurso, type NivelKey } from '@/lib/ruta';
import { cargarCurso } from '@/lib/ruta/contexto';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Params) {
  const { platform } = await params;
  const curso = getCurso(platform);
  return curso ? { title: `Diagnóstico · ${curso.titulo}` } : {};
}

export default async function DiagnosticoPage({ params }: Params) {
  const { platform } = await params;
  const cargado = await cargarCurso(platform);
  if (!cargado) notFound();

  const { curso } = cargado;

  // Dónde empieza cada nivel dentro del curso recortado. Si el alcance dejó un
  // nivel sin unidades, se apunta al siguiente que sí tenga.
  const orden = curso.niveles.map((n) => n.key);
  const inicioPorNivel: Partial<Record<NivelKey, { href: string; titulo: string }>> = {};
  for (const key of orden) {
    const unidad = curso.unidades.find((u) => orden.indexOf(u.nivel) >= orden.indexOf(key));
    const primera = unidad?.lecciones[0];
    if (primera) inicioPorNivel[key] = { href: `/ruta/${platform}/${primera.slug}`, titulo: primera.titulo };
  }

  return (
    <div className="tone min-h-screen bg-bg" style={{ ['--tone' as string]: curso.color }}>
      <SiteHeader
        title="Diagnóstico de entrada"
        subtitle={curso.titulo}
        back={{ href: `/ruta/${platform}`, label: 'Volver al curso' }}
      />
      <main className="mx-auto max-w-[680px] px-4 py-10 sm:px-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-faint">5 minutos · sin nota</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">
          ¿Desde dónde arrancas?
        </h1>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
          {curso.diagnostico.length} preguntas, de lo más básico a lo más avanzado. Si no sabes una, elige &quot;No lo
          sé&quot;: adivinar solo te manda a un nivel que no te sirve.
        </p>
        <div className="mt-7">
          <Diagnostico
            platformId={platform}
            preguntas={curso.diagnostico.map((p) => ({
              id: p.id,
              nivel: p.nivel,
              enunciado: p.enunciado,
              opciones: p.opciones.map((o) => o.texto),
            }))}
            niveles={curso.niveles}
            inicioPorNivel={inicioPorNivel}
            cursoHref={`/ruta/${platform}`}
          />
        </div>
      </main>
    </div>
  );
}
