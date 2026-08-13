import { notFound } from 'next/navigation';
import { Presenter } from '@/components/presenter';
import { getActiveSession, getDeck } from '@/db/queries';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const deck = await getDeck(slug);
  return deck ? { title: `${deck.title} · Presentar` } : {};
}

export default async function PresentPage({ params }: Params) {
  const { slug } = await params;
  const deck = await getDeck(slug);
  if (!deck) notFound();

  const session = await getActiveSession(deck.id);

  return <Presenter deck={deck} initialPin={session?.pin ?? null} />;
}
