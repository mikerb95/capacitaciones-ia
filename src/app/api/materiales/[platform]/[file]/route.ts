import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { hasCustomMaterials } from '@/db/queries';
import { materialByFile, type Material } from '@/lib/materiales';
import { getCustomMaterial } from '@/lib/materiales-blob';
import { hasPlatform, requireScopedParticipant } from '@/lib/scope';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const headersFor = (material: Material, length?: number) => ({
  'Content-Type': MIME[material.kind],
  'Content-Disposition': `attachment; filename="${material.slug}.${material.kind}"`,
  ...(length === undefined ? {} : { 'Content-Length': String(length) }),
  'Cache-Control': 'private, no-store',
});

/**
 * Descarga del material. Los archivos no viven en `public/` a propósito: el
 * portal de cada IA está detrás del código de acceso, y un PDF suelto en
 * public sería una URL adivinable que se salta ese control. Se sirven desde
 * `private/materiales` con el mismo alcance que la ficha de donde se bajan.
 *
 * Quien entró con un código de una empresa con material a medida vigente se
 * lleva el suyo, con su logo y sus casos, por esta misma URL. Si esa empresa
 * todavía no tiene subido *ese* documento, baja el genérico: el material a
 * medida se genera de a poco y nadie se queda sin descarga mientras tanto.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ platform: string; file: string }> },
) {
  const { platform, file } = await params;

  // El nombre del archivo se resuelve contra el catálogo, nunca contra el
  // disco: así una ruta con ../ no llega a tocar nada.
  const material = materialByFile(platform, file);
  if (!material) return new NextResponse('No encontrado', { status: 404 });

  const { participant, scope } = await requireScopedParticipant();
  if (!hasPlatform(scope, platform)) return new NextResponse('No encontrado', { status: 404 });

  const companyId = participant.accessCode.companyId;
  if (companyId && (await hasCustomMaterials(companyId))) {
    const custom = await getCustomMaterial(companyId, platform, file);
    if (custom) {
      return new NextResponse(custom.stream, { headers: headersFor(material, custom.blob.size) });
    }
  }

  const full = path.join(process.cwd(), 'private', 'materiales', platform, file);

  let data: Buffer;
  try {
    data = await readFile(full);
  } catch {
    // El material está declarado pero todavía no se ha generado.
    return new NextResponse('Material no disponible', { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), { headers: headersFor(material, data.byteLength) });
}
