import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import { emailTokens, type EmailToken } from '@/db/schema';

export type TokenPurpose = EmailToken['purpose'];

/** Cuánto vive cada enlace, en minutos. */
export const TOKEN_TTL_MIN: Record<TokenPurpose, number> = {
  entrar: 30,
  recuperar: 30,
};

/**
 * Topes de envío. Cada enlace es un correo que se paga en la cuota de Resend
 * (el plan gratis da 100 al día), así que se frena en tres niveles:
 *
 * - por correo, contra quien llena el buzón de otra persona;
 * - por IP, contra quien prueba con muchas direcciones distintas;
 * - por día y en total, como último seguro si lo anterior no alcanza, por
 *   ejemplo con IPs rotativas. Se ajusta con `EMAIL_DAILY_LIMIT`.
 */
const WINDOW_MIN = 15;
const MAX_PER_EMAIL = 3;
const MAX_PER_IP = 6;
const DEFAULT_DAILY_LIMIT = 90;

function dailyLimit() {
  const n = Number(process.env.EMAIL_DAILY_LIMIT);
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_DAILY_LIMIT;
}

export type IssueResult = { token: string } | { blocked: 'email' | 'ip' | 'daily' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MAX = 254;

export const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

export const isValidEmail = (email: string) => email.length <= EMAIL_MAX && EMAIL_RE.test(email);

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/**
 * Crea un enlace y devuelve el token en claro, que solo viaja en el correo, o
 * el tope que lo impidió. Los enlaces cuentan aunque el correo no salga: el
 * tope mide lo que se intentó enviar.
 */
export async function issueToken(params: {
  email: string;
  purpose: TokenPurpose;
  accessCodeId?: number | null;
  name?: string | null;
  passwordHash?: string | null;
  destination?: string | null;
  ip?: string | null;
}): Promise<IssueResult> {
  const now = Date.now();
  // En segundos, que es como se guarda: en `sql` crudo Drizzle no convierte fechas.
  const since = Math.floor((now - WINDOW_MIN * 60_000) / 1000);
  const ipHash = params.ip ? hashToken(`ip:${params.ip}`) : null;

  const [counts] = await db
    .select({
      email: sql<number>`coalesce(sum(${emailTokens.email} = ${params.email} and ${emailTokens.createdAt} > ${since}), 0)`,
      ip: ipHash
        ? sql<number>`coalesce(sum(${emailTokens.ipHash} = ${ipHash} and ${emailTokens.createdAt} > ${since}), 0)`
        : sql<number>`0`,
      day: sql<number>`count(*)`,
    })
    .from(emailTokens)
    .where(gt(emailTokens.createdAt, new Date(now - 24 * 60 * 60_000)));

  if (counts.email >= MAX_PER_EMAIL) return { blocked: 'email' };
  if (counts.ip >= MAX_PER_IP) return { blocked: 'ip' };
  if (counts.day >= dailyLimit()) return { blocked: 'daily' };

  const token = randomBytes(32).toString('base64url');
  await db.insert(emailTokens).values({
    email: params.email,
    purpose: params.purpose,
    tokenHash: hashToken(token),
    accessCodeId: params.accessCodeId ?? null,
    name: params.name ?? null,
    passwordHash: params.passwordHash ?? null,
    destination: params.destination ?? null,
    ipHash,
    expiresAt: new Date(now + TOKEN_TTL_MIN[params.purpose] * 60_000),
    createdAt: new Date(now),
  });

  return { token };
}

/** Enlace vigente y sin usar, o null. No lo gasta: eso lo hace `consumeToken`. */
export async function findToken(token: string | undefined, purpose?: TokenPurpose) {
  if (!token || token.length > 100) return null;

  const row = await db.query.emailTokens.findFirst({
    where: and(
      eq(emailTokens.tokenHash, hashToken(token)),
      isNull(emailTokens.usedAt),
      gt(emailTokens.expiresAt, new Date()),
    ),
  });
  if (!row || (purpose && row.purpose !== purpose)) return null;
  return row;
}

/**
 * Gasta el enlace. La condición sobre `used_at` hace que, si llegan dos usos a
 * la vez, solo uno lo consiga. Al usarse, los demás enlaces pendientes del
 * mismo correo y propósito quedan anulados: vale el último que se usó.
 */
export async function consumeToken(token: string | undefined, purpose?: TokenPurpose) {
  const row = await findToken(token, purpose);
  if (!row) return null;

  const now = new Date();
  const [spent] = await db
    .update(emailTokens)
    .set({ usedAt: now })
    .where(and(eq(emailTokens.id, row.id), isNull(emailTokens.usedAt)))
    .returning({ id: emailTokens.id });
  if (!spent) return null;

  await db
    .update(emailTokens)
    .set({ usedAt: now })
    .where(
      and(
        eq(emailTokens.email, row.email),
        eq(emailTokens.purpose, row.purpose),
        isNull(emailTokens.usedAt),
      ),
    );

  return row;
}
