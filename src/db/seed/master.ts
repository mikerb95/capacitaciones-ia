import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../index';
import { accessCodes, participants } from '../schema';
import { MASTER_ACCESS } from '../../lib/master-access';

/**
 * Deja listo el código maestro de pruebas y su participante. Es idempotente:
 * se puede correr las veces que haga falta, en local o contra Turso.
 */
export async function seedMasterAccess() {
  const existing = await db.query.accessCodes.findFirst({
    where: eq(accessCodes.code, MASTER_ACCESS.code),
  });

  const code =
    existing ??
    (
      await db
        .insert(accessCodes)
        .values({
          code: MASTER_ACCESS.code,
          label: MASTER_ACCESS.label,
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
      eq(participants.nameKey, nameKeyOf(MASTER_ACCESS.name)),
    ),
  });

  if (!person) {
    await db.insert(participants).values({
      accessCodeId: code.id,
      name: MASTER_ACCESS.name,
      nameKey: nameKeyOf(MASTER_ACCESS.name),
      token: randomUUID(),
      updatedAt: new Date(),
    });
  }

  return code;
}

// Permite correrlo solo: `npm run db:seed:master`.
if (process.argv[1]?.endsWith('master.ts')) {
  seedMasterAccess()
    .then((code) => {
      console.log(`Código maestro ${code.code} listo (${MASTER_ACCESS.name}).`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
