import Link from 'next/link';
import { redirect } from 'next/navigation';
import { enterDemo } from '@/app/ingresar/actions';
import { EnterForm } from '@/components/enter-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { getParticipant } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Entrar · Academia IA' };

type Props = { searchParams: Promise<{ destino?: string }> };

export default async function IngresarPage({ searchParams }: Props) {
  const { destino } = await searchParams;
  const destination = destino?.startsWith('/') && !destino.startsWith('//') ? destino : '/';

  // Quien ya tiene sesión no vuelve a registrarse.
  if (await getParticipant()) redirect(destination);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-bg">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <main className="grid place-items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[400px]">
          <div className="mb-7 text-center">
            <h1 className="font-display text-[27px] font-semibold tracking-tight">Academia IA</h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
              Escribe el código que te dieron al inicio de la capacitación y tu WhatsApp para entrar
              al material. Si ya entraste antes, con eso basta.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <EnterForm destination={destination} />
          </div>

          <div className="mt-5 text-center">
            <form action={enterDemo}>
              <input type="hidden" name="destino" value={destination} />
              <button
                type="submit"
                className="text-[13px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-primary"
              >
                Solo quiero mirar el portal, sin código
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-faint">
            ¿Contrataste la capacitación para tu equipo?{' '}
            <Link href="/empresa" className="font-medium transition-colors hover:text-primary">
              Entra al panel de tu empresa
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
