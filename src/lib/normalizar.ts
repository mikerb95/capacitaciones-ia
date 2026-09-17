/**
 * Minúsculas y sin tildes, carácter por carácter para que el texto normalizado
 * mida lo mismo que el original: así una posición encontrada en uno sirve para
 * recortar o resaltar el otro. Lo usan el buscador y su panel en el navegador.
 */
export function normalizar(texto: string) {
  let out = '';
  for (const c of texto) {
    const plano = c.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    // Un carácter que cambia de largo al normalizarse se deja como está.
    out += plano.length === c.length ? plano : c;
  }
  return out;
}

/** Las palabras de una consulta, ya normalizadas. */
export function terminos(consulta: string) {
  return normalizar(consulta).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}
