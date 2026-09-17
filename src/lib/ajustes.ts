import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { settings } from '@/db/schema';

export const CERTIFICADOS = 'certificados';

/**
 * Si la ruta guiada ofrece certificado. Apagado mientras no haya fila: emitir
 * un certificado es un compromiso, así que se enciende a propósito desde el
 * panel y no por omisión.
 */
export async function certificadosHabilitados() {
  const row = await db.query.settings.findFirst({ where: eq(settings.key, CERTIFICADOS) });
  return row?.value === 'si';
}

export async function guardarAjuste(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}
