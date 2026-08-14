import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';
import { COMPANY_COOKIE } from '@/lib/company-access';
import { SESSION_COOKIE } from '@/lib/session';

const ADMIN_LOGIN = '/admin/login';
const COMPANY_LOGIN = '/empresa';

/**
 * Chequeo optimista: solo mira si hay cookie, sin tocar la base. La sesión de
 * verdad se verifica en `getParticipant()`, ya dentro de cada página.
 *
 * Fuera del candado de sesión quedan /ingresar, /vivo y /presentar: las dos
 * últimas tienen su propio PIN de sesión en vivo. /admin y /empresa tienen
 * cada uno el suyo: la cookie firmada del login del panel y la clave de la
 * empresa.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const admin = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);

    // Quien ya entró no vuelve a ver el login.
    if (pathname === ADMIN_LOGIN) {
      return admin ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
    }

    if (admin) return NextResponse.next();

    const login = new URL(ADMIN_LOGIN, request.url);
    if (pathname !== '/admin') login.searchParams.set('destino', `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  // El panel de la empresa no es del asistente: entra con su propia clave, y
  // la validez de verdad la comprueba `requireCompany()` contra la base.
  if (pathname.startsWith(COMPANY_LOGIN)) {
    if (pathname === COMPANY_LOGIN || request.cookies.has(COMPANY_COOKIE)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(COMPANY_LOGIN, request.url));
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
