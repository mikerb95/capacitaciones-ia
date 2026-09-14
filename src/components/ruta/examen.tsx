'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { enviarExamen } from '@/app/ruta/actions';
import type { PreguntaPublica, ResultadoExamen } from '@/lib/ruta';

type Props = {
  platformId: string;
  slug: string;
  preguntas: PreguntaPublica[];
  aprobacion: number;
  previo: { aprobado: boolean; mejorPuntaje: number | null; intentos: number };
  siguiente: { href: string; titulo: string } | null;
};

/**
 * El examen de nivel. Se contesta completo y se envía de una vez; la nota la
 * pone el servidor. Mientras no apruebe, la persona ve qué preguntas falló y
 * por qué su opción no era, pero no cuál era la correcta: para eso están las
 * lecciones, y cada intento mezcla el orden de las opciones.
 */
export function Examen({ platformId, slug, preguntas, aprobacion, previo, siguiente }: Props) {
  // Orden de opciones por intento. Se baraja en el cliente solo para mostrar:
  // lo que viaja al servidor es siempre el índice original.
  const [intento, setIntento] = useState(0);
  const [orden, setOrden] = useState(() => preguntas.map((p) => p.opciones.map((_, i) => i)));
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<ResultadoExamen | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, arrancar] = useTransition();
  const [empezado, setEmpezado] = useState(false);

  const contestadas = preguntas.filter((p) => respuestas[p.id] !== undefined).length;

  function enviar() {
    setError(null);
    arrancar(async () => {
      try {
        const r = await enviarExamen(platformId, slug, respuestas);
        if ('error' in r) setError(r.error);
        else {
          setResultado(r);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch {
        setError('No pudimos enviar el examen. Revisa la conexión e inténtalo otra vez.');
      }
    });
  }

  function reintentar() {
    setOrden(preguntas.map((p) => barajar(p.opciones.map((_, i) => i))));
    setRespuestas({});
    setResultado(null);
    setIntento((n) => n + 1);
  }

  if (!empezado && !resultado) {
    return (
      <section className="rounded-card border border-line bg-surface p-6 shadow-card">
        <dl className="grid grid-cols-3 gap-3 text-center">
          <Dato valor={String(preguntas.length)} etiqueta="preguntas" />
          <Dato valor={`${aprobacion}%`} etiqueta="para aprobar" />
          <Dato valor={previo.mejorPuntaje !== null ? `${previo.mejorPuntaje}%` : 'Sin intentos'} etiqueta="tu mejor nota" />
        </dl>
        <ul className="mt-5 flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-muted">
          <li>Sin límite de tiempo ni de intentos. Queda tu mejor nota.</li>
          <li>Si no apruebas, te decimos qué fallaste y por qué, pero no la respuesta.</li>
          <li>Al aprobar ves la explicación completa de cada pregunta.</li>
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              // Se baraja al empezar y no al montar: en el servidor no hay azar
              // que coincida con el del navegador.
              setOrden(preguntas.map((p) => barajar(p.opciones.map((_, i) => i))));
              setEmpezado(true);
            }}
            className="rounded-lg bg-[var(--tone)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            {previo.intentos ? (previo.aprobado ? 'Repasar el examen' : 'Intentar de nuevo') : 'Empezar el examen'}
          </button>
          {previo.aprobado && (
            <span className="text-[13px] font-semibold text-accent">Ya lo aprobaste</span>
          )}
        </div>
      </section>
    );
  }

  const porId = new Map(resultado?.detalle.map((d) => [d.id, d]));

  return (
    <section className="flex flex-col gap-4" key={intento}>
      {resultado && (
        <div
          className={`rounded-card p-5 ${resultado.aprobado ? 'bg-accent-soft' : 'bg-[#fdf1e8] dark:bg-[#2a1a10]'}`}
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`font-display text-[40px] font-semibold leading-none tracking-tight ${
                resultado.aprobado ? 'text-accent' : 'text-[#c2410c] dark:text-[#f4a06a]'
              }`}
            >
              {resultado.puntaje}%
            </span>
            <div className="min-w-[200px] flex-1">
              <p className="font-display text-[17px] font-semibold tracking-tight">
                {resultado.aprobado ? 'Aprobaste el examen' : 'Todavía no alcanza'}
              </p>
              <p className="text-[13.5px] leading-relaxed text-muted">
                {resultado.aciertos} de {resultado.total} correctas. Se aprueba con {resultado.aprobacion}%.
                {' '}Intento {resultado.intentos}, mejor nota {resultado.mejorPuntaje}%.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {resultado.aprobado ? (
              siguiente && (
                <Link
                  href={siguiente.href}
                  className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Siguiente: {siguiente.titulo} &rarr;
                </Link>
              )
            ) : (
              <button
                type="button"
                onClick={reintentar}
                className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Intentar de nuevo
              </button>
            )}
          </div>
        </div>
      )}

      {preguntas.map((p, n) => {
        const d = porId.get(p.id);
        return (
          <fieldset key={p.id} className="rounded-card border border-line bg-surface p-5 shadow-card">
            <legend className="sr-only">Pregunta {n + 1}</legend>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                Pregunta {n + 1} de {preguntas.length}
              </span>
              {d && (
                <span className={`text-[12px] font-semibold ${d.acerto ? 'text-accent' : 'text-[#c2410c] dark:text-[#f4a06a]'}`}>
                  {d.acerto ? 'Correcta' : 'Incorrecta'}
                </span>
              )}
            </div>
            <p className="font-display text-[15.5px] font-semibold leading-snug tracking-tight">{p.enunciado}</p>

            <div className="mt-3.5 flex flex-col gap-2">
              {orden[n].map((i) => {
                const activa = respuestas[p.id] === i;
                const esCorrecta = d?.correcta === i;
                let tono = activa ? 'border-[var(--tone)] bg-[var(--tone-soft)]' : 'border-line bg-bg hover:border-[var(--tone-line)]';
                if (d) {
                  tono = esCorrecta
                    ? 'border-accent bg-accent-soft'
                    : activa
                      ? d.acerto
                        ? 'border-accent bg-accent-soft'
                        : 'border-[#e8a27a] bg-[#fdf1e8] dark:border-[#7a4020] dark:bg-[#2a1a10]'
                      : 'border-line bg-bg opacity-70';
                }
                return (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-[14px] leading-relaxed transition-colors has-[:disabled]:cursor-default ${tono}`}
                  >
                    <input
                      type="radio"
                      name={p.id}
                      checked={activa}
                      disabled={Boolean(resultado)}
                      onChange={() => setRespuestas((prev) => ({ ...prev, [p.id]: i }))}
                      className="mt-1 accent-[var(--tone)]"
                    />
                    <span className="min-w-0 text-text">{p.opciones[i]}</span>
                  </label>
                );
              })}
            </div>

            {d?.explicacion && (
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                <span className="font-semibold text-text">Tu respuesta: </span>
                {d.explicacion}
              </p>
            )}
            {d && !d.acerto && d.explicacionCorrecta && (
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                <span className="font-semibold text-accent">La correcta: </span>
                {d.explicacionCorrecta}
              </p>
            )}
          </fieldset>
        );
      })}

      {!resultado && (
        <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-card border border-line bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-5 py-3.5 shadow-lift backdrop-blur">
          <span className="flex-1 text-[13px] text-muted">
            {error ?? `${contestadas} de ${preguntas.length} contestadas`}
          </span>
          <button
            type="button"
            onClick={enviar}
            disabled={contestadas < preguntas.length || enviando}
            className="rounded-lg bg-[var(--tone)] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {enviando ? 'Calificando…' : 'Enviar examen'}
          </button>
        </div>
      )}
    </section>
  );
}

function Dato({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="flex flex-col-reverse rounded-xl bg-surface-2 px-2 py-3">
      <dt className="text-[12px] text-muted">{etiqueta}</dt>
      <dd className="font-display text-[20px] font-semibold tracking-tight">{valor}</dd>
    </div>
  );
}

function barajar<T>(lista: T[]) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
