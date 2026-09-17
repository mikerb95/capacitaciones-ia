import { randomUUID } from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodes, accounts, participants, type EmailToken } from '@/db/schema';
import { getParticipant, setSessionCookie } from '@/lib/session';
import { dummyHash, hashPassword, needsRehash, verifyPassword } from './passwords';

/**
 * Cuentas del Aula Virtual. La sesión sigue siendo la de siempre: la cookie
 * lleva el token de una fila de `participants`. Lo que cambia con la cuenta es
 * que esa fila tiene dueño, y cualquier dispositivo donde la persona entre
 * recibe la misma fila y por lo tanto el mismo avance.
 */

// Holgado para quien duda de su contraseña, inútil para un diccionario.
const MAX_FAILED_LOGINS = 10;
const LOCK_MIN = 15;

export const accountNameKey = (accountId: number) => `cuenta:${accountId}`;

export function findAccountByEmail(email: string) {
  return db.query.accounts.findFirst({ where: eq(accounts.email, email) });
}

export type LoginResult =
  | { ok: true; account: { id: number; name: string } }
  | { ok: false; reason: 'invalid' }
  | { ok: false; reason: 'locked'; minutes: number };

/**
 * Correo y contraseña. Hacia afuera, "no existe" y "contraseña equivocada" son
 * el mismo error, y cuestan el mismo tiempo.
 */
export async function attemptPasswordLogin(email: string, password: string): Promise<LoginResult> {
  const now = new Date();
  const account = await findAccountByEmail(email);

  if (!account) {
    await verifyPassword(password, await dummyHash());
    return { ok: false, reason: 'invalid' };
  }

  if (account.lockedUntil && account.lockedUntil > now) {
    return {
      ok: false,
      reason: 'locked',
      minutes: Math.ceil((account.lockedUntil.getTime() - now.getTime()) / 60_000),
    };
  }

  // Sin contraseña guardada (entra solo con enlace) también cuenta como fallo,
  // con el mismo costo, para no delatar cómo entra cada cuenta.
  const valid = await verifyPassword(password, account.passwordHash ?? (await dummyHash()));
  if (!valid || !account.passwordHash) {
    const failed = account.failedLogins + 1;
    const locked = failed >= MAX_FAILED_LOGINS;
    await db
      .update(accounts)
      .set({
        failedLogins: locked ? 0 : failed,
        lockedUntil: locked ? new Date(now.getTime() + LOCK_MIN * 60_000) : account.lockedUntil,
      })
      .where(eq(accounts.id, account.id));
    return locked ? { ok: false, reason: 'locked', minutes: LOCK_MIN } : { ok: false, reason: 'invalid' };
  }

  await db
    .update(accounts)
    .set({
      failedLogins: 0,
      lockedUntil: null,
      lastLoginAt: now,
      ...(needsRehash(account.passwordHash) ? { passwordHash: await hashPassword(password) } : {}),
    })
    .where(eq(accounts.id, account.id));

  return { ok: true, account: { id: account.id, name: account.name } };
}

/**
 * Aplica un enlace de ingreso ya gastado: crea la cuenta si es la primera vez,
 * o actualiza nombre y contraseña si el registro los traía. Quien llega hasta
 * acá abrió el correo, así que es el dueño de la dirección.
 */
export async function accountFromToken(token: EmailToken) {
  const now = new Date();
  const fallbackName = token.email.split('@')[0];

  const [account] = await db
    .insert(accounts)
    .values({
      email: token.email,
      name: token.name ?? fallbackName,
      passwordHash: token.passwordHash,
      lastLoginAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: accounts.email,
      set: {
        name: token.name ?? sql`${accounts.name}`,
        passwordHash: token.passwordHash ?? sql`${accounts.passwordHash}`,
        // Abrir el correo prueba que es el dueño: se levanta el bloqueo.
        failedLogins: 0,
        lockedUntil: null,
        lastLoginAt: now,
        updatedAt: now,
      },
    })
    .returning({ id: accounts.id, name: accounts.name });

  if (token.name) {
    await db
      .update(participants)
      .set({ name: account.name, updatedAt: now })
      .where(eq(participants.accountId, account.id));
  }

  return account;
}

