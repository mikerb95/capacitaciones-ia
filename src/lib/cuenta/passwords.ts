import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';

/**
 * Hash de contraseñas con scrypt de `node:crypto`, el mismo del portal de
 * clientes del portfolio. Sin dependencias ni binarios nativos, y su costo en
 * memoria lo hace caro de paralelizar en GPU, que es la amenaza real contra un
 * volcado de la base.
 *
 * El hash guarda sus propios parámetros (`scrypt$N$r$p$salt$hash`): si algún
 * día se endurecen, los viejos siguen verificando y se rehacen en el siguiente
 * ingreso correcto.
 */

// N=2^15 con r=8: unos 32 MB y 100 ms por hash. Caro para un diccionario,
// barato para una función serverless.
const PARAMS = { N: 32_768, r: 8, p: 1 } as const;
const KEY_LEN = 64;
const SALT_LEN = 16;

export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 200;

// A mano y no con `promisify`: sus tipos toman la sobrecarga sin opciones, y
// ahí es donde van N, r y p.
const derive = (password: string, salt: Buffer, N: number, r: number, p: number) =>
  new Promise<Buffer>((resolve, reject) => {
    // El `maxmem` por defecto (32 MB) no alcanza para N=2^15; scrypt pide 128*N*r.
    scryptCb(password.normalize('NFKC'), salt, KEY_LEN, { N, r, p, maxmem: 256 * N * r }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });

/** Qué le falta a una contraseña para aceptarla. Null si está bien. */
export function passwordProblem(password: string) {
  if (password.length < PASSWORD_MIN) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
  }
  if (password.length > PASSWORD_MAX) {
    return `La contraseña no puede pasar de ${PASSWORD_MAX} caracteres.`;
  }
  if (!/\p{L}/u.test(password) || !/\p{N}/u.test(password)) {
    return 'La contraseña debe combinar letras y números.';
  }
  return null;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LEN);
  const hash = await derive(password, salt, PARAMS.N, PARAMS.r, PARAMS.p);
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

/**
 * Nunca lanza: un hash dañado o desconocido es un `false`, porque un error acá
 * le diría a quien prueba algo sobre el estado de la cuenta.
 */
export async function verifyPassword(password: string, stored: string | null | undefined) {
  if (!stored) return false;
  try {
    const [scheme, nRaw, rRaw, pRaw, saltRaw, hashRaw] = stored.split('$');
    if (scheme !== 'scrypt' || !saltRaw || !hashRaw) return false;

    const N = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    // Un N absurdo guardado en la base no puede volverse una bomba de memoria.
    if (!Number.isInteger(N) || N < 1024 || N > 1 << 20) return false;
    if (!Number.isInteger(r) || r < 1 || r > 32) return false;
    if (!Number.isInteger(p) || p < 1 || p > 16) return false;

    const expected = Buffer.from(hashRaw, 'base64url');
    const actual = await derive(password, Buffer.from(saltRaw, 'base64url'), N, r, p);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** ¿El hash quedó con parámetros más débiles que los actuales? */
export function needsRehash(stored: string | null | undefined) {
  if (!stored) return false;
  const [scheme, N, r, p] = stored.split('$');
  return scheme !== 'scrypt' || Number(N) < PARAMS.N || Number(r) < PARAMS.r || Number(p) < PARAMS.p;
}

// Hash de relleno para cuando el correo no existe: se gasta lo mismo que en una
// verificación real y la latencia no delata qué correos tienen cuenta. Se
// calcula una vez por instancia.
let dummy: Promise<string> | null = null;
export function dummyHash() {
  dummy ??= hashPassword(randomBytes(12).toString('hex'));
  return dummy;
}
