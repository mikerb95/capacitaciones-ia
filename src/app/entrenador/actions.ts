'use server';

import { getModule } from '@/db/queries';
import { retosDeModulo, seEntrena } from '@/lib/entrenador';
import { TOPE_INTENTO, evaluar, type Resultado } from '@/lib/evaluador';
import { hasModule, requireScopedParticipant } from '@/lib/scope';

/**
 * Califica el intento de un reto. Lo único que llega del navegador es qué
 * módulo, qué reto y el texto: la rúbrica y el caso se releen de la base acá,
 * porque son lo que le da valor a la crítica y no se le pueden creer al
 * cliente.
 *
 * No escribe nada. Ni el intento, ni el resultado, ni que alguien entrenó.
 */
export async function calificar(
  platformId: string,
  slug: string,
  numeroReto: number,
  intento: string,
): Promise<Resultado | { error: string }> {
  const { scope } = await requireScopedParticipant();

  const mod = await getModule(platformId, slug);
  if (!mod || !hasModule(scope, mod.id) || !seEntrena(mod)) {
    return { error: 'Ese módulo no está en tu capacitación.' };
  }

  const reto = retosDeModulo(mod).find((r) => r.numero === numeroReto);
  if (!reto) return { error: 'Ese reto no existe en este módulo.' };

  const texto = intento.trim();
  if (texto.length < 25) return { error: 'Escribe un poco más para poder revisarlo.' };

  return evaluar({
    reto,
    // El recorte protege el cupo por minuto que comparte todo el portal, no la
    // seguridad. Con 1200 caracteres sobra para un prompt de trabajo.
    intento: texto.slice(0, TOPE_INTENTO),
    moduloNombre: mod.name,
    plataformaNombre: mod.platform.name,
    tropiezos: mod.mistakes.map((m) => ({ bad: m.bad, good: m.good })),
  });
}
