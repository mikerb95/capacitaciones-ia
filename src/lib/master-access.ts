/**
 * Usuario maestro de pruebas: entra al sitio como un asistente cualquiera, para
 * revisar los módulos tal como los ve la gente, sin depender de que haya una
 * capacitación abierta.
 */
export const MASTER_ACCESS = {
  code: '0368',
  label: 'Usuario maestro de pruebas',
  name: 'Mike',
  // El número llegó como 311 476 9114, un móvil colombiano: +57 por delante
  // para que el enlace de WhatsApp del admin funcione.
  phone: '+573114769114',
} as const;

/**
 * Códigos que nunca se le entregan a una capacitación real. El admin rechaza
 * crearlos a mano y tampoco los sortea.
 */
export const RESERVED_CODES: string[] = [MASTER_ACCESS.code];
