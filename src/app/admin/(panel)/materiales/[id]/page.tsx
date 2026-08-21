import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { AdminAction, AdminPage } from '@/components/admin-page';
import { PlatformMark } from '@/components/ui';
import { platformLogo } from '@/lib/brand-logos';
import { getCompany, getPlatformIds } from '@/db/queries';
import { MATERIALES, fileName, type Material } from '@/lib/materiales';
import { blobConfigured, listCustomMaterials, type StoredMaterial } from '@/lib/materiales-blob';
import { deleteMaterial, deleteStray, uploadMaterial } from '../actions';
import { FECHA, chipVigencia, enCatalogo, peso, vigencia } from '../formato';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ subido?: string; borrado?: string; error?: string; kind?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const company = await getCompany(Number((await params).id));
  return { title: `${company?.name ?? 'Materiales'} · Materiales · Academia IA` };
}

async function leerReloj() {
  return new Date();
}

/**
 * Qué genéricos hay de verdad en el disco. Importa porque un documento que
 * está declarado pero no generado no se descarga: sin archivo a medida ni
 * genérico, la ruta responde 404 y quien lo intenta no se lleva nada.
 */
async function genericosEnDisco(platformId: string) {
  const dir = path.join(process.cwd(), 'private', 'materiales', platformId);
  return new Set(await readdir(dir).catch(() => []));
}

const AVISO =
  'bg-[#fdebe2] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]';

const ERRORES: Record<string, string> = {
  vacio: 'No llegó ningún archivo. Elige uno antes de subir.',
  peso: 'El archivo pesa más de 25 MB. Eso no es material de capacitación: revisa cuál elegiste.',
  catalogo: 'Ese documento no está en el catálogo de materiales.',
};

