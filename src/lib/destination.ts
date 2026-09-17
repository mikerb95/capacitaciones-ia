/** Solo rutas internas: evita que `?destino=` mande a otro dominio. */
export function safeDestination(raw: string | null | undefined) {
  return raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\') ? raw : '/';
}
