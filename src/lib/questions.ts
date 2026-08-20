/**
 * Lo que comparten el formulario y la acción del buzón de preguntas. Vive
 * aparte porque un archivo `'use server'` solo puede exportar funciones: las
 * constantes y el tipo del estado no caben ahí.
 */

/** Lo que cabe en una pregunta. Corta obliga a escribir algo; larga es un correo. */
export const QUESTION_MIN = 8;
export const QUESTION_MAX = 800;

export type AskState = {
  error?: string;
  // Marca del envío aceptado. Es una fecha y no un booleano porque el
  // formulario la usa de llave para volver a montarse: dos preguntas seguidas
  // tienen que limpiar los campos las dos veces.
  sentAt?: number;
};
