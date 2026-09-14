'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { completarLectura } from '@/app/ruta/actions';
import type { Pregunta } from '@/lib/ruta';

type Props = {
  platformId: string;
  slug: string;
  preguntas: Pregunta[];
  completada: boolean;
  siguiente: { href: string; titulo: string } | null;
};

/**
 * Cierre de una lectura: una comprobación rápida y el botón para darla por
 * vista. La comprobación no califica ni se guarda, pero hay que acertarla para
 * seguir: se puede reintentar cuantas veces haga falta, y cada opción explica
 * por qué es o no es, que es donde de verdad se fija la idea.
 */
export function Chequeo({ platformId, slug, preguntas, completada, siguiente }: Props) {
  const [elegidas, setElegidas] = useState<Record<string, number>>({});
  const [hecha, setHecha] = useState(completada);
  const [error, setError] = useState<string | null>(null);
  const [guardando, arrancar] = useTransition();

  const acertadas = preguntas.filter((p) => p.opciones[elegidas[p.id]]?.correcta).length;
  const listo = acertadas === preguntas.length;

  function completar() {
    setError(null);
    arrancar(async () => {
      try {
        const r = await completarLectura(platformId, slug);
        if ('error' in r) setError(r.error);
        else setHecha(true);
      } catch {
        setError('No pudimos guardar tu avance. Revisa la conexión e inténtalo otra vez.');
      }
    });
  }

  return (
    <section className="flex flex-col gap-4">
      {preguntas.map((p, n) => {
        const elegida = elegidas[p.id];
        const opcion = elegida !== undefined ? p.opciones[elegida] : undefined;
        const bien = Boolean(opcion?.correcta);

        return (
          <div key={p.id} className="rounded-card border border-line bg-surface p-5 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--tone)]" aria-hidden="true" />
              <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted">
                Comprueba lo que aprendiste{preguntas.length > 1 ? ` · ${n + 1}` : ''}
              </span>
            </div>
            <p className="font-display text-[16px] font-semibold leading-snug tracking-tight">{p.enunciado}</p>

            <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label={p.enunciado}>
              {p.opciones.map((o, i) => {
                const activa = elegida === i;
                const tono = !activa
                  ? 'border-line bg-bg hover:border-[var(--tone-line)]'
                  : o.correcta
                    ? 'border-accent bg-accent-soft'
                    : 'border-[#e8a27a] bg-[#fdf1e8] dark:border-[#7a4020] dark:bg-[#2a1a10]';
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={activa}
                    disabled={bien}
                    onClick={() => setElegidas((prev) => ({ ...prev, [p.id]: i }))}
                    className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-[14px] leading-relaxed transition-colors disabled:cursor-default ${tono}`}
                  >
                    <span
                      className={`mt-[3px] grid size-[16px] flex-none place-items-center rounded-full border-[1.5px] ${
                        activa ? 'border-transparent bg-current' : 'border-line'
                      } ${activa ? (o.correcta ? 'text-accent' : 'text-[#c2410c]') : ''}`}
                      aria-hidden="true"
                    >
                      {activa && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="min-w-0 text-text">{o.texto}</span>
                  </button>
                );
              })}
            </div>

            {opcion && (
              <p
                className={`mt-3 text-[13.5px] leading-relaxed ${bien ? 'text-accent' : 'text-[#c2410c] dark:text-[#f4a06a]'}`}
                aria-live="polite"
              >
                <span className="font-semibold">{bien ? 'Correcto. ' : 'No exactamente. '}</span>
                <span className="text-muted">{opcion.explicacion}</span>
                {!bien && <span className="text-muted"> Prueba con otra opción.</span>}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface-2 px-5 py-4">
        {hecha ? (
          <>
            <span className="flex items-center gap-2 text-[14px] font-semibold text-accent">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Lección completada
            </span>
            {siguiente && (
              <Link
                href={siguiente.href}
                className="ml-auto rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Siguiente: {siguiente.titulo} &rarr;
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="min-w-[200px] flex-1 text-[13px] leading-relaxed text-muted">
              {error ??
                (listo
                  ? 'Listo. Marca la lección y seguimos.'
                  : 'Contesta bien la comprobación para marcar la lección como completada.')}
            </p>
            <button
              type="button"
              onClick={completar}
              disabled={!listo || guardando}
              className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {guardando ? 'Guardando…' : 'Marcar como completada'}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
