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

// Enlaces por correo en la ventana. Tope contra quien usa el formulario para
// llenarle el buzón a otro, y contra el gasto en Resend.
const MAX_PER_WINDOW = 3;
const WINDOW_MIN = 15;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MAX = 254;

export const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

export const isValidEmail = (email: string) => email.length <= EMAIL_MAX && EMAIL_RE.test(email);

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/**
 * Crea un enlace y devuelve el token en claro, que solo viaja en el correo.
 * Devuelve null si ese correo ya pidió demasiados enlaces hace poco.
 */
export async function issueToken(params: {
  email: string;
  purpose: TokenPurpose;
  accessCodeId?: number | null;
  name?: string | null;
  passwordHash?: string | null;
  destination?: string | null;
}) {
  const now = Date.now();
  const since = new Date(now - WINDOW_MIN * 60_000);

  const [{ recent }] = await db
    .select({ recent: sql<number>`count(*)` })
    .from(emailTokens)
    .where(and(eq(emailTokens.email, params.email), gt(emailTokens.createdAt, since)));
  if (recent >= MAX_PER_WINDOW) return null;

  const token = randomBytes(32).toString('base64url');
  await db.insert(emailTokens).values({
    email: params.email,
    purpose: params.purpose,
    tokenHash: hashToken(token),
    accessCodeId: params.accessCodeId ?? null,
    name: params.name ?? null,
    passwordHash: params.passwordHash ?? null,
    destination: params.destination ?? null,
    expiresAt: new Date(now + TOKEN_TTL_MIN[params.purpose] * 60_000),
    createdAt: new Date(now),
  });

  return token;
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
