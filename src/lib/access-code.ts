import { randomInt } from 'node:crypto';

/**
 * Alfabeto del código de ingreso. Sin las letras y dígitos que se confunden al
 * dictarlos en voz alta (O/0, I/1, S/5, B/8): el código se lee en la sala y se
 * escribe a mano en el celular, así que la claridad pesa más que el tamaño del
 * espacio de códigos.
 */
const ALPHABET = 'ACDEFGHJKMNPQRTUVWXYZ2346789';

/** Largo de los códigos que se sortean solos. */
export const CODE_LENGTH = 6;

/** Un código escrito a mano puede ser más corto o más largo que el sorteado. */
export const CODE_MIN = 4;
export const CODE_MAX = 12;

/**
 * Deja el código en su forma canónica: mayúsculas y solo letras y dígitos. Así
 * "acme-24" y "Acme 24" son el mismo código, y quien lo escribe no tiene que
 * acertarle a los separadores ni a las mayúsculas.
 */
export function normalizeCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** Código alfanumérico libre de ambigüedades, listo para dictar. */
export function randomCode(length = CODE_LENGTH) {
  let code = '';
  for (let i = 0; i < length; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return code;
}

/**
 * Qué le falta al código para ser válido, ya normalizado. Devuelve null cuando
 * está bien.
 */
export function codeProblem(code: string) {
  if (code.length < CODE_MIN || code.length > CODE_MAX) {
    return `El código lleva entre ${CODE_MIN} y ${CODE_MAX} letras o números.`;
  }
  return null;
}
