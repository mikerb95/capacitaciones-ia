import Link from 'next/link';
import { AdminPage } from '@/components/admin-page';
import { ProgressBar, SectionTitle } from '@/components/ui';
import { getCompanies } from '@/db/queries';
import { blobConfigured, listCustomMaterials, type StoredMaterial } from '@/lib/materiales-blob';
import { deleteStray } from './actions';
import { FECHA, TOTAL_DOCS, chipVigencia, enCatalogo, peso, vigencia } from './formato';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Materiales · Academia IA' };

/**
 * El reloj se lee fuera del render y una sola vez, para que toda la pantalla
 * juzgue las vigencias contra el mismo instante.
 */
async function leerReloj() {
  return new Date();
}

/** Lo que hay en el store, o el motivo por el que no se pudo saber. */
async function inventario(): Promise<
  { ok: true; files: StoredMaterial[] } | { ok: false; motivo: string }
> {
  if (!blobConfigured()) {
    return {
      ok: false,
      motivo:
        'Falta BLOB_READ_WRITE_TOKEN. En local se trae con `vercel env pull .env.local`; en Vercel, la pone la integración del store.',
    };
  }

  try {
    return { ok: true, files: await listCustomMaterials() };
  } catch {
    return {
      ok: false,
      motivo:
        'El store no respondió. Mientras tanto el portal sigue sirviendo el material genérico, así que nadie se queda sin descarga.',
    };
  }
}

