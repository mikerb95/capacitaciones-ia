'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Respuesta, Resultado } from '@/lib/buscador';
import { normalizar, terminos } from '@/lib/normalizar';
import { EVENTO_ANCLA } from './ancla';

type Plataforma = { id: string; name: string };

const ESPERA_MS = 140;
const VACIA: Respuesta = { grupos: [], total: 0 };

/**
 * Buscador del header con resultados en vivo, al estilo del de Jira: se abre un
 * panel debajo con lo encontrado agrupado por tipo, y se recorre con flechas.
 *
 * Con `plataforma` busca dentro de ese portal, y ofrece ampliar a todas; sin
 * ella busca en todo lo que abre el código de la persona.
 */
export function Buscador({ plataforma }: { plataforma?: Plataforma }) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const caja = useRef<HTMLDivElement>(null);

  const [consulta, setConsulta] = useState('');
  const [enTodas, setEnTodas] = useState(!plataforma);
  const [respuesta, setRespuesta] = useState<Respuesta>(VACIA);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);

  const alcance = enTodas ? undefined : plataforma?.id;
  const texto = consulta.trim();
  const buscable = terminos(texto).length > 0;

  // Consulta con una pausa corta entre teclas; la anterior se cancela.
  useEffect(() => {
    if (!buscable) return;

    const control = new AbortController();
    const t = window.setTimeout(async () => {
      setCargando(true);
      try {
        const params = new URLSearchParams({ q: texto });
        if (alcance) params.set('p', alcance);
        const res = await fetch(`/api/buscar?${params}`, { signal: control.signal });
        if (!res.ok) throw new Error(String(res.status));
        setRespuesta(await res.json());
        setError(false);
        setActivo(0);
      } catch (e) {
        if (control.signal.aborted) return;
        console.error('[buscador]', e);
        setError(true);
      } finally {
        if (!control.signal.aborted) setCargando(false);
      }
    }, ESPERA_MS);

    return () => {
      control.abort();
      window.clearTimeout(t);
    };
  }, [texto, alcance, buscable]);

  // "/" y Ctrl/Cmd+K llevan al buscador desde cualquier parte de la página.
  useEffect(() => {
    function atajo(e: KeyboardEvent) {
      const destino = e.target as HTMLElement | null;
      const escribiendo =
        destino?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(destino?.tagName ?? '');
      const k = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey);
      if (k || (e.key === '/' && !escribiendo)) {
        e.preventDefault();
        input.current?.focus();
        input.current?.select();
        setAbierto(true);
      }
    }
    window.addEventListener('keydown', atajo);
    return () => window.removeEventListener('keydown', atajo);
  }, []);

  // Un clic fuera cierra el panel.
  useEffect(() => {
    if (!abierto) return;
    function fuera(e: PointerEvent) {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [abierto]);

  const vigente = buscable ? respuesta : VACIA;
  const planos = useMemo(() => vigente.grupos.flatMap((g) => g.resultados), [vigente]);
  const palabras = useMemo(() => terminos(texto), [texto]);

  function ir(r: Resultado) {
    setAbierto(false);
    input.current?.blur();

    if (r.externo) {
      window.open(r.href, '_blank', 'noopener,noreferrer');
      return;
    }

    const destino = new URL(r.href, window.location.href);
    const mismaPagina =
      destino.pathname === window.location.pathname && destino.search === window.location.search;
    router.push(r.href);
    // En la misma página no hay montaje nuevo: se avisa para abrir el ancla.
    if (mismaPagina && destino.hash) {
      window.setTimeout(() => window.dispatchEvent(new Event(EVENTO_ANCLA)), 80);
    }
  }

  function teclas(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      if (abierto && consulta) setAbierto(false);
      else {
        setConsulta('');
        input.current?.blur();
      }
      return;
    }
    if (!planos.length) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setAbierto(true);
      const paso = e.key === 'ArrowDown' ? 1 : -1;
      const siguiente = (activo + paso + planos.length) % planos.length;
      setActivo(siguiente);
      document.getElementById(`${id}-r${siguiente}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && abierto) {
      e.preventDefault();
      const r = planos[activo];
      if (r) ir(r);
    }
  }

  const listaId = `${id}-lista`;
  const mostrarPanel = abierto;
  let indice = -1;

  return (
    <div ref={caja} className="relative w-full sm:w-[300px] lg:w-[380px]">
      <div className="group flex h-9 items-center gap-2 rounded-[10px] border border-line bg-surface px-3 transition-colors focus-within:border-[var(--tone,var(--primary))] hover:border-[color-mix(in_srgb,var(--tone,var(--primary))_45%,var(--border))]">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none text-faint">
          <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.6" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          type="search"
          role="combobox"
          aria-expanded={mostrarPanel}
          aria-controls={listaId}
          aria-autocomplete="list"
          aria-activedescendant={mostrarPanel && planos.length ? `${id}-r${activo}` : undefined}
          aria-label={plataforma && !enTodas ? `Buscar en ${plataforma.name}` : 'Buscar en el aula'}
          placeholder={plataforma && !enTodas ? `Buscar en ${plataforma.name}` : 'Buscar módulos, prompts, lecciones…'}
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={teclas}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-text outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
        />
        {cargando ? (
          <span
            aria-hidden="true"
            className="size-3.5 flex-none animate-spin rounded-full border-[1.5px] border-line border-t-[var(--tone,var(--primary))]"
          />
        ) : consulta ? (
          <button
            type="button"
            onClick={() => {
              setConsulta('');
              input.current?.focus();
            }}
            aria-label="Borrar búsqueda"
            className="grid size-5 flex-none place-items-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-text"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 2l6 6M8 2 2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        ) : (
          <kbd className="hidden flex-none rounded-md border border-line px-1.5 font-mono text-[11px] leading-[18px] text-faint sm:block">
            /
          </kbd>
        )}
      </div>

      {mostrarPanel && (
        <div className="absolute right-0 top-full z-30 mt-2 flex max-h-[min(70vh,560px)] w-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-lift sm:w-[min(560px,calc(100vw-2rem))]">
          <div id={listaId} role="listbox" aria-label="Resultados" className="min-h-0 flex-1 overflow-y-auto py-1.5">
            {!buscable ? (
              <Sugerencia plataforma={plataforma && !enTodas ? plataforma.name : null} />
            ) : error ? (
              <Aviso>No se pudo buscar. Revisa tu conexión y vuelve a escribir.</Aviso>
            ) : vigente.total === 0 ? (
              !cargando && (
                <Aviso>
                  Nada coincide con «{texto}»
                  {plataforma && !enTodas ? ` en ${plataforma.name}` : ''}. Prueba con otra palabra
                  {plataforma && !enTodas ? ' o busca en todas las plataformas' : ''}.
                </Aviso>
              )
            ) : (
              vigente.grupos.map((g) => (
                <div key={g.key} role="group" aria-labelledby={`${id}-${g.key}`} className="pb-1">
                  <div
                    id={`${id}-${g.key}`}
                    className="flex items-baseline justify-between px-4 pb-1 pt-2.5 text-[12px] font-semibold text-muted"
                  >
                    {g.titulo}
                    {g.total > g.resultados.length && (
                      <span className="font-normal text-faint">
                        {g.resultados.length} de {g.total}
                      </span>
                    )}
                  </div>
                  {g.resultados.map((r) => {
                    indice += 1;
                    const i = indice;
                    return (
                      <Fila
                        key={`${r.href}-${r.titulo}`}
                        id={`${id}-r${i}`}
                        r={r}
                        activo={i === activo}
                        palabras={palabras}
                        mostrarPlataforma={enTodas}
                        onHover={() => setActivo(i)}
                        onElegir={() => ir(r)}
                      />
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line bg-surface-2 px-4 py-2 text-[11.5px] text-faint">
            {plataforma ? (
              <label className="flex cursor-pointer items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={enTodas}
                  onChange={(e) => {
                    setEnTodas(e.target.checked);
                    input.current?.focus();
                  }}
                  className="size-3.5 accent-[var(--tone,var(--primary))]"
                />
                Buscar en todas las plataformas
              </label>
            ) : (
              <span>{buscable && vigente.total > 0 ? `${vigente.total} resultados` : 'Todo el aula'}</span>
            )}
            <span className="hidden items-center gap-3 sm:flex">
              <span><Tecla>↑</Tecla> <Tecla>↓</Tecla> moverse</span>
              <span><Tecla>Enter</Tecla> abrir</span>
              <span><Tecla>Esc</Tecla> cerrar</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Fila({
  id,
  r,
  activo,
  palabras,
  mostrarPlataforma,
  onHover,
  onElegir,
}: {
  id: string;
  r: Resultado;
  activo: boolean;
  palabras: string[];
  mostrarPlataforma: boolean;
  onHover: () => void;
  onElegir: () => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={activo}
      onPointerMove={onHover}
      // El mousedown se adelanta al blur del input, que cerraría el panel antes del clic.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onElegir}
      className="mx-1.5 flex cursor-pointer gap-3 rounded-[10px] px-2.5 py-2 aria-selected:bg-[color-mix(in_srgb,var(--c)_11%,transparent)]"
      style={{ ['--c' as string]: r.plataforma.color }}
    >
      <span className="mt-[7px] size-2 flex-none rounded-full" style={{ background: r.plataforma.color }} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[13.5px] font-semibold text-text">
            <Resaltado texto={r.titulo} palabras={palabras} />
          </span>
          {r.externo && <span className="flex-none text-[12px] text-faint" aria-label="(abre en otra pestaña)">↗</span>}
        </div>
        <p className="truncate text-[12px] text-faint">
          {mostrarPlataforma ? `${r.plataforma.name}, ` : ''}
          {r.contexto}
        </p>
        {r.fragmento && (
          <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-muted">
            <Resaltado texto={r.fragmento} palabras={palabras} />
          </p>
        )}
      </div>
      {activo && (
        <span className="hidden flex-none self-center text-[11px] text-faint sm:block" aria-hidden="true">
          Enter
        </span>
      )}
    </div>
  );
}

/** Marca las palabras buscadas, sin importar tildes ni mayúsculas. */
function Resaltado({ texto, palabras }: { texto: string; palabras: string[] }) {
  if (!palabras.length) return texto;

  const plano = normalizar(texto);
  const marcas = new Array<boolean>(texto.length).fill(false);
  for (const p of palabras) {
    let i = plano.indexOf(p);
    while (i >= 0) {
      marcas.fill(true, i, i + p.length);
      i = plano.indexOf(p, i + p.length);
    }
  }

  const partes: React.ReactNode[] = [];
  let desde = 0;
  for (let i = 1; i <= texto.length; i++) {
    if (i === texto.length || marcas[i] !== marcas[desde]) {
      const trozo = texto.slice(desde, i);
      partes.push(
        marcas[desde] ? (
          <mark key={desde} className="rounded-[3px] bg-[color-mix(in_srgb,var(--c,var(--primary))_22%,transparent)] text-inherit">
            {trozo}
          </mark>
        ) : (
          trozo
        ),
      );
      desde = i;
    }
  }
  return partes;
}

function Sugerencia({ plataforma }: { plataforma: string | null }) {
  return (
    <div className="px-4 py-3 text-[13px] leading-relaxed text-muted">
      <p>
        Escribe una función, una duda o un tema{plataforma ? ` de ${plataforma}` : ''}. Se buscan
        módulos, prompts, lecciones de la ruta, preguntas frecuentes, planes y material.
      </p>
      <p className="mt-2 text-faint">
        Por ejemplo: <span className="text-text">resumen de reunión</span>,{' '}
        <span className="text-text">contrato</span> o <span className="text-text">plan empresa</span>.
      </p>
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-4 text-[13px] leading-relaxed text-muted">{children}</p>;
}

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-surface px-1 font-mono text-[10.5px] text-muted">
      {children}
    </kbd>
  );
}
