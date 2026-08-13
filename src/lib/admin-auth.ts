/**
 * Sesión del panel: en vez del cartel de Basic Auth del navegador, una página
 * de login propia. La cookie lleva un token firmado con HMAC, así el proxy
 * puede validarla sin tocar la base.
 */
export const ADMIN_COOKIE = 'academia-admin';
export const ADMIN_MAX_AGE = 60 * 60 * 8; // una jornada de trabajo

const encoder = new TextEncoder();

/** Sin credenciales configuradas el panel queda cerrado, no abierto. */
export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASS);
}

/**
 * La firma usa ADMIN_SECRET si existe; si no, la propia contraseña. El efecto
 * secundario es útil: cambiar la contraseña invalida las sesiones abiertas.
 */
function signingKey() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASS || '';
}

/** Comparación en tiempo constante, para no filtrar el largo del acierto. */
function equals(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signingKey()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

export function checkAdminCredentials(user: string, pass: string) {
  if (!adminAuthConfigured()) return false;
  return equals(user, process.env.ADMIN_USER!) && equals(pass, process.env.ADMIN_PASS!);
}

/** Token `usuario.vencimiento.firma`, todo en texto plano menos la firma. */
export async function createAdminToken(user: string) {
  const payload = `${toBase64Url(encoder.encode(user))}.${Date.now() + ADMIN_MAX_AGE * 1000}`;
  return `${payload}.${await sign(payload)}`;
}

/** Devuelve el usuario si el token está firmado y vigente; si no, `null`. */
export async function verifyAdminToken(token: string | undefined) {
  if (!token || !adminAuthConfigured()) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedUser, expiresAt, signature] = parts;
  if (!equals(signature, await sign(`${encodedUser}.${expiresAt}`))) return null;
  if (!Number(expiresAt) || Number(expiresAt) < Date.now()) return null;

  return process.env.ADMIN_USER!;
}