export default async function MaterialesPage() {
  const [companies, store, ahora] = await Promise.all([getCompanies(), inventario(), leerReloj()]);

  if (!store.ok) {
    return (
      <AdminPage title="Materiales" subtitle="Material a medida por empresa" max={1000}>
        <p className="rounded-card bg-[#fdebe2] px-4 py-3 text-[13.5px] leading-relaxed text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
          No se pudo leer el store. {store.motivo}
        </p>
      </AdminPage>
    );
  }

  const { files } = store;
  const porEmpresa = new Map<number, StoredMaterial[]>();
  const sueltos: StoredMaterial[] = [];
  const conocidas = new Set(companies.map((c) => c.id));

  for (const file of files) {
    // Suelto es todo lo que no se puede devolver a una ficha: de una empresa
    // borrada, o de un documento que ya no está en el catálogo.
    if (file.companyId === null || !conocidas.has(file.companyId) || !enCatalogo(file)) {
      sueltos.push(file);
      continue;
    }
    const lista = porEmpresa.get(file.companyId) ?? [];
    lista.push(file);
    porEmpresa.set(file.companyId, lista);
  }

  const filas = companies
    .map((company) => {
      const suyos = porEmpresa.get(company.id) ?? [];
      return {
        company,
        docs: suyos.length,
        bytes: suyos.reduce((n, f) => n + f.size, 0),
        ultima: suyos.reduce<Date | null>(
          (max, f) => (!max || f.uploadedAt > max ? f.uploadedAt : max),
          null,
        ),
        v: vigencia(company.materialsUntil, ahora),
      };
    })
    .sort((a, b) => b.docs - a.docs || a.company.name.localeCompare(b.company.name, 'es'));

  const conMaterial = filas.filter((f) => f.docs > 0);
  const totalBytes = files.reduce((n, f) => n + f.size, 0);

  const cifras = [
    { n: String(files.length), label: files.length === 1 ? 'archivo en el store' : 'archivos en el store' },
    { n: peso(totalBytes), label: 'ocupados' },
    {
      n: String(conMaterial.length),
      label: conMaterial.length === 1 ? 'empresa con material' : 'empresas con material',
    },
    {
      n: String(conMaterial.filter((f) => f.v.vigente).length),
      label: 'con la vigencia abierta',
    },
  ];

  return (
    <AdminPage
      title="Materiales"
      subtitle="Lo que cada empresa se lleva a medida, archivo por archivo"
      max={1060}
    >
      <div className="flex flex-col gap-8">
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
          {cifras.map((c) => (
            <div key={c.label} className="bg-surface px-5 py-4">
              <div className="font-display text-[24px] font-semibold leading-none tracking-tight">
                {c.n}
              </div>
              <div className="mt-1.5 text-[12.5px] text-muted">{c.label}</div>
            </div>
          ))}
        </section>

        <section>
          <SectionTitle
            kicker="Por empresa"
            title="Quién tiene material propio"
            intro={`El catálogo declara ${TOTAL_DOCS} documentos entre las cuatro plataformas. Lo que no esté subido para una empresa se descarga genérico, y lo que sí lo esté solo se sirve mientras su vigencia siga abierta.`}
          />

          {filas.length === 0 ? (
            <p className="rounded-card border border-dashed border-line px-4 py-10 text-center text-[13.5px] text-faint">
              Todavía no hay ninguna empresa cargada.{' '}
              <Link href="/admin/empresas/nueva" className="font-medium text-primary">
                Crea la primera
              </Link>
              .
            </p>
          ) : (
            <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
              {filas.map(({ company, docs, bytes, ultima, v }) => (
                <Link
                  key={company.id}
                  href={`/admin/materiales/${company.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-[18px] py-3.5 transition-colors last:border-0 hover:bg-surface-2"
                >
                  <div className="min-w-[190px] flex-1">
                    <div className="flex items-center gap-2">
                      {docs > 0 && (
                        <span
                          aria-hidden="true"
                          className={`size-[7px] flex-none rounded-full ${
                            v.vigente ? 'bg-accent' : 'bg-[#c2410c] dark:bg-[#f4a06a]'
                          }`}
                        />
                      )}
                      <span className="text-[13.5px] font-semibold">{company.name}</span>
                    </div>
                    <div className="mt-px truncate text-[11.5px] text-faint">
                      {company.industry ?? 'Sin industria'}
                    </div>
                  </div>

                  <span
                    className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-semibold ${chipVigencia[v.estado]}`}
                  >
                    {v.texto}
                  </span>

                  <span className="w-[124px] flex-none text-[12.5px] text-muted">
                    {docs === 0 ? (
                      <span className="text-faint">Todo genérico</span>
                    ) : (
                      `${docs} de ${TOTAL_DOCS} a medida`
                    )}
                  </span>

                  <ProgressBar percent={Math.round((docs / TOTAL_DOCS) * 100)} width={70} />

                  <span className="w-[74px] flex-none text-right font-mono text-[12px] text-faint">
                    {docs === 0 ? '' : peso(bytes)}
                  </span>

                  <span className="w-[104px] flex-none text-right text-[11.5px] text-faint">
                    {ultima ? FECHA.format(ultima) : ''}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {sueltos.length > 0 && (
          <section>
            <SectionTitle
              kicker="Sueltos"
              title={`Archivos sin ficha (${sueltos.length})`}
              intro="Están en el store pero no le corresponden a ninguna empresa del panel ni a ningún documento del catálogo: quedaron de una empresa borrada o de un documento que se dejó de declarar. Nadie los descarga, solo ocupan espacio."
            />

            <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
              {sueltos.map((file) => (
                <div
                  key={file.pathname}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-[18px] py-3 last:border-0"
                >
                  <code className="min-w-[240px] flex-1 truncate font-mono text-[12.5px] text-muted">
                    {file.pathname}
                  </code>
                  <span className="w-[70px] flex-none text-right font-mono text-[12px] text-faint">
                    {peso(file.size)}
                  </span>
                  <span className="w-[104px] flex-none text-right text-[11.5px] text-faint">
                    {FECHA.format(file.uploadedAt)}
                  </span>
                  <form action={deleteStray} className="flex-none">
                    <input type="hidden" name="pathname" value={file.pathname} />
                    <input type="hidden" name="from" value="/admin/materiales" />
                    <button
                      type="submit"
                      className="rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-[#fdebe2] hover:text-[#c2410c] dark:hover:bg-[#3a1e10] dark:hover:text-[#f4a06a]"
                    >
                      Borrar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AdminPage>
  );
}
