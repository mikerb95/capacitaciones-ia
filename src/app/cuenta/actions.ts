'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { accessCodes } from '@/db/schema';
import { codeProblem, normalizeCode } from '@/lib/access-code';
import {
  accountFromToken,
  attemptPasswordLogin,
  findAccountByEmail,
  openAccountSession,
  resetPassword,
} from '@/lib/cuenta';
import { hashPassword, passwordProblem } from '@/lib/cuenta/passwords';
import {
  TOKEN_TTL_MIN,
  consumeToken,
  findToken,
  isValidEmail,
  issueToken,
  normalizeEmail,
} from '@/lib/cuenta/tokens';
import { safeDestination } from '@/lib/destination';
import { sendResetEmail, sendSignInEmail, siteUrl } from '@/lib/email';
import { cleanName } from '@/lib/name';
import { getParticipant } from '@/lib/session';

export type AccountFormState = {
  error?: string;
  /** Correo al que se mandó el enlace. Con esto el formulario pasa a "revisa tu correo". */
  sent?: string;
  values?: { name?: string; email?: string; code?: string };
};

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

// La contraseña va tal cual: los espacios de los extremos también cuentan.
const raw = (data: FormData, key: string) => (data.get(key) as string | null) ?? '';

const NAME_MAX = 80;

// Si la capacitación del navegador es anónima, el enlace la lleva consigo: así
// la cuenta queda vinculada aunque el correo se abra en otro dispositivo.
async function anonymousCodeId() {
  const current = await getParticipant();
  return current && current.accountId === null ? current.accessCodeId : null;
}

const linkUrl = (token: string) => `${siteUrl()}/cuenta/enlace?t=${encodeURIComponent(token)}`;

const TOO_MANY = 'Ya te enviamos varios enlaces hace poco. Revisa tu correo o intenta en unos minutos.';
const SEND_FAILED = 'No pudimos enviar el correo. Intenta de nuevo en unos minutos.';

/**
 * Registro. No crea la cuenta: guarda lo pedido junto al enlace y lo manda al
 * correo. La cuenta nace cuando alguien abre ese enlace, que es la prueba de
 * que la dirección es suya.
 *
 * Si el correo ya tenía cuenta, el camino es el mismo, para no delatar qué
 * direcciones están registradas: al abrir el enlace, entra con esa cuenta.
 */
export async function register(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const name = cleanName(str(formData, 'nombre'));
  const email = normalizeEmail(str(formData, 'correo'));
  const typedCode = normalizeCode(str(formData, 'codigo'));
  const method = str(formData, 'metodo') === 'contrasena' ? 'contrasena' : 'enlace';
  const values = { name, email, code: typedCode };

  if (name.length < 2) return { error: 'Escribe tu nombre.', values };
  if (name.length > NAME_MAX) return { error: 'El nombre es demasiado largo.', values };
  if (!isValidEmail(email)) return { error: 'Revisa el correo: parece incompleto.', values };

  let accessCodeId = await anonymousCodeId();
  if (!accessCodeId) {
    const problem = codeProblem(typedCode);
    if (problem) return { error: problem, values };

    const code = await db.query.accessCodes.findFirst({
      columns: { id: true },
      where: and(eq(accessCodes.code, typedCode), eq(accessCodes.active, true)),
    });
    if (!code) return { error: 'Ese código no está activo. Confírmalo con el expositor.', values };
    accessCodeId = code.id;
  }

  let passwordHash: string | null = null;
  if (method === 'contrasena') {
    const password = raw(formData, 'contrasena');
    const problem = passwordProblem(password);
    if (problem) return { error: problem, values };
    passwordHash = await hashPassword(password);
  }

  const token = await issueToken({
    email,
    purpose: 'entrar',
    accessCodeId,
    name,
    passwordHash,
    destination: safeDestination(str(formData, 'destino')),
  });
  if (!token) return { error: TOO_MANY, values };

  const mail = await sendSignInEmail({
    to: email,
    url: linkUrl(token),
    expiresMinutes: TOKEN_TTL_MIN.entrar,
    signup: true,
  });
  if (!mail.ok && !mail.skipped) return { error: SEND_FAILED, values };

  return { sent: email };
}

