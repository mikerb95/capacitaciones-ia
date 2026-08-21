'use client';

import { useState } from 'react';
import { CRITERIOS, type Reto } from '@/lib/entrenador';

type PromptModelo = { id: number; tag: string; text: string };
type Tropiezo = { id: number; bad: string; good: string };

type Props = {
  retos: Reto[];
  prompts: PromptModelo[];
  tropiezos: Tropiezo[];
  moduloNombre: string;
  plataformaNombre: string;
};

/** Lo mínimo para que la revisión signifique algo. Debajo de esto no hay qué mirar. */
const MINIMO = 25;

export function Trainer({
  retos,
  prompts,
  tropiezos,
  moduloNombre,
  plataformaNombre,
}: Props) {
  const [i, setI] = useState(0);
  // Un intento por reto: quien vuelve atrás encuentra lo que había escrito.
  const [intentos, setIntentos] = useState<string[]>(() => retos.map(() => ''));
  const [revelados, setRevelados] = useState<boolean[]>(() => retos.map(() => false));
  // Lo que la persona marcó de su propio prompt, por reto y por criterio.
  const [marcas, setMarcas] = useState<Record<string, boolean>>({});

  const reto = retos[i];
  const intento = intentos[i] ?? '';
  const revelado = revelados[i] ?? false;
  const suficiente = intento.trim().length >= MINIMO;

  function escribir(valor: string) {
    setIntentos((prev) => prev.map((t, n) => (n === i ? valor : t)));
  }

  function revelar() {
    setRevelados((prev) => prev.map((v, n) => (n === i ? true : v)));
  }

  function marcar(criterioId: string) {
    const clave = `${i}:${criterioId}`;
    setMarcas((prev) => ({ ...prev, [clave]: !prev[clave] }));
  }

  const marcados = CRITERIOS.filter((c) => marcas[`${i}:${c.id}`]).length;

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
          readOnly={revelado}
          rows={5}
          placeholder="Escribe aquí…"
          className="w-full resize-y rounded-xl border border-line bg-bg px-3.5 py-3 text-[14px] leading-relaxed text-text outline-none transition-colors placeholder:text-faint focus:border-[var(--tone)] read-only:text-muted"
        />

        {!revelado && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              onClick={revelar}
              disabled={!suficiente}
              className="rounded-lg bg-[var(--tone)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Ya lo escribí, muéstrame la revisión
            </button>
            <span className="text-[12px] text-faint">
              {suficiente
                ? 'Después de esto ya no se puede editar. Así funciona en la vida real.'
                : 'Escribe algo primero. La revisión no sirve sobre una caja vacía.'}
            </span>
          </div>
        )}
      </section>

      {/* Todo lo de abajo aparece solo después de intentar */}
      {revelado && (
        <>
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
          </section>

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
                <li key={p.id} className="flex items-start gap-3 rounded-xl border border-line bg-bg p-3.5">
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

function Copiar({ texto }: { texto: string }) {
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
      {copiado ? 'Copiado' : 'Copiar'}
    </button>
  );
}
