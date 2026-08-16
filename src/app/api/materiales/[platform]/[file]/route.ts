import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { materialByFile } from '@/lib/materiales';
import { hasPlatform, requireScopedParticipant } from '@/lib/scope';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * Descarga del material. Los archivos no viven en `public/` a propósito: el
 * portal de cada IA está detrás del código de acceso, y un PDF suelto en
 * public sería una URL adivinable que se salta ese control. Se sirven desde
 * `private/materiales` con el mismo alcance que la ficha de donde se bajan.
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

  const { scope } = await requireScopedParticipant();
  if (!hasPlatform(scope, platform)) return new NextResponse('No encontrado', { status: 404 });

  const full = path.join(process.cwd(), 'private', 'materiales', platform, file);

  let data: Buffer;
  try {
    data = await readFile(full);
  } catch {
    // El material está declarado pero todavía no se ha generado.
    return new NextResponse('Material no disponible', { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': MIME[material.kind],
      'Content-Disposition': `attachment; filename="${material.slug}.${material.kind}"`,
      'Content-Length': String(data.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
}
