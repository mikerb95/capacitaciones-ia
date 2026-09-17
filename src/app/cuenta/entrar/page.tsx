import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/cuenta-forms';
import { safeDestination } from '@/lib/destination';
import { getParticipant } from '@/lib/session';
import { CuentaCard, CuentaFooter, CuentaHeading, footerLink } from '@/components/cuenta-shell';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Iniciar sesión · Aula Virtual' };

type Props = { searchParams: Promise<{ destino?: string }> };

export default async function EntrarPage({ searchParams }: Props) {
  const destination = safeDestination((await searchParams).destino);
  const participant = await getParticipant();

  if (participant?.accountId) redirect(destination);

  const query = destination === '/' ? '' : `?destino=${encodeURIComponent(destination)}`;

  return (
    <>
      <CuentaHeading title="Inicia sesión">
        {participant
          ? `Al entrar, lo que llevas en ${participant.accessCode.label} queda guardado en tu cuenta.`
          : 'Entra con tu cuenta para seguir la ruta donde la dejaste.'}
      </CuentaHeading>

      <CuentaCard>
        <SignInForm destination={destination} />
      </CuentaCard>

      <CuentaFooter>
        <span>
          ¿Todavía no tienes cuenta?{' '}
          <Link href={`/cuenta/crear${query}`} className={footerLink}>
            Créala
          </Link>
        </span>
        {!participant && (
          <span>
            <Link href={`/ingresar${query}`} className={footerLink}>
              Entrar solo con el código
            </Link>
          </span>
        )}
      </CuentaFooter>
    </>
  );
}
