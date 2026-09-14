'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { autoevaluar, revisarEntrega, type EntregaPractica } from '@/app/ruta/actions';
import type { CriterioPractica } from '@/lib/ruta';
import { Copiar } from './copiar';

type Props = {
  platformId: string;
  slug: string;
  proyecto: boolean;
  caso: { rol: string; tarea: string; situacion: string };
  consigna: string;
  placeholder?: string;
  rubrica: CriterioPractica[];
  pistas: string[];
  solucion: string;
  previo: { completada: boolean; puntaje: number | null };
  siguiente: { href: string; titulo: string } | null;
};

const MINIMO = 30;

/**
 * Una práctica: el caso, la caja para resolverlo y, solo después de intentar,
 * la revisión y cómo la resolvimos nosotros. Es el entrenador de prompts con
 * dos cosas más: la rúbrica es propia de cada práctica, y el resultado cuenta
 * para el avance.
 *
 * La rúbrica se ve desde el principio, a diferencia del entrenador. Aquí no se
 * mide si la persona intuye qué es un buen prompt (eso ya lo enseñó la
 * lección), sino si sabe aplicarlo, y ocultar los criterios sería examinar de
 * memoria.
 */
export function Practica(props: Props) {
  const { platformId, slug, proyecto, caso, consigna, placeholder, rubrica, pistas, solucion, previo, siguiente } =
    props;

  const [texto, setTexto] = useState('');
  const [entrega, setEntrega] = useState<EntregaPractica | null>(null);
  const [marcas, setMarcas] = useState<Set<string>>(new Set());
  const [auto, setAuto] = useState<{ puntaje: number; completada: boolean } | null>(null);
  const [pistasVistas, setPistasVistas] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [revisando, arrancar] = useTransition();

  const suficiente = texto.trim().length >= MINIMO;

  function enviar() {
    setError(null);
    arrancar(async () => {
      try {
        const r = await revisarEntrega(platformId, slug, texto);
        if ('error' in r) setError(r.error);
        else setEntrega(r);
      } catch {
        setError('No pudimos enviar tu práctica. Revisa la conexión e inténtalo otra vez.');
      }
    });
  }

  function guardarAuto() {
    setError(null);
    arrancar(async () => {
      try {
        const r = await autoevaluar(platformId, slug, [...marcas]);
        if ('error' in r) setError(r.error);
        else setAuto(r);
      } catch {
        setError('No pudimos guardar tu autoevaluación.');
      }
    });
  }

  function otraVez() {
    setEntrega(null);
    setAuto(null);
    setMarcas(new Set());
  }

  const ia = entrega?.revision.via === 'ia' ? entrega.revision : null;
  const manual = entrega?.revision.via === 'manual' ? entrega.revision : null;
  const puntaje = ia ? entrega!.puntaje : auto?.puntaje ?? null;
  const completada = ia ? entrega!.completada : auto?.completada ?? false;
  const cerrada = Boolean(ia || auto);

  return (
    <div className="flex flex-col gap-4">
      {/* El caso */}
      <section className="rounded-card border border-line bg-surface p-5 shadow-card">
        <div className="mb-2 flex items-center gap-2">
          <span className="size-2 rounded-full bg-[var(--tone)]" aria-hidden="true" />
          <span className="text-[12px] font-semibold tracking-wide text-muted">{caso.rol}</span>
        </div>
        <h2 className="font-display text-[19px] font-semibold tracking-tight">{caso.tarea}</h2>
        <p className="mt-2 max-w-[66ch] text-[14.5px] leading-relaxed text-muted">{caso.situacion}</p>
      </section>

      {/* La rúbrica, a la vista */}
      <section className="rounded-card bg-surface-2 p-5">
        <h3 className="font-display text-[14.5px] font-semibold tracking-tight">Con qué se revisa</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {rubrica.map((c) => (
            <li key={c.id} className="text-[13px] leading-relaxed">
              <span className="font-semibold text-text">{c.titulo}. </span>
              <span className="text-muted">{c.pregunta}</span>
            </li>
          ))}
        </ul>
        {pistas.length > 0 && !cerrada && (
          <div className="mt-4 flex flex-col gap-1.5">
            {pistas.slice(0, pistasVistas).map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-muted">
                <span className="font-semibold text-[var(--tone)]">Pista {i + 1}: </span>
                {p}
              </p>
            ))}
            {pistasVistas < pistas.length && (
              <button
                type="button"
                onClick={() => setPistasVistas((n) => n + 1)}
                className="self-start text-[12.5px] font-medium text-muted underline decoration-line underline-offset-4 hover:text-[var(--tone)]"
              >
                {pistasVistas ? 'Otra pista' : '¿Atascado? Ver una pista'}
              </button>
            )}
          </div>
        )}
      </section>

      {/* La entrega */}
      <section className="rounded-card border border-line bg-surface p-5 shadow-card">
        <label htmlFor="entrega" className="block font-display text-[15.5px] font-semibold tracking-tight">
          {consigna}
        </label>
        <p className="mb-3.5 mt-1 text-[13px] leading-relaxed text-muted">
          {proyecto
            ? 'Tómate el tiempo. Tu texto no se guarda: si cierras la página se pierde, así que escríbelo en otro lado si es largo.'
            : 'Como lo harías de verdad. Tu texto no se guarda, solo el resultado de la revisión.'}
        </p>
        <textarea
          id="entrega"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          readOnly={Boolean(entrega) || revisando}
          rows={proyecto ? 16 : 6}
          placeholder={placeholder}
          spellCheck={!placeholder?.includes('project')}
          className="w-full resize-y rounded-xl border border-line bg-bg px-3.5 py-3 font-[inherit] text-[14px] leading-relaxed text-text outline-none transition-colors placeholder:text-faint focus:border-[var(--tone)] read-only:text-muted"
        />
        {!entrega && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={enviar}
              disabled={!suficiente || revisando}
              className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {revisando ? 'Revisando…' : proyecto ? 'Entregar el proyecto' : 'Enviar a revisión'}
            </button>
            <span className="text-[12px] text-faint">
              {error ??
                (revisando
                  ? 'Un momento, lo estamos leyendo.'
                  : previo.completada
                    ? `Ya la hiciste${previo.puntaje !== null ? ` (mejor resultado ${previo.puntaje}%)` : ''}. Puedes repetirla.`
                    : suficiente
                      ? 'Después de enviarla ves la revisión y nuestra solución.'
                      : 'Escribe tu respuesta primero.')}
            </span>
          </div>
        )}
      </section>

      {/* Revisión con IA */}
      {ia && (
        <section className="rounded-card border border-line bg-surface p-5 shadow-card" aria-live="polite">
          <Encabezado puntaje={puntaje} completada={completada} proyecto={proyecto} />
          <p className="mb-4 max-w-[66ch] text-[13.5px] leading-relaxed text-muted">{ia.veredicto.resumen}</p>
          <ul className="flex flex-col gap-1.5">
            {ia.veredicto.criterios.map((c) => {
              const criterio = rubrica.find((x) => x.id === c.id);
              return (
                <li
                  key={c.id}
                  className={`flex items-start gap-3 rounded-xl p-3 ${c.cumple ? 'bg-accent-soft' : 'bg-surface-2'}`}
                >
                  <Marca ok={c.cumple} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold text-text">
                      {criterio?.titulo ?? c.id}
                      <span className="sr-only">{c.cumple ? ': cumple' : ': no cumple'}</span>
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{c.comentario}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 rounded-xl bg-[var(--tone-soft)] p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-display text-[14px] font-semibold tracking-tight">Tu entrega, corregida</h4>
              <span className="ml-auto flex items-center gap-2">
                <span className="font-mono text-[11px] text-faint">revisado por {ia.proveedor}</span>
                <Copiar texto={ia.veredicto.mejorado} />
              </span>
            </div>
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-text">{ia.veredicto.mejorado}</p>
          </div>
        </section>
      )}

      {/* Sin revisor: autoevaluación */}
      {manual && (
        <section className="rounded-card border border-line bg-surface p-5 shadow-card">
          {auto ? (
            <Encabezado puntaje={auto.puntaje} completada={auto.completada} proyecto={proyecto} />
          ) : (
            <>
              <h3 className="font-display text-[15.5px] font-semibold tracking-tight">Revísala tú con la rúbrica</h3>
              <p className="mb-4 mt-1 max-w-[66ch] text-[13px] leading-relaxed text-muted">
                El revisor automático no está disponible ahora. Compara con nuestra solución de abajo y marca solo lo
                que de verdad escribiste.
              </p>
            </>
          )}
          <ul className="flex flex-col gap-1.5">
            {rubrica.map((c) => {
              const activo = marcas.has(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    disabled={Boolean(auto)}
                    aria-pressed={activo}
                    onClick={() =>
                      setMarcas((prev) => {
                        const next = new Set(prev);
                        if (next.has(c.id)) next.delete(c.id);
                        else next.add(c.id);
                        return next;
                      })
                    }
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors disabled:cursor-default ${
                      activo ? 'border-[var(--tone-line)] bg-[var(--tone-soft)]' : 'border-line bg-bg hover:border-[var(--tone-line)]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-[18px] flex-none place-items-center rounded-md border ${
                        activo ? 'border-transparent bg-[var(--tone)]' : 'border-line bg-surface'
                      }`}
                      aria-hidden="true"
                    >
                      {activo && <Check />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold text-text">{c.titulo}</span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{c.pregunta}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {!auto && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={guardarAuto}
                disabled={revisando}
                className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-35"
              >
                {revisando ? 'Guardando…' : 'Guardar mi autoevaluación'}
              </button>
              <Copiar texto={manual.paquete} etiqueta="Copiar para revisarla con una IA" />
              {error && <span className="text-[12px] text-faint">{error}</span>}
            </div>
          )}
        </section>
      )}

      {/* Nuestra solución, solo después de intentar */}
      {entrega && (
        <section className="rounded-card border border-line bg-surface p-5 shadow-card">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-[15.5px] font-semibold tracking-tight">Así la resolvimos nosotros</h3>
            <span className="ml-auto">
              <Copiar texto={solucion} />
            </span>
          </div>
          <p className="mb-3 text-[13px] leading-relaxed text-muted">
            No es la única respuesta válida. Mira qué trae que a la tuya le faltó, y qué tenía la tuya que esta no.
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-surface-2 p-4 font-mono text-[12.5px] leading-relaxed text-text">
            {solucion}
          </pre>
        </section>
      )}

      {entrega && (manual ? auto : true) && (
        <div className="flex flex-wrap items-center gap-3">
          {completada && siguiente && (
            <Link
              href={siguiente.href}
              className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Siguiente: {siguiente.titulo} &rarr;
            </Link>
          )}
          <button
            type="button"
            onClick={otraVez}
            className="rounded-lg border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-muted transition-colors hover:border-[var(--tone)] hover:text-text"
          >
            Corregir y enviar otra vez
          </button>
        </div>
      )}
    </div>
  );
}

function Encabezado({ puntaje, completada, proyecto }: { puntaje: number | null; completada: boolean; proyecto: boolean }) {
  return (
    <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
        {proyecto ? (completada ? 'Proyecto aprobado' : 'Al proyecto le falta') : 'Tu práctica, revisada'}
      </h3>
      {puntaje !== null && <span className="font-mono text-[13px] font-semibold text-[var(--tone)]">{puntaje}%</span>}
      {proyecto && !completada && (
        <span className="w-full text-[12.5px] text-muted">Se aprueba con dos tercios de la rúbrica. Corrige y vuelve a entregar.</span>
      )}
    </div>
  );
}

function Marca({ ok }: { ok: boolean }) {
  return (
    <span
      className={`mt-0.5 grid size-[18px] flex-none place-items-center rounded-md ${ok ? 'bg-accent' : 'bg-faint'}`}
      aria-hidden="true"
    >
      {ok ? (
        <Check />
      ) : (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
