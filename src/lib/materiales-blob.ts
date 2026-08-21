/**
 * El material a medida vive en Vercel Blob, no en el repositorio.
 *
 * Los genéricos se generan una vez y viajan con el despliegue en
 * `private/materiales/`. Los de cada empresa no: llevan su logo, sus casos y
 * sus límites, se rehacen cuando cambia el brief y no tienen por qué pasar por
 * un despliegue para llegar al portal. El store es privado a propósito: la
 * descarga la sirve la ruta de la API, que es la que sabe si quien pide tiene
 * alcance sobre la plataforma y si la vigencia de la empresa sigue abierta.
 */
import { del, get, list, put } from '@vercel/blob';

/**
 * La ruta dentro del store. Va por `companyId` y no por el slug del brief
 * porque el slug solo existe en `clientes/<slug>.json`, que no se despliega:
 * el servidor conoce la empresa por su id y nada más.
 */
export const materialBlobPath = (companyId: number, platformId: string, file: string) =>
  `empresas/${companyId}/${platformId}/${file}`;

/** Sube un documento ya generado, reemplazando el anterior si lo había. */
export async function putCustomMaterial(
  companyId: number,
  platformId: string,
  file: string,
  body: Buffer,
  contentType: string,
) {
  return put(materialBlobPath(companyId, platformId, file), body, {
    access: 'private',
    // El nombre tiene que ser predecible: la descarga lo arma con los mismos
    // tres datos que tiene a mano, sin consultar un índice aparte.
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
  });
}

/**
 * El documento a medida de una empresa, si está subido. Devuelve `null` en
 * cuanto algo falla, incluida una caída del store: la descarga cae entonces al
 * material genérico y el asistente se lleva algo, que es mejor que un error.
 */
export async function getCustomMaterial(companyId: number, platformId: string, file: string) {
  try {
    const found = await get(materialBlobPath(companyId, platformId, file), {
      access: 'private',
      // Sin caché: recién subido un material corregido, la siguiente descarga
      // ya tiene que ser el bueno.
      useCache: false,
    });

    return found?.statusCode === 200 ? found : null;
  } catch {
    return null;
  }
}

/** Borra el documento a medida de una empresa. Después el portal cae al genérico. */
export async function deleteCustomMaterial(pathname: string) {
  await del(pathname);
}

/**
 * Un archivo tal como está en el store, ya partido en las piezas de su ruta.
 *
 * `companyId` viene en `null` cuando la ruta no tiene la forma que escribe
 * `putCustomMaterial`. No debería pasar, pero el store es un sistema de
 * archivos y no una tabla: si algo entró por fuera, el panel lo tiene que
 * poder mostrar igual para que se pueda borrar.
 */
export type StoredMaterial = {
  pathname: string;
  companyId: number | null;
  platformId: string;
  file: string;
  size: number;
  uploadedAt: Date;
};

function parsePath(pathname: string): Pick<StoredMaterial, 'companyId' | 'platformId' | 'file'> {
  const [raiz, empresa, plataforma, archivo, ...resto] = pathname.split('/');
  const id = Number(empresa);

  if (raiz !== 'empresas' || !Number.isInteger(id) || !plataforma || !archivo || resto.length) {
    return { companyId: null, platformId: '', file: pathname };
  }

  return { companyId: id, platformId: plataforma, file: archivo };
}

/**
 * Lo que hay subido, de una empresa o de todas. Recorre el cursor hasta el
 * final: el panel muestra un inventario y una lista a medias sería peor que
 * ninguna, porque un documento que no aparece se vuelve a subir.
 */
export async function listCustomMaterials(companyId?: number): Promise<StoredMaterial[]> {
  const prefix = companyId === undefined ? 'empresas/' : `empresas/${companyId}/`;
  const found: StoredMaterial[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      found.push({
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        ...parsePath(blob.pathname),
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return found;
}

/**
 * Sin token no hay store al que preguntarle. Se comprueba antes de listar para
 * que el panel explique qué falta en vez de reventar con un error de red.
 */
export const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
