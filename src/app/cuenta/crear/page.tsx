import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/components/cuenta-forms';
import { safeDestination } from '@/lib/destination';
import { getParticipant } from '@/lib/session';
import { CuentaCard, CuentaFooter, CuentaHeading, footerLink } from '@/components/cuenta-shell';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Crear cuenta · Aula Virtual' };

type Props = { searchParams: Promise<{ destino?: string }> };

export default async function CrearCuentaPage({ searchParams }: Props) {
  const destination = safeDestination((await searchParams).destino);
  const participant = await getParticipant();

  // Quien ya tiene cuenta abierta no vuelve a crearla.
  if (participant?.accountId) redirect(destination);

  const query = destination === '/' ? '' : `?destino=${encodeURIComponent(destination)}`;

  return (
    <>
      <CuentaHeading title="Crea tu cuenta">
        Guarda tu avance en la ruta y retómalo desde cualquier dispositivo. Es opcional: el
        material se sigue viendo solo con el código.
      </CuentaHeading>

      <CuentaCard>
        <RegisterForm destination={destination} trainingLabel={participant?.accessCode.label} />
      </CuentaCard>

      <CuentaFooter>
        <span>
          ¿Ya tienes cuenta?{' '}
          <Link href={`/cuenta/entrar${query}`} className={footerLink}>
            Inicia sesión
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
