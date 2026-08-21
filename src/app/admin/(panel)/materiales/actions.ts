'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { findMaterial, fileName, type MaterialKind } from '@/lib/materiales';
import {
  deleteCustomMaterial,
  materialBlobPath,
  putCustomMaterial,
} from '@/lib/materiales-blob';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

const MIME: Record<MaterialKind, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * Tope de un documento del portal. Una guía de prompts con logo no pasa de un
 * par de megas; el límite está alto a propósito, para que corte solo cuando lo
 * que se subió claramente no es material de capacitación.
 */
const MAX = 25 * 1024 * 1024;

/**
 * Los errores viajan por la URL y no como excepción: en producción Next oculta
 * el mensaje y quien sube vería una página de error genérica sin saber si el
 * problema fue el peso, el formato o el archivo vacío.
 */
function volver(companyId: number, query: string): never {
  revalidatePath('/admin/materiales');
  revalidatePath(`/admin/materiales/${companyId}`);
  redirect(`/admin/materiales/${companyId}?${query}`);
}

/**
 * Sube o reemplaza el documento a medida de una empresa.
 *
 * El destino no se toma del formulario: se arma con `materialBlobPath` a
 * partir del catálogo, igual que hace `npm run materiales:subir`. Así el panel
 * y la consola escriben en el mismo sitio, y un nombre de archivo manipulado
 * no puede aterrizar en la carpeta de otra empresa.
 */
export async function uploadMaterial(formData: FormData) {
  const companyId = Number(str(formData, 'companyId'));
  const platformId = str(formData, 'platformId');
  const slug = str(formData, 'slug');
  if (!companyId) redirect('/admin/materiales');

  const material = findMaterial(platformId, slug);
  if (!material) volver(companyId, 'error=catalogo');

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) volver(companyId, 'error=vacio');

  // El tipo se decide por la extensión y no por el `Content-Type` del
  // navegador: un DOCX llega muchas veces como `application/octet-stream`.
  if (!file.name.toLowerCase().endsWith(`.${material.kind}`)) {
    volver(companyId, `error=tipo&kind=${material.kind}`);
  }

  if (file.size > MAX) volver(companyId, 'error=peso');

  const destino = fileName(material);
  await putCustomMaterial(
    companyId,
    platformId,
    destino,
    Buffer.from(await file.arrayBuffer()),
    MIME[material.kind],
  );

  volver(companyId, `subido=${platformId}/${destino}`);
}

/** Quita el documento a medida. La descarga vuelve a servir el genérico. */
export async function deleteMaterial(formData: FormData) {
  const companyId = Number(str(formData, 'companyId'));
  const platformId = str(formData, 'platformId');
  const file = str(formData, 'file');
  if (!companyId || !platformId || !file) redirect('/admin/materiales');

  await deleteCustomMaterial(materialBlobPath(companyId, platformId, file));
  volver(companyId, `borrado=${platformId}/${file}`);
}

/**
 * Borra un archivo suelto: uno que está en el store pero ya no le corresponde
 * a ninguna empresa del panel ni a ningún documento del catálogo. Como no se
 * puede reconstruir su ruta desde el catálogo, aquí sí llega entera del
 * formulario, y por eso se comprueba que empiece por el prefijo de siempre.
 */
export async function deleteStray(formData: FormData) {
  const pathname = str(formData, 'pathname');
  const volverA = str(formData, 'from') || '/admin/materiales';

  if (pathname.startsWith('empresas/') && !pathname.includes('..')) {
    await deleteCustomMaterial(pathname);
  }

  revalidatePath('/admin/materiales');
  revalidatePath(volverA);
  redirect(volverA);
}
