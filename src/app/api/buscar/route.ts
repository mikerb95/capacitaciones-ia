import { NextResponse, type NextRequest } from 'next/server';
import { buscar } from '@/lib/buscador';
import { getCodePlans, getScope } from '@/lib/scope';
import { getParticipant } from '@/lib/session';

export const dynamic = 'force-dynamic';

const SIN_CACHE = { 'Cache-Control': 'no-store' };

/**
 * Resultados en vivo del buscador. `/api` queda fuera del proxy, así que la
 * sesión se comprueba acá: sin ella no hay catálogo que mostrar.
 *
 * `p` limita la búsqueda a una plataforma; sin él busca en todas las del código.
 */
export async function GET(request: NextRequest) {
  const participant = await getParticipant();
  if (!participant) {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401, headers: SIN_CACHE });
  }

  const params = request.nextUrl.searchParams;
  const consulta = (params.get('q') ?? '').slice(0, 120);
  const plataforma = params.get('p') || undefined;

  const [scope, planes] = await Promise.all([
    getScope(participant.accessCodeId),
    getCodePlans(participant.accessCodeId),
  ]);
  const respuesta = await buscar(consulta, { scope, plataforma });

  // Los enlaces a módulos llevan el plan contratado, igual que el portal.
  for (const grupo of respuesta.grupos) {
    for (const r of grupo.resultados) {
      const plan = planes.get(r.plataforma.id);
      if (plan && (r.grupo === 'modulo' || r.grupo === 'prompt')) {
        const [ruta, ancla] = r.href.split('#');
        r.href = `${ruta}?plan=${encodeURIComponent(plan)}${ancla ? `#${ancla}` : ''}`;
      }
    }
  }

  return NextResponse.json(respuesta, { headers: SIN_CACHE });
}