export default async function MaterialesEmpresaPage({ params, searchParams }: Props) {
  const id = Number((await params).id);
  if (!id) notFound();

  const [company, platforms, aviso, ahora] = await Promise.all([
    getCompany(id),
    getPlatformIds(),
    searchParams,
    leerReloj(),
  ]);

  if (!company) notFound();

  const configurado = blobConfigured();
  let files: StoredMaterial[] = [];
  let storeCaido = false;

  if (configurado) {
    try {
      files = await listCustomMaterials(id);
    } catch {
      storeCaido = true;
    }
  }

  // Los genéricos se leen por plataforma y en paralelo, no dentro del render.
  const discos = new Map(
    await Promise.all(
      Object.keys(MATERIALES).map(
        async (platformId) => [platformId, await genericosEnDisco(platformId)] as const,
      ),
    ),
  );

  const subidos = new Map(files.filter(enCatalogo).map((f) => [`${f.platformId}/${f.file}`, f]));
  const sueltos = files.filter((f) => !enCatalogo(f));
  const v = vigencia(company.materialsUntil, ahora);

  const platformName = (platformId: string) =>
    platforms.find((p) => p.id === platformId) ?? {
      id: platformId,
      name: platformId,
      initial: platformId.slice(0, 1).toUpperCase(),
      color: '#8892a4',
    };

  const errorTexto =
    aviso.error === 'tipo'
      ? `Ese documento tiene que ser un .${aviso.kind ?? 'pdf'}. Sube el archivo en el formato que declara el catálogo.`
      : aviso.error
        ? (ERRORES[aviso.error] ?? 'No se pudo subir el archivo.')
        : null;

  return (
    <AdminPage
      title={company.name}
      subtitle="Material a medida: lo que sustituye al genérico en las descargas del portal"
      back={{ href: '/admin/materiales', label: 'Materiales' }}
      max={1000}
      actions={<AdminAction href={`/admin/empresas/${company.id}`}>Ficha de la empresa</AdminAction>}
    >
      <div className="flex flex-col gap-7">
        {errorTexto && (
          <p className={`rounded-card px-4 py-3 text-[13.5px] leading-relaxed ${AVISO}`}>
            {errorTexto}
          </p>
        )}

        {aviso.subido && (
          <p className="rounded-card bg-accent-soft px-4 py-3 text-[13.5px] text-accent">
            Subido <code className="font-mono">{aviso.subido}</code>. Desde ya, quien entre con un
            código de esta empresa se lleva este archivo.
          </p>
        )}

        {aviso.borrado && (
          <p className="rounded-card bg-surface-2 px-4 py-3 text-[13.5px] text-muted">
            Borrado <code className="font-mono">{aviso.borrado}</code>. Ese documento vuelve a
            descargarse genérico.
          </p>
        )}

        {!configurado && (
          <p className={`rounded-card px-4 py-3 text-[13.5px] leading-relaxed ${AVISO}`}>
            Falta <code className="font-mono">BLOB_READ_WRITE_TOKEN</code>: sin el token no se puede
            leer ni escribir en el store. En local se trae con{' '}
            <code className="font-mono">vercel env pull .env.local</code>.
          </p>
        )}

        {storeCaido && (
          <p className={`rounded-card px-4 py-3 text-[13.5px] leading-relaxed ${AVISO}`}>
            El store no respondió, así que esta pantalla no sabe qué hay subido. El portal sigue
            sirviendo el material genérico mientras tanto.
          </p>
        )}

        {/* ------------------------------------------------------ vigencia */}
        <section className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-surface px-5 py-4 shadow-card">
          <div className="min-w-[240px] flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-[7px] rounded-full ${
                  v.vigente ? 'bg-accent' : 'bg-[#c2410c] dark:bg-[#f4a06a]'
                }`}
              />
              <span className="text-[12px] font-semibold text-muted">Vigencia del material</span>
            </div>
            <p className="max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
              {v.vigente
                ? 'Está abierta: cada documento que subas aquí sustituye al genérico en la descarga.'
                : v.estado === 'vencida'
                  ? 'Venció. Aunque haya archivos subidos, el portal está sirviendo el genérico a todo el mundo.'
                  : 'La empresa no tiene fecha de vigencia, así que el portal sirve el genérico aunque subas archivos.'}
            </p>
          </div>

          <span
            className={`flex-none rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${chipVigencia[v.estado]}`}
          >
            {v.texto}
          </span>

          {!v.vigente && (
            <AdminAction href={`/admin/empresas/${company.id}`}>Poner la fecha</AdminAction>
          )}
        </section>

        {/* ---------------------------------------------------- documentos */}
        {Object.entries(MATERIALES).map(([platformId, docs]) => {
          const p = platformName(platformId);
          const disco = discos.get(platformId) ?? new Set<string>();
          const propios = docs.filter((d) => subidos.has(`${platformId}/${fileName(d)}`)).length;

          return (
            <section key={platformId}>
              <div className="mb-3 flex items-center gap-2.5">
                <PlatformMark
                  initial={p.initial}
                  color={p.color}
                  size={26}
                  logo={platformLogo(platformId)}
                />
                <h2 className="font-display text-[16px] font-semibold tracking-tight">{p.name}</h2>
                <span className="text-[12px] text-faint">
                  {propios === 0
                    ? `todo genérico, ${docs.length} ${docs.length === 1 ? 'documento' : 'documentos'}`
                    : `${propios} de ${docs.length} a medida`}
                </span>
              </div>

              <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
                {docs.map((doc) => (
                  <DocRow
                    key={doc.slug}
                    companyId={company.id}
                    platformId={platformId}
                    doc={doc}
                    subido={subidos.get(`${platformId}/${fileName(doc)}`)}
                    hayGenerico={disco.has(fileName(doc))}
                    puedeEscribir={configurado && !storeCaido}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* ------------------------------------------------------- sueltos */}
        {sueltos.length > 0 && (
          <section>
            <h2 className="mb-1.5 font-display text-[16px] font-semibold tracking-tight">
              Archivos sin documento ({sueltos.length})
            </h2>
            <p className="mb-3 max-w-[70ch] text-[13.5px] leading-relaxed text-muted">
              Están en la carpeta de esta empresa pero no corresponden a ningún documento del
              catálogo. Nadie los descarga: quedaron de un documento que se dejó de declarar.
            </p>

            <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
              {sueltos.map((file) => (
                <div
                  key={file.pathname}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-[18px] py-3 last:border-0"
                >
                  <code className="min-w-[220px] flex-1 truncate font-mono text-[12.5px] text-muted">
                    {file.pathname}
                  </code>
                  <span className="w-[70px] flex-none text-right font-mono text-[12px] text-faint">
                    {peso(file.size)}
                  </span>
                  <form action={deleteStray} className="flex-none">
                    <input type="hidden" name="pathname" value={file.pathname} />
                    <input type="hidden" name="from" value={`/admin/materiales/${company.id}`} />
                    <button
                      type="submit"
                      className={`rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:${AVISO}`}
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

/* --------------------------------------------------------------- una fila */

function DocRow({
  companyId,
  platformId,
  doc,
  subido,
  hayGenerico,
  puedeEscribir,
}: {
  companyId: number;
  platformId: string;
  doc: Material;
  subido?: StoredMaterial;
  hayGenerico: boolean;
  puedeEscribir: boolean;
}) {
  const file = fileName(doc);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-[18px] py-3.5 last:border-0">
      <div className="min-w-[210px] flex-1">
        <div className="flex items-center gap-2">
          {subido && <span aria-hidden="true" className="size-[7px] flex-none rounded-full bg-accent" />}
          <span className="text-[13.5px] font-medium">{doc.title}</span>
          <span className="rounded-full bg-surface-2 px-1.5 py-px font-mono text-[10.5px] uppercase text-faint">
            {doc.kind}
          </span>
        </div>
        <div className="mt-px truncate font-mono text-[11.5px] text-faint">{file}</div>
      </div>

      <div className="w-[168px] flex-none">
        {subido ? (
          <>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
              A medida
            </span>
            <div className="mt-1 text-[11.5px] text-faint">
              {peso(subido.size)} · {FECHA.format(subido.uploadedAt)}
            </div>
          </>
        ) : hayGenerico ? (
          <>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-faint">
              Genérico
            </span>
            <div className="mt-1 text-[11.5px] text-faint">El que viaja con el despliegue</div>
          </>
        ) : (
          <>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${AVISO}`}>
              Sin archivo
            </span>
            <div className="mt-1 text-[11.5px] text-faint">La descarga responde 404</div>
          </>
        )}
      </div>

      <form
        action={uploadMaterial}
        className="flex flex-none flex-wrap items-center gap-2"
        encType="multipart/form-data"
      >
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="platformId" value={platformId} />
        <input type="hidden" name="slug" value={doc.slug} />
        <input
          type="file"
          name="file"
          accept={`.${doc.kind}`}
          required
          disabled={!puedeEscribir}
          aria-label={`Archivo para ${doc.title}`}
          className="w-[188px] text-[12px] text-muted file:mr-2 file:rounded-[8px] file:border-0 file:bg-surface-2 file:px-2.5 file:py-1.5 file:text-[12px] file:font-medium file:text-text"
        />
        <button
          type="submit"
          disabled={!puedeEscribir}
          className="rounded-[10px] bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {subido ? 'Reemplazar' : 'Subir'}
        </button>
      </form>

      {subido && (
        <form action={deleteMaterial} className="flex-none">
          <input type="hidden" name="companyId" value={companyId} />
          <input type="hidden" name="platformId" value={platformId} />
          <input type="hidden" name="file" value={file} />
          <button
            type="submit"
            className="rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-[#fdebe2] hover:text-[#c2410c] dark:hover:bg-[#3a1e10] dark:hover:text-[#f4a06a]"
          >
            Quitar
          </button>
        </form>
      )}
    </div>
  );
}
