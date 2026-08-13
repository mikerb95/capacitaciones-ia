import { NextResponse } from 'next/server';
import { getLiveByPin } from '@/db/queries';

export const dynamic = 'force-dynamic';

/**
 * Estado de la sesión en vivo. La audiencia lo consulta cada par de segundos.
 * Devuelve solo el índice, no las láminas: esas ya las tiene cargadas.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pin: string }> },
) {
  const { pin } = await params;
  const session = await getLiveByPin(pin);

  if (!session) {
    return NextResponse.json({ live: false }, { headers: { 'Cache-Control': 'no-store' } });
  }

  return NextResponse.json(
    {
      live: session.playing,
      slide: session.slide,
      deckSlug: session.deck.slug,
      updatedAt: session.updatedAt,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
