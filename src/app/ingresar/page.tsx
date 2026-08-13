import { redirect } from 'next/navigation';
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
        </div>
      </main>
    </div>
  );
}
