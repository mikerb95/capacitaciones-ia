import Link from 'next/link';
import { ResetRequestForm } from '@/components/cuenta-forms';
import { CuentaCard, CuentaFooter, CuentaHeading, footerLink } from '@/components/cuenta-shell';

export const metadata = { title: 'Recuperar contraseña · Aula Virtual' };

export default function RecuperarPage() {
  return (
    <>
      <CuentaHeading title="Recupera tu contraseña">
        Te mandamos un enlace para elegir una nueva.
      </CuentaHeading>

      <CuentaCard>
        <ResetRequestForm />
      </CuentaCard>

      <CuentaFooter>
        <span>
          ¿Te acordaste?{' '}
          <Link href="/cuenta/entrar" className={footerLink}>
            Inicia sesión
          </Link>
        </span>
      </CuentaFooter>
    </>
  );
}
