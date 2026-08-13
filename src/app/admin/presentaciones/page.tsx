import Link from 'next/link';
import { Card, PlatformMark, SectionTitle, SiteHeader } from '@/components/ui';
import { getDecks, getPlatformIds } from '@/db/queries';
import { deleteDeck, importDeck } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Presentaciones · Academia IA' };

const inputClass =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[13.5px] text-text outline-none transition-colors placeholder:text-faint focus:border-primary';

type Search = { searchParams: Promise<{ importado?: string; error?: string }> };

export default async function DecksPage({ searchParams }: Search) {
  const [decks, platforms, { importado, error }] = await Promise.all([
    getDecks(),
    getPlatformIds(),
    searchParams,
  ]);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Presentaciones"
        subtitle="Importa el HTML que armaste en Claude Design y proyéctalo desde acá"
        back={{ href: '/admin', label: 'Volver al admin' }}
      >
        <Link
          href="/vivo"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Vista de audiencia
        </Link>
      </SiteHeader>

      <main className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-5 rounded-card bg-[#fdebe2] px-4 py-3 text-[13.5px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
            {error === 'sin-secciones'
              ? 'El HTML no trae láminas: cada una debe ir dentro de una etiqueta <section> de primer nivel.'
              : 'No llegó ningún HTML. Pega el contenido o sube el archivo.'}
          </p>
        )}

        {importado && (
          <p className="mb-5 rounded-card bg-accent-soft px-4 py-3 text-[13.5px] text-accent">
            Presentación importada. Ya puedes proyectarla.
          </p>
        )}

        <section className="mb-10">
          <SectionTitle
            kicker="Importar"
            title="Traer una presentación"
            intro="Pega el HTML del artifact o sube el archivo. Cada lámina debe venir dentro de una etiqueta <section>, y los estilos del diseño se conservan tal cual."
          />

          <Card>
            <form action={importDeck} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12.5px] font-medium text-muted">
                    Título <span className="font-normal text-faint">se toma del HTML si lo dejas vacío</span>
                  </span>
                  <input name="title" className={inputClass} placeholder="Kickoff · Copilot" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[12.5px] font-medium text-muted">
                    Plataforma <span className="font-normal text-faint">opcional</span>
                  </span>
                  <select name="platformId" defaultValue="" className={inputClass}>
                    <option value="">Sin plataforma</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-[12.5px] font-medium text-muted">
                    Nota de la sesión <span className="font-normal text-faint">opcional</span>
                  </span>
                  <input
                    name="meta"
                    className={inputClass}
                    placeholder="Sesión del 18 de agosto · 25 min"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-medium text-muted">Pegar el HTML</span>
                <textarea
                  name="html"
                  rows={8}
                  className={`${inputClass} font-mono text-[12.5px]`}
                  placeholder={'<style>...</style>\n<section>\n  <h2>Primera lámina</h2>\n</section>'}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-medium text-muted">
                  O subir el archivo <span className="font-normal text-faint">.html</span>
                </span>
                <input
                  type="file"
                  name="file"
                  accept=".html,.htm,text/html"
                  className="text-[13px] text-muted file:mr-3 file:rounded-[8px] file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-[12.5px] file:font-medium file:text-text"
                />
              </label>

              <button
                type="submit"
                className="self-start rounded-[10px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Importar presentación
              </button>
            </form>
          </Card>
        </section>

        <section>
          <SectionTitle kicker="Mazos" title={`Presentaciones cargadas (${decks.length})`} />

          {decks.length === 0 ? (
            <p className="rounded-card border border-dashed border-line px-4 py-10 text-center text-[13.5px] text-faint">
              Todavía no hay ninguna presentación importada.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {decks.map((deck) => (
                <div
                  key={deck.id}
                  className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card"
                >
                  {deck.platform ? (
                    <PlatformMark
                      initial={deck.platform.initial}
                      color={deck.platform.color}
                      size={30}
                    />
                  ) : (
                    <span className="grid size-[30px] place-items-center rounded-[10px] bg-surface-2 font-mono text-[11px] text-faint">
                      {deck.slides.length}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-[15px] font-semibold tracking-tight">
                      {deck.title}
                    </h3>
                    <p className="truncate text-[12.5px] text-faint">
                      {deck.slides.length} láminas
                      {deck.meta ? ` · ${deck.meta}` : ''}
                    </p>
                  </div>

                  <Link
                    href={`/presentar/${deck.slug}`}
                    className="rounded-[10px] bg-primary px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Presentar
                  </Link>

                  <form action={deleteDeck}>
                    <input type="hidden" name="id" value={deck.id} />
                    <button
                      type="submit"
                      className="rounded-[10px] border border-line px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-[#c2410c] hover:text-[#c2410c]"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
