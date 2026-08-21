import type { ModuleFull } from '@/db/queries';

/**
 * El entrenador de prompts: se plantea un caso real del módulo, el asistente
 * escribe el prompt que mandaría, y solo después se le muestra contra qué se
 * mide y cómo lo habríamos escrito nosotros.
 *
 * El orden importa y es la única regla del ejercicio: **primero se intenta,
 * después se ve la respuesta**. Leer la lista de chequeo antes de escribir
 * convierte el ejercicio en un dictado, y de eso no se aprende nada.
 *
 * Nada de lo que se escribe acá sale del navegador ni se guarda. El portal no
 * sabe quién entró, y el entrenador no es la excepción: el intento es de quien
 * lo escribe, y se pierde al cerrar la página. Eso es a propósito, porque es
 * lo que hace que la gente se atreva a pegar el prompt malo de verdad.
 */

/** Un caso para resolver, sacado de los casos por área del módulo. */
export type Reto = {
  /** Posición dentro del módulo, para el "reto 2 de 3". */
  numero: number;
  /** El área de la que se disfraza quien practica. */
  rol: string;
  /** El encargo, en una línea. */
  tarea: string;
  /** La situación completa, que es lo que se lee antes de escribir. */
  situacion: string;
};

/**
 * Criterio de la lista de chequeo. Son seis y son siempre los mismos: no
 * cambian por módulo porque lo que distingue a un prompt bueno de uno malo es
 * igual en Copilot que en Claude. Lo que sí cambia por módulo son los
 * tropiezos y los prompts modelo, que salen del contenido de la ficha.
 *
 * Están redactados como pregunta de sí o no a propósito. "¿Dijiste para quién
 * es?" se puede contestar mirando el propio texto; "¿es claro el contexto?" no.
 */
export type Criterio = {
  id: string;
  titulo: string;
  pregunta: string;
  /** Cómo se ve cuando está bien puesto, en pocas palabras. */
  ejemplo: string;
};

export const CRITERIOS: Criterio[] = [
  {
    id: 'encargo',
    titulo: 'El encargo',
    pregunta: '¿Se entiende qué tiene que producir, en una sola frase?',
    ejemplo: 'Un correo, una tabla comparativa, un resumen de una página.',
  },
  {
    id: 'destinatario',
    titulo: 'Para quién es',
    pregunta: '¿Dice quién va a leer o usar el resultado?',
    ejemplo: 'Para el comité directivo, para un cliente que no es técnico.',
  },
  {
    id: 'insumos',
    titulo: 'Los insumos',
    pregunta: '¿Trae los datos, el documento o el ejemplo real, y no solo la idea?',
    ejemplo: 'El acta adjunta, estas cifras, el correo anterior pegado abajo.',
  },
  {
    id: 'formato',
    titulo: 'El formato',
    pregunta: '¿Dice cómo quieres el resultado: extensión, estructura, tono?',
    ejemplo: 'En cinco viñetas, máximo 200 palabras, en tono formal.',
  },
  {
    id: 'limites',
    titulo: 'Los límites',
    pregunta: '¿Dice qué no debe hacer, o de dónde no puede salirse?',
    ejemplo: 'Solo con lo que está en el documento, sin inventar cifras.',
  },
  {
    id: 'siguiente',
    titulo: 'La salida',
    pregunta: '¿Deja claro qué harás si el resultado no sirve del todo?',
    ejemplo: 'Pide una versión y anuncia que la vas a ajustar por partes.',
  },
];

/**
 * Los retos del módulo. Salen de los casos por área (`module_roles`), que es lo
 * único del contenido escrito desde la perspectiva de quien tiene el problema y
 * no de quien enseña la herramienta. Un módulo sin casos por área no tiene
 * entrenador, y eso está bien: no se inventa un caso para llenar la página.
 */
export function retosDeModulo(mod: Pick<ModuleFull, 'roles'>): Reto[] {
  return mod.roles.map((rol, i) => ({
    numero: i + 1,
    rol: rol.role,
    tarea: rol.task,
    situacion: rol.detail,
  }));
}

/** Un módulo entrena si tiene con qué: al menos un caso y un prompt modelo. */
export function seEntrena(mod: { roles: unknown[]; prompts: unknown[] }) {
  return mod.roles.length > 0 && mod.prompts.length > 0;
}
