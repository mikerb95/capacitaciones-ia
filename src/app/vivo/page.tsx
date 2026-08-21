import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Audience } from '@/components/audience';
import { getLiveByPin } from '@/db/queries';
import { joinLive } from '@/app/admin/(panel)/presentaciones/actions';
import { rememberName } from '@/lib/participants';
import { requireParticipant } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Sesión en vivo · Academia IA' };

// El PIN va en una cookie, no en la URL: así el nombre del asistente no queda
// en el historial ni en una captura, y solo ve la sesión quien se registró.
const JOINED = 'academia-sesion';

type Search = { searchParams: Promise<{ error?: string }> };

async function enter(formData: FormData) {
  'use server';

  const pin = ((formData.get('pin') as string) ?? '').trim();

  // La capacitación se lee de la sesión, nunca del formulario: así la
  // asistencia queda atada al código con el que la persona entró, que es lo que
  // permite mostrársela después a su empresa.
  const participant = await requireParticipant();

  if (!pin) redirect('/vivo?error=faltan');

  // Aquí sí hace falta el nombre: es una lista de asistencia, no el material.
  // Se guarda en la sesión para no volver a pedirlo en la siguiente.
  const name =
    participant.name ?? (await rememberName(participant, (formData.get('nombre') as string) ?? ''));

  if (!name) redirect('/vivo?error=nombre');

  const session = await joinLive({ pin, participantId: participant.id, name });
  if (!session) redirect('/vivo?error=pin');

  const jar = await cookies();
  jar.set(JOINED, pin, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // una jornada de capacitación
  });

  redirect('/vivo');
}

export default async function LivePage({ searchParams }: Search) {
  const { error } = await searchParams;
  const pin = (await cookies()).get(JOINED)?.value;

  // Sin código de capacitación no hay a quién atribuir la asistencia, así que
  // se pasa primero por el portal y se vuelve aquí.
  const participant = await requireParticipant('/vivo');

  if (pin) {
    const session = await getLiveByPin(pin);
    if (session) {
      return (
        <Audience
          pin={pin}
          title={session.deck.title}
          styles={session.deck.styles}
          slides={session.deck.slides}
          initialSlide={session.slide}
        />
      );
    }
  }

  const message =
    error === 'pin'
      ? 'Ese PIN no corresponde a ninguna sesión abierta. Confirma el número con el expositor.'
      : error === 'faltan'
        ? 'Hace falta el PIN de la sesión.'
        : error === 'nombre'
          ? 'Escribe tu nombre para quedar en la lista de asistencia.'
          : null;

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 text-center">
          <h1 className="font-display text-[24px] font-semibold tracking-tight">
            Entrar a la sesión
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
            Escribe el PIN que aparece en la pantalla del expositor y sigue las láminas desde tu
            propio dispositivo.
          </p>
        </div>

        <form
          action={enter}
          className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-card"
        >
          {message && (
            <p className="rounded-lg bg-[#fdebe2] px-3 py-2 text-[13px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
              {message}
            </p>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-muted">PIN de la sesión</span>
            <input
              name="pin"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              required
              className="w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-center font-mono text-[22px] tracking-[0.3em] outline-none focus:border-primary"
              placeholder="0000"
            />
          </label>

          {participant.name ? (
            <p className="rounded-[10px] bg-bg px-3 py-2.5 text-[13px] text-muted">
              Quedas en la lista como{' '}
              <span className="font-medium text-text">{participant.name}</span>
            </p>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-muted">Tu nombre</span>
              <input
                name="nombre"
                autoComplete="name"
                required
                className="w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-faint focus:border-primary"
                placeholder="Nombre y apellido"
              />
              <span className="text-[12px] text-faint">
                Es para la lista de asistencia de esta sesión. Al portal se entra sin nombre; aquí
                hace falta porque el expositor pasa lista.
              </span>
            </label>
          )}

          <button
            type="submit"
            className="mt-1 rounded-[10px] bg-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
