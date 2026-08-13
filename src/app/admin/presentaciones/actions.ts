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

  // Los errores se devuelven por la URL: en producción Next oculta el mensaje
  // de una excepción y el usuario vería una página de error genérica.
  if (!source.trim()) redirect('/admin/presentaciones?error=vacio');

  const parsed = parseDeck(source);

  if (parsed.slides.length === 0) redirect('/admin/presentaciones?error=sin-secciones');

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

/**
 * Registra a quien entra con el PIN. Devuelve null si el PIN no existe.
 * `participantId` llega cuando la persona ya está identificada en el portal,
 * que es lo que permite reconocerla sin volver a preguntarle nada.
 */
export async function joinLive(person: {
  pin: string;
  participantId?: number;
  name: string;
  phone?: string | null;
}) {
  const session = await db.query.liveSessions.findFirst({
    where: eq(liveSessions.pin, person.pin),
  });
  if (!session) return null;

  const phone = person.phone || null;

  if (person.participantId) {
    // Una fila por participante y sesión: reentrar desde otro dispositivo, o
    // tras recargar, no lo duplica en la lista del expositor.
    await db
      .insert(attendees)
      .values({ sessionId: session.id, participantId: person.participantId, name: person.name, phone })
      .onConflictDoUpdate({
        target: [attendees.sessionId, attendees.participantId],
        set: { name: person.name, phone },
      });
  } else {
    // Sin registro en el portal solo queda lo que escribió: el teléfono
    // distingue mejor que el nombre cuando hay dos personas que se llaman igual.
    const alreadyIn = await db.query.attendees.findFirst({
      where: and(
        eq(attendees.sessionId, session.id),
        phone ? eq(attendees.phone, phone) : eq(attendees.name, person.name),
      ),
    });

    if (!alreadyIn) {
      await db.insert(attendees).values({ sessionId: session.id, name: person.name, phone });
    }
  }

  return { sessionId: session.id, deckId: session.deckId, slide: session.slide };
}
