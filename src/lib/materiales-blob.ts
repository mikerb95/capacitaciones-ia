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
import { get, put } from '@vercel/blob';

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
