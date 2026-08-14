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

export function progressOf(viewedIds: Iterable<number>, scopeIds: Set<number>): Progress {
  let done = 0;
  for (const id of viewedIds) if (scopeIds.has(id)) done += 1;

  const total = scopeIds.size;
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
  if (done === 0) return 'Todavía no abre ningún módulo';
  return `${done} de ${total} ${total === 1 ? 'módulo' : 'módulos'} recorridos`;
}
