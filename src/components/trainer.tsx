'use client';

import { useState, useTransition } from 'react';
import { calificar } from '@/app/entrenador/actions';
import { CRITERIOS, type Reto } from '@/lib/entrenador';
import type { Resultado } from '@/lib/evaluador';

type PromptModelo = { id: number; tag: string; text: string };
type Tropiezo = { id: number; bad: string; good: string };

type Props = {
  retos: Reto[];
  prompts: PromptModelo[];
  tropiezos: Tropiezo[];
  platformId: string;
  slug: string;
  moduloNombre: string;
  plataformaNombre: string;
};

/** Lo mínimo para que la revisión signifique algo. Debajo de esto no hay qué mirar. */
const MINIMO = 25;

export function Trainer({
  retos,
  prompts,
  tropiezos,
  platformId,
  slug,
  moduloNombre,
  plataformaNombre,
}: Props) {
  const [i, setI] = useState(0);
  // Un intento por reto: quien vuelve atrás encuentra lo que había escrito.
  const [intentos, setIntentos] = useState<string[]>(() => retos.map(() => ''));
  const [revelados, setRevelados] = useState<boolean[]>(() => retos.map(() => false));
  const [resultados, setResultados] = useState<(Resultado | null)[]>(() => retos.map(() => null));
  // Lo que la persona marcó de su propio prompt, cuando le toca calificarse sola.
  const [marcas, setMarcas] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [revisando, arrancar] = useTransition();

  const reto = retos[i];
  const intento = intentos[i] ?? '';
  const revelado = revelados[i] ?? false;
  const resultado = resultados[i] ?? null;
  const suficiente = intento.trim().length >= MINIMO;

  function escribir(valor: string) {
    setIntentos((prev) => prev.map((t, n) => (n === i ? valor : t)));
  }

  function revelar() {
    setError(null);
    const posicion = i;

    arrancar(async () => {
      let veredicto: Resultado | null = null;

      try {
        const respuesta = await calificar(platformId, slug, reto.numero, intento);
        if ('error' in respuesta) {
          setError(respuesta.error);
          return;
        }
        veredicto = respuesta;
      } catch {
        // La red se cayó o la acción falló. No se bloquea el ejercicio: se
        // revela igual y la persona se califica con la lista de chequeo.
        veredicto = null;
      }

      setResultados((prev) => prev.map((r, n) => (n === posicion ? veredicto : r)));
      setRevelados((prev) => prev.map((v, n) => (n === posicion ? true : v)));
    });
  }

  function marcar(criterioId: string) {
    const clave = `${i}:${criterioId}`;
    setMarcas((prev) => ({ ...prev, [clave]: !prev[clave] }));
  }

  const marcados = CRITERIOS.filter((c) => marcas[`${i}:${c.id}`]).length;
  const califico = resultado?.via === 'ia' ? resultado : null;
  const cumplidos = califico?.veredicto.criterios.filter((c) => c.cumple).length ?? 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Dónde va, y el salto entre retos */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
          Reto {reto.numero} de {retos.length}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {retos.map((r, n) => (
            <button
              key={r.numero}
              onClick={() => setI(n)}
              aria-label={`Ir al reto ${r.numero}`}
              aria-current={n === i}
              className={`h-1.5 rounded-full transition-all ${
                n === i
                  ? 'w-6 bg-[var(--tone)]'
                  : revelados[n]
                    ? 'w-1.5 bg-[var(--tone)] opacity-45'
                    : 'w-1.5 bg-surface-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* La situación */}
      <section className="rounded-card border border-line bg-surface p-5 shadow-card">
        <div className="mb-2.5 flex items-center gap-2">
          <span
            className="h-2 w-2 flex-none rounded-full"
            style={{ background: 'var(--tone)' }}
            aria-hidden="true"
          />
          <span className="text-[12px] font-semibold tracking-wide text-muted">{reto.rol}</span>
        </div>
        <h2 className="font-display text-[19px] font-semibold tracking-tight">{reto.tarea}</h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-muted">{reto.situacion}</p>
      </section>

      {/* El intento */}
      <section className="rounded-card border border-line bg-surface p-5 shadow-card">
        <label
          htmlFor="intento"
          className="block font-display text-[15.5px] font-semibold tracking-tight"
        >
          Escribe el prompt que le mandarías a {plataformaNombre}
        </label>
        <p className="mt-1.5 mb-4 text-[13px] leading-relaxed text-muted">
          Como lo escribirías de verdad, con las prisas de un martes. No se guarda en ninguna parte
          y nadie lo va a leer: se pierde cuando cierres esta página.
        </p>

        <textarea
          id="intento"
          value={intento}
          onChange={(e) => escribir(e.target.value)}
          readOnly={revelado || revisando}
          rows={5}
          placeholder="Escribe aquí…"
          className="w-full resize-y rounded-xl border border-line bg-bg px-3.5 py-3 text-[14px] leading-relaxed text-text outline-none transition-colors placeholder:text-faint focus:border-[var(--tone)] read-only:text-muted"
        />

        {!revelado && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              onClick={revelar}
              disabled={!suficiente || revisando}
              className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {revisando ? 'Revisando…' : 'Ya lo escribí, muéstrame la revisión'}
            </button>
            <span className="text-[12px] text-faint">
              {error
                ? error
                : revisando
                  ? 'Un momento, lo estamos leyendo.'
                  : suficiente
                    ? 'Después de esto ya no se puede editar. Así funciona en la vida real.'
                    : 'Escribe algo primero. La revisión no sirve sobre una caja vacía.'}
            </span>
          </div>
        )}
      </section>

      {/* Todo lo de abajo aparece solo después de intentar */}
      {revelado && (
        <>
          {califico ? (
            /* Lo calificó un modelo: los criterios vienen marcados y comentados */
            <section className="rounded-card border border-line bg-surface p-5 shadow-card">
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
                  Tu prompt, revisado
                </h3>
                <span className="font-mono text-[12px] text-muted">
                  {cumplidos} de {CRITERIOS.length}
                </span>
              </div>
              <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
                {califico.veredicto.resumen}
              </p>

              <ul className="flex flex-col gap-1.5">
                {califico.veredicto.criterios.map((c) => {
                  const criterio = CRITERIOS.find((x) => x.id === c.id);
                  return (
                    <li
                      key={c.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 ${
                        c.cumple ? 'border-line bg-accent-soft' : 'border-line bg-surface-2'
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center rounded-md ${
                          c.cumple ? 'bg-accent' : 'bg-faint'
                        }`}
                        aria-hidden="true"
                      >
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          {c.cumple ? (
                            <path
                              d="M3.5 8.5 6.5 11.5 12.5 5"
                              stroke="white"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          ) : (
                            <path
                              d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
                              stroke="white"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                            />
                          )}
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-semibold text-text">
                          {criterio?.titulo ?? c.id}
                          <span className="sr-only">{c.cumple ? ': cumple' : ': no cumple'}</span>
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                          {c.comentario}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 rounded-xl border border-[var(--tone-line)] bg-[var(--tone-soft)] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="font-display text-[14px] font-semibold tracking-tight">
                    Tu prompt con lo que le faltaba
                  </h4>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="font-mono text-[11px] text-faint">
                      revisado por {califico.proveedor}
                    </span>
                    <Copiar texto={califico.veredicto.mejorado} />
                  </span>
                </div>
                <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-text">
                  {califico.veredicto.mejorado}
                </p>
              </div>
            </section>
          ) : (
            /* Sin cupo o sin llaves: se califica ella misma, y se lleva el paquete */
            <section className="rounded-card border border-line bg-surface p-5 shadow-card">
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
                  Míralo contra estos seis
                </h3>
                <span className="font-mono text-[12px] text-muted">
                  {marcados} de {CRITERIOS.length}
                </span>
              </div>
              <p className="mb-4 max-w-[62ch] text-[13px] leading-relaxed text-muted">
                Marca solo lo que de verdad escribiste, no lo que tenías en la cabeza. Lo que quede
                sin marcar es exactamente lo que la herramienta va a tener que adivinar.
              </p>

              <ul className="flex flex-col gap-1.5">
                {CRITERIOS.map((c) => {
                  const activo = Boolean(marcas[`${i}:${c.id}`]);
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => marcar(c.id)}
                        aria-pressed={activo}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                          activo
                            ? 'border-[var(--tone-line)] bg-[var(--tone-soft)]'
                            : 'border-line bg-bg hover:border-[var(--tone-line)]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center rounded-md border transition-colors ${
                            activo ? 'border-transparent bg-[var(--tone)]' : 'border-line bg-surface'
                          }`}
                          aria-hidden="true"
                        >
                          {activo && (
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M3.5 8.5 6.5 11.5 12.5 5"
                                stroke="white"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-semibold text-text">
                            {c.titulo}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                            {c.pregunta}
                          </span>
                          <span className="mt-1 block text-[12.5px] leading-relaxed text-faint">
                            {c.ejemplo}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {resultado?.via === 'manual' && (
                <div className="mt-5 rounded-xl border border-[var(--tone-line)] bg-[var(--tone-soft)] p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="font-display text-[14px] font-semibold tracking-tight">
                      O que te lo califique {plataformaNombre}
                    </h4>
                    <span className="ml-auto">
                      <Copiar texto={resultado.paquete} etiqueta="Copiar para pegar allá" />
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-muted">
                    Copia esto y pégalo en {plataformaNombre}. Va tu prompt con la rúbrica del
                    módulo, así que te responde con la misma vara con la que calificamos acá. De
                    paso practicas en la herramienta, que es de lo que se trataba.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Los prompts modelo, que es contra lo que se compara el intento */}
          <section className="rounded-card border border-line bg-surface p-5 shadow-card">
            <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
              Así los escribimos nosotros
            </h3>
            <p className="mt-1.5 mb-4 max-w-[62ch] text-[13px] leading-relaxed text-muted">
              Los prompts modelo de {moduloNombre}. No los copies: mira qué traen que a tu intento
              le faltó, y qué tenía el tuyo que estos no.
            </p>

            <ul className="flex flex-col gap-2.5">
              {prompts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-3 rounded-xl border border-line bg-bg p-3.5"
                >
                  <span className="mt-0.5 flex-none rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-medium text-muted">
                    {p.tag}
                  </span>
                  <p className="min-w-0 flex-1 text-[13.5px] leading-relaxed text-text">{p.text}</p>
                  <Copiar texto={p.text} />
                </li>
              ))}
            </ul>
          </section>

          {/* Los tropiezos del módulo */}
          {tropiezos.length > 0 && (
            <section className="rounded-card border border-line bg-surface p-5 shadow-card">
              <h3 className="font-display text-[15.5px] font-semibold tracking-tight">
                Dónde se cae la gente en este módulo
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {tropiezos.map((t) => (
                  <li key={t.id} className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-surface-2 p-3">
                      <span className="mb-1 block font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-faint">
                        En vez de
                      </span>
                      <p className="text-[13px] leading-relaxed text-muted">{t.bad}</p>
                    </div>
                    <div className="rounded-xl bg-accent-soft p-3">
                      <span className="mb-1 block font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-accent">
                        Esto
                      </span>
                      <p className="text-[13px] leading-relaxed text-text">{t.good}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Qué sigue */}
          <div className="flex flex-wrap items-center gap-3">
            {i < retos.length - 1 ? (
              <button
                onClick={() => setI(i + 1)}
                className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Siguiente reto
              </button>
            ) : (
              <span className="text-[13.5px] text-muted">
                Ese era el último de {moduloNombre}. Ahora hazlo con un pendiente de verdad.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Copiar({ texto, etiqueta = 'Copiar' }: { texto: string; etiqueta?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <button
      onClick={copiar}
      className="flex-none rounded-lg border border-line px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
    >
      {copiado ? 'Copiado' : etiqueta}
    </button>
  );
}