/**
 * Inicio de sesión. El mismo formulario sirve para las dos formas: con
 * contraseña, o pidiendo un enlace al correo.
 */
export async function signIn(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const email = normalizeEmail(str(formData, 'correo'));
  const destination = safeDestination(str(formData, 'destino'));
  const values = { email };

  if (!isValidEmail(email)) return { error: 'Revisa el correo: parece incompleto.', values };

  if (str(formData, 'modo') === 'enlace') {
    return sendLink(email, destination);
  }

  const password = raw(formData, 'contrasena');
  if (!password) return { error: 'Escribe tu contraseña o pide un enlace al correo.', values };

  const result = await attemptPasswordLogin(email, password);
  if (!result.ok) {
    return {
      error:
        result.reason === 'locked'
          ? `Demasiados intentos. Espera ${result.minutes} ${result.minutes === 1 ? 'minuto' : 'minutos'} o entra con un enlace al correo.`
          : 'El correo o la contraseña no coinciden.',
      values,
    };
  }

  if (!(await openAccountSession(result.account))) redirect('/ingresar?aviso=sin-capacitacion');
  redirect(destination);
}

async function sendLink(email: string, destination: string): Promise<AccountFormState> {
  // Sin cuenta no se manda nada, pero la respuesta es la misma.
  const account = await findAccountByEmail(email);
  if (!account) return { sent: email };

  const token = await issueToken({
    email,
    purpose: 'entrar',
    accessCodeId: await anonymousCodeId(),
    destination,
  });
  if (!token) return { error: TOO_MANY, values: { email } };

  const mail = await sendSignInEmail({
    to: email,
    url: linkUrl(token),
    expiresMinutes: TOKEN_TTL_MIN.entrar,
    signup: false,
  });
  if (!mail.ok && !mail.skipped) return { error: SEND_FAILED, values: { email } };

  return { sent: email };
}

export async function requestReset(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const email = normalizeEmail(str(formData, 'correo'));
  if (!isValidEmail(email)) return { error: 'Revisa el correo: parece incompleto.', values: { email } };

  const account = await findAccountByEmail(email);
  if (!account) return { sent: email };

  const token = await issueToken({ email, purpose: 'recuperar' });
  if (!token) return { error: TOO_MANY, values: { email } };

  const mail = await sendResetEmail({
    to: email,
    url: linkUrl(token),
    expiresMinutes: TOKEN_TTL_MIN.recuperar,
  });
  if (!mail.ok && !mail.skipped) return { error: SEND_FAILED, values: { email } };

  return { sent: email };
}

const EXPIRED = 'Este enlace ya se usó o venció. Pide uno nuevo.';

/**
 * Usa un enlace de ingreso. Se gasta con un botón y no al abrir la página:
 * los antivirus de correo visitan los enlaces antes que la persona, y si el
 * solo hecho de abrirlo lo gastara, llegaría vencido.
 */
export async function useSignInLink(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const token = await consumeToken(str(formData, 't'), 'entrar');
  if (!token) return { error: EXPIRED };

  const account = await accountFromToken(token);
  if (!(await openAccountSession(account, token.accessCodeId))) {
    redirect('/ingresar?aviso=sin-capacitacion');
  }
  redirect(safeDestination(token.destination));
}

export async function setNewPassword(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const password = raw(formData, 'contrasena');
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== raw(formData, 'confirmacion')) return { error: 'Las dos contraseñas no coinciden.' };

  // Se revisa antes de gastarlo, para que un error de tipeo no queme el enlace.
  if (!(await findToken(str(formData, 't'), 'recuperar'))) return { error: EXPIRED };

  const token = await consumeToken(str(formData, 't'), 'recuperar');
  if (!token) return { error: EXPIRED };

  const account = await findAccountByEmail(token.email);
  if (!account) return { error: EXPIRED };

  await resetPassword(account.id, password);
  if (!(await openAccountSession(account))) redirect('/ingresar?aviso=sin-capacitacion');
  redirect('/');
}
