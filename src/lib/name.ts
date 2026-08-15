/**
 * Forma canónica de un nombre, para reconocer a la misma persona cuando vuelve
 * a escribirlo. Sin tildes, en minúsculas y con los espacios colapsados, así
 * "José Pérez", "jose perez" y "  José   Pérez " son la misma fila.
 *
 * No es una identidad verificada: dos personas que se llamen igual dentro de la
 * misma capacitación se cuentan como una sola. El portal no protege nada que
 * valga la pena suplantar, y a cambio no se le pide a nadie ningún dato de
 * contacto.
 */
export function nameKeyOf(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Espacios de más fuera, para guardar el nombre tal como se muestra. */
export function cleanName(name: string) {
  return name.replace(/\s+/g, ' ').trim();
}
