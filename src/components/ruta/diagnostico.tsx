'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { guardarDiagnostico, type ResultadoDiagnostico } from '@/app/ruta/actions';
import type { Nivel, NivelKey } from '@/lib/ruta';

type Props = {
  platformId: string;
  preguntas: { id: string; nivel: NivelKey; enunciado: string; opciones: string[] }[];
  niveles: Nivel[];
  inicioPorNivel: Partial<Record<NivelKey, { href: string; titulo: string }>>;
  cursoHref: string;
};

/**
 * El diagnóstico de entrada: una pregunta a la vez, sin mostrar si acertó, y
 * al final el nivel desde el que conviene arrancar. No es un examen: todas las
 * preguntas tienen "No lo sé", y elegirla es la respuesta más útil cuando es
 * verdad, porque pone a la persona en el nivel que le sirve.
 */
export function Diagnostico({ platformId, preguntas, niveles, inicioPorNivel, cursoHref }: Props) {
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, arrancar] = useTransition();

  const pregunta = preguntas[paso];
  const ultima = paso === preguntas.length - 1;

  function elegir(i: number) {
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: i }));
  }

  function avanzar() {
    if (!ultima) {
      setPaso((n) => n + 1);
      return;
    }
    setError(null);
    arrancar(async () => {
      try {
        const r = await guardarDiagnostico(platformId, respuestas);
        if ('error' in r) setError(r.error);
        else setResultado(r);
      } catch {
        setError('No pudimos guardar el diagnóstico. Inténtalo otra vez.');
      }
    });
  }

  if (resultado) {
    const nivel = niveles.find((n) => n.key === resultado.nivel)!;
    const inicio = inicioPorNivel[resultado.nivel];
    return (
      <section className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8" aria-live="polite">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-faint">Tu punto de partida</p>
        <h2 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-tight" style={{ color: nivel.color }}>
          {nivel.titulo}
        </h2>
        <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">
          Al terminarlo: {nivel.promesa.charAt(0).toLowerCase() + nivel.promesa.slice(1)} Lo anterior queda disponible
          como repaso, y los exámenes de esos niveles los puedes presentar directamente.
        </p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {resultado.porNivel.map((r) => {
            const n = niveles.find((x) => x.key === r.nivel)!;
            const pct = r.total ? (r.aciertos / r.total) * 100 : 0;
            return (
              <li key={r.nivel} className="grid grid-cols-[minmax(0,160px)_1fr_auto] items-center gap-3 text-[13px]">
                <span className={r.nivel === resultado.nivel ? 'font-semibold text-text' : 'text-muted'}>{n.titulo}</span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: n.color }} />
                </span>
                <span className="font-mono text-[12px] text-faint">
                  {r.aciertos}/{r.total}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          {inicio && (
            <Link
              href={inicio.href}
              className="rounded-lg bg-[var(--tone)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Empezar con {inicio.titulo} &rarr;
            </Link>
          )}
          <Link
            href={cursoHref}
            className="rounded-lg border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-muted transition-colors hover:border-[var(--tone)] hover:text-text"
          >
            Ver el temario completo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
          {paso + 1} de {preguntas.length}
        </span>
        <span className="block h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
          <span
            className="block h-full rounded-full bg-[var(--tone)] transition-[width] duration-300"
            style={{ width: `${((paso + (respuestas[pregunta.id] !== undefined ? 1 : 0)) / preguntas.length) * 100}%` }}
          />
        </span>
      </div>

      <h2 className="font-display text-[20px] font-semibold leading-snug tracking-tight">{pregunta.enunciado}</h2>

      <div className="mt-5 flex flex-col gap-2" role="radiogroup" aria-label={pregunta.enunciado}>
        {pregunta.opciones.map((o, i) => {
          const activa = respuestas[pregunta.id] === i;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={activa}
              onClick={() => elegir(i)}
              className={`rounded-xl border px-4 py-3 text-left text-[14.5px] transition-colors ${
                activa ? 'border-[var(--tone)] bg-[var(--tone-soft)] text-text' : 'border-line bg-bg text-text hover:border-[var(--tone-line)]'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {paso > 0 && (
          <button
            type="button"
            onClick={() => setPaso((n) => n - 1)}
            className="rounded-lg border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-text"
          >
            &larr; Anterior
          </button>
        )}
        <button
          type="button"
          onClick={avanzar}
          disabled={respuestas[pregunta.id] === undefined || enviando}
          className="ml-auto rounded-lg bg-[var(--tone)] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {enviando ? 'Calculando…' : ultima ? 'Ver mi nivel' : 'Siguiente'}
        </button>
      </div>
      {error && <p className="mt-3 text-[13px] text-[#c2410c] dark:text-[#f4a06a]">{error}</p>}
    </section>
  );
}
