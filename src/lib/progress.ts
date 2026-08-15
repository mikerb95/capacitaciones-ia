/**
 * Avance de un asistente: cuántos de los módulos que su capacitación abrió ha
 * recorrido. Se mide contra el alcance del código, no contra el catálogo
 * entero: si la capacitación cubría seis módulos, seis es el total.
 */
export type Progress = {
  done: number;
  total: number;
  /** 0-100, redondeado. Con total 0 devuelve 0 y no una división rara. */
  percent: number;
};

/**
 * Los ids repetidos cuentan una sola vez, así se le puede pasar lo que vio una
 * persona o lo que vio el grupo entero sin que el avance se pase del total.
 */
export function progressOf(viewedIds: Iterable<number>, scopeIds: Set<number>): Progress {
  const seen = new Set<number>();
  for (const id of viewedIds) if (scopeIds.has(id)) seen.add(id);

  const total = scopeIds.size;
  const done = seen.size;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/**
 * Módulos que abarcaba una capacitación. Sin recorte guardado, el código abría
 * el catálogo entero, así que ese es el denominador honesto.
 */
export function scopeSetOf(scope: { moduleId: number }[], catalog: Set<number>) {
  return scope.length ? new Set(scope.map((s) => s.moduleId)) : catalog;
}

/** Cómo llamarle a ese número en una línea, sin prometer más de lo que sabe. */
export function progressLabel({ done, total }: Progress) {
  if (total === 0) return 'Sin módulos en alcance';
  if (done === 0) return 'Todavía no se ha abierto ningún módulo';
  return `${done} de ${total} ${total === 1 ? 'módulo' : 'módulos'} recorridos`;
}