/** Contraseña nueva. Cierra la sesión en todos los dispositivos de la cuenta. */
export async function resetPassword(accountId: number, password: string) {
  await db
    .update(accounts)
    .set({
      passwordHash: await hashPassword(password),
      failedLogins: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(accounts.id, accountId));

  await db
    .update(participants)
    .set({ token: sql`lower(hex(randomblob(16)))`, updatedAt: new Date() })
    .where(eq(participants.accountId, accountId));
}

async function activeCode(accessCodeId: number | null | undefined) {
  if (!accessCodeId) return null;
  const code = await db.query.accessCodes.findFirst({
    columns: { id: true },
    where: and(eq(accessCodes.id, accessCodeId), eq(accessCodes.active, true)),
  });
  return code?.id ?? null;
}

/** La capacitación activa donde la cuenta anduvo más recientemente. */
async function latestCode(accountId: number) {
  const [row] = await db
    .select({ id: participants.accessCodeId })
    .from(participants)
    .innerJoin(accessCodes, eq(accessCodes.id, participants.accessCodeId))
    .where(and(eq(participants.accountId, accountId), eq(accessCodes.active, true)))
    .orderBy(desc(participants.lastSeenAt))
    .limit(1);
  return row?.id ?? null;
}

/**
 * Pasa el avance de una sesión anónima a la de la cuenta y borra la anónima.
 * Si las dos tocaron la misma lección, queda lo mejor de cada una: completada
 * si alguna la completó, el puntaje más alto y la suma de intentos.
 */
async function mergeInto(fromId: number, toId: number) {
  await db.batch([
    db.run(sql`
      insert into course_progress
        (participant_id, course_id, lesson_slug, completed, score, attempts, result, completed_at, created_at, updated_at)
      select ${toId}, course_id, lesson_slug, completed, score, attempts, result, completed_at, created_at, updated_at
      from course_progress where participant_id = ${fromId}
      on conflict (participant_id, course_id, lesson_slug) do update set
        completed = max(completed, excluded.completed),
        score = case when excluded.score is null then score else max(coalesce(score, 0), excluded.score) end,
        attempts = attempts + excluded.attempts,
        result = coalesce(result, excluded.result),
        completed_at = coalesce(min(completed_at, excluded.completed_at), completed_at, excluded.completed_at),
        updated_at = max(updated_at, excluded.updated_at)
    `),
    db.run(sql`
      insert into module_views (participant_id, module_id, views, first_seen_at, last_seen_at)
      select ${toId}, module_id, views, first_seen_at, last_seen_at
      from module_views where participant_id = ${fromId}
      on conflict (participant_id, module_id) do update set
        views = views + excluded.views,
        first_seen_at = min(first_seen_at, excluded.first_seen_at),
        last_seen_at = max(last_seen_at, excluded.last_seen_at)
    `),
    // Un voto repetido se descarta: el borrado de abajo se lo lleva en cascada.
    db.run(sql`update or ignore question_votes set participant_id = ${toId} where participant_id = ${fromId}`),
    db.run(sql`update questions set participant_id = ${toId} where participant_id = ${fromId}`),
    db.run(sql`update attendees set participant_id = ${toId} where participant_id = ${fromId}`),
    db.run(sql`delete from participants where id = ${fromId}`),
  ]);
}

/**
 * Abre la sesión de una cuenta en este navegador y devuelve si lo logró.
 *
 * La capacitación sale, en este orden, de la que pidió el enlace, de la que ya
 * estaba abierta en el navegador o de la última donde anduvo la cuenta. Si el
 * navegador tenía una sesión anónima de esa capacitación, su avance pasa a la
 * cuenta: nadie pierde lo que hizo antes de registrarse.
 */
export async function openAccountSession(
  account: { id: number; name: string },
  preferredCodeId?: number | null,
) {
  const current = await getParticipant();
  const anonymous = current && current.accountId === null ? current : null;

  const codeId =
    (await activeCode(preferredCodeId)) ??
    (current?.accountId === account.id ? current.accessCodeId : null) ??
    anonymous?.accessCodeId ??
    (await latestCode(account.id));
  if (!codeId) return false;

  const now = new Date();
  const own = await db.query.participants.findFirst({
    columns: { id: true, token: true },
    where: and(eq(participants.accountId, account.id), eq(participants.accessCodeId, codeId)),
  });
  const sameCodeAnonymous = anonymous?.accessCodeId === codeId ? anonymous : null;

  let token: string;
  if (own) {
    if (sameCodeAnonymous) await mergeInto(sameCodeAnonymous.id, own.id);
    token = own.token;
    await db.update(participants).set({ lastSeenAt: now }).where(eq(participants.id, own.id));
  } else if (sameCodeAnonymous) {
    token = sameCodeAnonymous.token;
    await db
      .update(participants)
      .set({
        accountId: account.id,
        name: account.name,
        nameKey: accountNameKey(account.id),
        lastSeenAt: now,
        updatedAt: now,
      })
      .where(eq(participants.id, sameCodeAnonymous.id));
  } else {
    const [row] = await db
      .insert(participants)
      .values({
        accessCodeId: codeId,
        accountId: account.id,
        name: account.name,
        nameKey: accountNameKey(account.id),
        token: randomUUID(),
        updatedAt: now,
      })
      .returning({ token: participants.token });
    token = row.token;
  }

  await setSessionCookie(token);
  return true;
}
