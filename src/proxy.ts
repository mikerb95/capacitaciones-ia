import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

/**
 * Basic Auth para /admin, contra ADMIN_USER y ADMIN_PASS. Sin esas variables
 * configuradas, el candado queda cerrado a cal y canto (nadie entra) en vez
 * de dejar el panel abierto por accidente.
 */
function hasValidAdminAuth(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) return false;

  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;

  const [user, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  return user === adminUser && pass === adminPass;
}

function requireAdminAuth() {
  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}

/**
 * Chequeo optimista: solo mira si hay cookie, sin tocar la base. La sesión de
 * verdad se verifica en `getParticipant()`, ya dentro de cada página.
 *
 * Fuera del candado de sesión quedan /ingresar, /vivo y /presentar: las dos
 * últimas tienen su propio PIN de sesión en vivo. /admin tiene su propio
 * candado, Basic Auth, más arriba.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    return hasValidAdminAuth(request) ? NextResponse.next() : requireAdminAuth();
  }

  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = new URL('/ingresar', request.url);

  // Para volver a donde iba después de registrarse.
  if (pathname !== '/') url.searchParams.set('destino', `${pathname}${search}`);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|ingresar|vivo|presentar|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)',
  ],
};
