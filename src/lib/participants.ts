import { and, eq, ne } from 'drizzle-orm';
import { db } from '@/db';
import { participants } from '@/db/schema';
import { cleanName, nameKeyOf } from './name';

/**
 * Le pone nombre a una sesión que entró sin él. Se usa donde el nombre hace
 * falta de verdad, como la lista de una sesión en vivo, y queda guardado para
 * no volver a preguntarlo.
 *
 * Si en la misma capacitación ya hay otra sesión con ese nombre, el nombre se
 * guarda igual pero la fila conserva su clave de dispositivo: son dos personas
 * que se llaman igual, o la misma desde otro navegador, y ninguna de las dos
 * lecturas justifica fundir avances ni romper la sesión abierta.
 */
export async function rememberName(
  participant: { id: number; accessCodeId: number },
  raw: string,
) {
  const name = cleanName(raw);
  if (name.length < 2) return null;

  const key = nameKeyOf(name);

  const taken = await db.query.participants.findFirst({
    columns: { id: true },
    where: and(
      eq(participants.accessCodeId, participant.accessCodeId),
      eq(participants.nameKey, key),
      ne(participants.id, participant.id),
    ),
  });

  await db
    .update(participants)
    .set({
      name,
      ...(taken ? {} : { nameKey: key }),
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(participants.id, participant.id));

  return name;
}
