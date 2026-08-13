import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

/**
 * Chequeo optimista: solo mira si hay cookie, sin tocar la base. La sesión de
 * verdad se verifica en `getParticipant()`, ya dentro de cada página.
 *
 * Fuera del candado quedan /ingresar, /admin, /vivo y /presentar: las dos
 * últimas tienen su propio PIN de sesión en vivo.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = new URL('/ingresar', request.url);
  const { pathname, search } = request.nextUrl;

  // Para volver a donde iba después de registrarse.
  if (pathname !== '/') url.searchParams.set('destino', `${pathname}${search}`);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|ingresar|admin|vivo|presentar|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)',
  ],
};
