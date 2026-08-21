/**
 * Lo que comparten el formulario y la acción del buzón de preguntas. Vive
 * aparte porque un archivo `'use server'` solo puede exportar funciones: las
 * constantes y el tipo del estado no caben ahí.
 */

/** Lo que cabe en una pregunta. Corta obliga a escribir algo; larga es un correo. */
export const QUESTION_MIN = 8;
export const QUESTION_MAX = 800;

/**
 * Cuánto dura el arrepentimiento. Pasada esa ventana la pregunta ya es del
 * grupo: puede estar proyectada o contestada, y borrarla deja la conversación
 * coja. Antes, es un error de dedo y se deshace sin pedirle permiso a nadie.
 */
export const QUESTION_GRACE_MS = 15 * 60 * 1000;

/** El aviso que dispara el formulario para que la lista sepa cuál es la nueva. */
export const ASKED_EVENT = 'preguntas:enviada';

/** Las que se preguntaron desde este dispositivo, incluidas las anónimas. */
export const ASKED_STORAGE_KEY = 'academia-preguntas-mias';

export type AskState = {
  error?: string;
  // Marca del envío aceptado. Es una fecha y no un booleano porque el
  // formulario la usa de llave para volver a montarse: dos preguntas seguidas
  // tienen que limpiar los campos las dos veces.
  sentAt?: number;
  // Cuál quedó guardada. La lista la usa para llevarla a la vista y marcarla
  // como propia, que es lo único que reconoce a una pregunta anónima: el
  // servidor no guarda de quién es, y este dato no sale del navegador.
  questionId?: number;
};
