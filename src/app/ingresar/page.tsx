import Link from 'next/link';
import { redirect } from 'next/navigation';
import { EnterForm } from '@/components/enter-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { safeDestination } from '@/lib/destination';
import { getParticipant } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Entrar · Aula Virtual' };

type Props = { searchParams: Promise<{ destino?: string; aviso?: string }> };

export default async function IngresarPage({ searchParams }: Props) {
  const { destino, aviso } = await searchParams;
  const destination = safeDestination(destino);
  const query = destination === '/' ? '' : `?destino=${encodeURIComponent(destination)}`;

  // Quien ya tiene sesión no vuelve a registrarse.
  if (await getParticipant()) redirect(destination);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-bg">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-[13px] text-faint transition-colors hover:text-primary">
          ← Academia IA
        </Link>
        <ThemeToggle />
      </div>

      <main className="grid place-items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[400px]">
          <div className="mb-7 text-center">
            <h1 className="font-display text-[27px] font-semibold tracking-tight">Aula Virtual</h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
              Escribe el código que te dieron al inicio de la capacitación. Para entrar no
              pedimos nombre, correo ni teléfono.
            </p>
          </div>

          {aviso === 'sin-capacitacion' && (
            <p
              role="status"
              className="mb-4 rounded-[10px] bg-primary-soft px-4 py-3 text-[13px] leading-relaxed text-text"
            >
              Tu cuenta está lista, pero no tiene una capacitación activa. Escribe el código de la
              nueva y después inicia sesión para sumarla a tu cuenta.
            </p>
          )}

          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <EnterForm destination={destination} />
          </div>

          <p className="mt-6 text-center text-[13px] leading-relaxed text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link
              href={`/cuenta/entrar${query}`}
              className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
            >
              Inicia sesión con tu correo
            </Link>
          </p>

          <p className="mt-3 text-center text-[12px] leading-relaxed text-faint">
            ¿Contrataste la capacitación para tu equipo?{' '}
            <Link
              href="/empresa"
              className="font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-primary"
            >
              Entra al panel de tu empresa
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
