import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../index';
import { accessCodes, participants } from '../schema';
import { DEMO_ACCESS } from '../../lib/demo-access';

/**
 * Deja listo el código de demo pública y su participante. Es idempotente: se
 * puede correr las veces que haga falta, en local o contra Turso.
 */
export async function seedDemoAccess() {
  const existing = await db.query.accessCodes.findFirst({
    where: eq(accessCodes.code, DEMO_ACCESS.code),
  });

  const code =
    existing ??
    (
      await db
        .insert(accessCodes)
        .values({
          code: DEMO_ACCESS.code,
          label: DEMO_ACCESS.label,
          active: true,
          system: true,
          updatedAt: new Date(),
        })
        .returning()
    )[0];

  // Si ya existía de antes, se asegura que quede marcado y activo.
  if (existing && (!existing.system || !existing.active)) {
    await db
      .update(accessCodes)
      .set({ system: true, active: true, updatedAt: new Date() })
      .where(eq(accessCodes.id, code.id));
  }

  const person = await db.query.participants.findFirst({
    where: and(
      eq(participants.accessCodeId, code.id),
      eq(participants.nameKey, nameKeyOf(DEMO_ACCESS.name)),
    ),
  });

  if (!person) {
    await db.insert(participants).values({
      accessCodeId: code.id,
      name: DEMO_ACCESS.name,
      nameKey: nameKeyOf(DEMO_ACCESS.name),
      token: randomUUID(),
      updatedAt: new Date(),
    });
  }

  return code;
}

// Permite correrlo solo: `npm run db:seed:demo`.
if (process.argv[1]?.endsWith('demo.ts')) {
  seedDemoAccess()
    .then((code) => {
      console.log(`Código demo ${code.code} listo.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
