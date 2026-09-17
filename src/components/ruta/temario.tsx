import Link from 'next/link';
import {
  duracion,
  estadoDe,
  type Curso,
  type NivelKey,
  type RegistroLeccion,
} from '@/lib/ruta';
import { EstadoIcono, TipoIcono } from './piezas';

type Props = {
  curso: Curso;
  registros: RegistroLeccion[];
  actual?: string;
  partida: NivelKey | null;
  certificados: boolean;
};

/**
 * El temario compacto del reproductor: todas las unidades con sus lecciones y
 * el estado de cada una. Es la barra lateral de las plataformas de cursos, y
 * sirve para lo mismo: saber dónde estás y saltar sin volver a la portada.
 */
export function Temario({ curso, registros, actual, partida, certificados }: Props) {
  const porSlug = new Map(registros.map((r) => [r.lessonSlug, r]));
  const orden = curso.niveles.map((n) => n.key);

  return (
    <nav aria-label="Temario del curso" className="flex flex-col gap-4">
      {curso.niveles.map((nivel) => {
        const unidades = curso.unidades.filter((u) => u.nivel === nivel.key);
        if (unidades.length === 0) return null;
        const repaso = partida !== null && orden.indexOf(nivel.key) < orden.indexOf(partida);

        return (
          <div key={nivel.key}>
            <p className="mb-1.5 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              <span className="size-1.5 rounded-full" style={{ background: nivel.color }} aria-hidden="true" />
              {nivel.titulo}
              {repaso && <span className="font-normal normal-case tracking-normal">· repaso</span>}
            </p>
            {unidades.map((unidad) => (
              <div key={unidad.slug} className="mb-2">
                <p className="px-2 py-1 text-[12.5px] font-semibold text-text">{unidad.titulo}</p>
                <ul className="flex flex-col">
                  {unidad.lecciones.map((l) => {
                    const esActual = l.slug === actual;
                    return (
                      <li key={l.slug}>
                        <Link
                          href={`/ruta/${curso.platformId}/${l.slug}`}
                          aria-current={esActual ? 'page' : undefined}
                          className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition-colors ${
                            esActual
                              ? 'bg-[var(--tone-soft)] font-semibold text-text'
                              : 'text-muted hover:bg-surface-2 hover:text-text'
                          }`}
                        >
                          <EstadoIcono estado={estadoDe(porSlug.get(l.slug))} color={nivel.color} />
                          <span className="min-w-0 flex-1">{l.titulo}</span>
                          <span className="mt-px flex flex-none items-center gap-1 text-faint">
                            <TipoIcono leccion={l} size={13} />
                            <span className="font-mono text-[10.5px]">{duracion(l.minutos)}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
      {certificados && (
        <Link
          href={`/ruta/${curso.platformId}/certificado`}
          aria-current={actual === 'certificado' ? 'page' : undefined}
          className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-semibold transition-colors ${
            actual === 'certificado' ? 'bg-[var(--tone-soft)] text-text' : 'text-muted hover:bg-surface-2 hover:text-text'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="8" cy="6" r="3.5" />
            <path d="m5.8 9 -1 5 3.2-1.6L11.2 14l-1-5" strokeLinejoin="round" />
          </svg>
          Certificado
        </Link>
      )}
    </nav>
  );
}
