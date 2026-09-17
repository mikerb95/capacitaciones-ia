import Link from 'next/link';
import { NewPasswordForm, RedeemLinkForm } from '@/components/cuenta-forms';
import { findToken } from '@/lib/cuenta/tokens';
import { CuentaCard, CuentaHeading } from '@/components/cuenta-shell';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Tu enlace · Aula Virtual', robots: { index: false } };

type Props = { searchParams: Promise<{ t?: string }> };

/**
 * Destino de los enlaces del correo. Solo mira si el enlace sirve: se gasta
 * con el botón, porque los filtros de correo abren los enlaces por su cuenta.
 */
export default async function EnlacePage({ searchParams }: Props) {
  const { t } = await searchParams;
  const token = await findToken(t);

  if (!token || !t) {
    return (
      <>
        <CuentaHeading title="Este enlace ya no sirve">
          Los enlaces vencen a los 30 minutos y se usan una sola vez. Pide uno nuevo y usa el más
          reciente.
        </CuentaHeading>
        <CuentaCard>
          <div className="flex flex-col gap-3">
            <Link
              href="/cuenta/entrar"
              className="rounded-[10px] bg-primary px-4 py-2.5 text-center text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Pedir otro enlace
            </Link>
            <Link
              href="/cuenta/recuperar"
              className="rounded-[10px] border border-line bg-surface px-4 py-2.5 text-center text-[14px] font-semibold text-muted transition-colors hover:border-primary hover:text-text"
            >
              Recuperar contraseña
            </Link>
          </div>
        </CuentaCard>
      </>
    );
  }

  if (token.purpose === 'recuperar') {
    return (
      <>
        <CuentaHeading title="Elige una contraseña nueva">
          Para la cuenta <strong className="font-semibold text-text">{token.email}</strong>.
        </CuentaHeading>
        <CuentaCard>
          <NewPasswordForm token={t} email={token.email} />
        </CuentaCard>
      </>
    );
  }

  return (
    <>
      <CuentaHeading title={token.name ? 'Confirma tu cuenta' : 'Entra al Aula Virtual'}>
        {token.name
          ? `Hola, ${token.name}. Un paso más y tu avance queda guardado en tu cuenta.`
          : 'Continúa para entrar con tu cuenta.'}
        <br />
        <span className="text-[13px] text-faint">{token.email}</span>
      </CuentaHeading>
      <CuentaCard>
        <RedeemLinkForm token={t} />
      </CuentaCard>
    </>
  );
}
