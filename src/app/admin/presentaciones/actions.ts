'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { attendees, deckSlides, decks, liveSessions } from '@/db/schema';
import { parseDeck, slugify } from '@/lib/import-deck';

const str = (data: FormData, key: string) => (data.get(key) as string | null)?.trim() ?? '';

/** Importa el HTML de Claude Design y lo parte en láminas. */
export async function importDeck(formData: FormData) {
  const file = formData.get('file') as File | null;
  const pasted = str(formData, 'html');
  const source = file && file.size > 0 ? await file.text() : pasted;

  if (!source.trim()) {
    throw new Error('No llegó ningún HTML: pega el contenido o sube el archivo.');
  }

  const parsed = parseDeck(source);

  if (parsed.slides.length === 0) {
    throw new Error('El HTML no trae láminas. Cada lámina debe ir dentro de una <section>.');
  }

  const title = str(formData, 'title') || parsed.title || 'Presentación sin título';
  const platformId = str(formData, 'platformId');

  // El slug es único: si ya existe uno igual, se le agrega un sufijo.
  const base = slugify(str(formData, 'slug') || title);
  let slug = base;
  for (let n = 2; await db.query.decks.findFirst({ where: eq(decks.slug, slug) }); n += 1) {
    slug = `${base}-${n}`;
  }

  const [deck] = await db
    .insert(decks)
    .values({
      slug,
      title,
      meta: str(formData, 'meta') || `${parsed.slides.length} láminas`,
      platformId: platformId || null,
      styles: parsed.styles || null,
      updatedAt: new Date(),
    })
    .returning({ id: decks.id });

  await db.insert(deckSlides).values(
    parsed.slides.map((slide, i) => ({
      deckId: deck.id,
      title: slide.title,
      html: slide.html,
      notes: slide.notes,
      sortOrder: i,
    })),
  );

  revalidatePath('/admin/presentaciones');
  redirect(`/admin/presentaciones?importado=${slug}`);
}

export async function deleteDeck(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;
  await db.delete(decks).where(eq(decks.id, id));
  revalidatePath('/admin/presentaciones');
  redirect('/admin/presentaciones');
}

/* ------------------------------------------------------------- sesión en vivo */

function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Abre la sesión en vivo de un mazo y devuelve el PIN para proyectarlo. */
export async function startLive(deckId: number, slide = 0) {
  // Solo una sesión viva a la vez por mazo.
  await db.delete(liveSessions).where(eq(liveSessions.deckId, deckId));

  let pin = randomPin();
  while (await db.query.liveSessions.findFirst({ where: eq(liveSessions.pin, pin) })) {
    pin = randomPin();
  }

  const [session] = await db
    .insert(liveSessions)
    .values({ deckId, pin, slide, playing: true, updatedAt: new Date() })
    .returning();

  return session;
}

export async function stopLive(deckId: number) {
  await db.delete(liveSessions).where(eq(liveSessions.deckId, deckId));
}

/** El expositor empuja la lámina actual. La audiencia la lee por polling. */
export async function pushSlide(deckId: number, slide: number) {
  await db
    .update(liveSessions)
    .set({ slide, updatedAt: new Date() })
    .where(eq(liveSessions.deckId, deckId));
}

/** Registra a quien entra con el PIN. Devuelve null si el PIN no existe. */
export async function joinLive(pin: string, name: string, phone: string) {
  const session = await db.query.liveSessions.findFirst({ where: eq(liveSessions.pin, pin) });
  if (!session) return null;

  const alreadyIn = await db.query.attendees.findFirst({
    where: and(eq(attendees.sessionId, session.id), eq(attendees.name, name)),
  });

  if (!alreadyIn) {
    await db.insert(attendees).values({ sessionId: session.id, name, phone: phone || null });
  }

  return { sessionId: session.id, deckId: session.deckId, slide: session.slide };
}
