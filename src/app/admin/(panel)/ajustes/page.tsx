import { AdminPage } from '@/components/admin-page';
import { certificadosHabilitados } from '@/lib/ajustes';
import { setCertificados } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Ajustes · Aula Virtual' };

export default async function AjustesPage() {
  const certificados = await certificadosHabilitados();

  return (
    <AdminPage title="Ajustes" subtitle="Lo que vale para todo el sitio." max={760}>
      <section className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="min-w-[240px] flex-1">
            <h2 className="flex items-center gap-2 font-display text-[16px] font-semibold tracking-tight">
              <span
                className={`size-2 rounded-full ${certificados ? 'bg-accent' : 'bg-line'}`}
                aria-hidden="true"
              />
              Certificados de la ruta guiada
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
              Apagado, la ruta no menciona el certificado ni deja abrir su página. Los exámenes y el
              proyecto final siguen igual, y el avance de cada persona se conserva: si lo enciendes
              después, quien ya cumplió los requisitos ve su certificado de una.
            </p>
          </div>

          <form action={setCertificados}>
            <input type="hidden" name="enabled" value={certificados ? 'no' : 'si'} />
            <button
              type="submit"
              role="switch"
              aria-checked={certificados}
              aria-label="Ofrecer certificados"
              className="flex items-center gap-3 rounded-xl border border-line px-3 py-2 text-[13px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
            >
              <span
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  certificados ? 'bg-primary' : 'bg-surface-2 ring-1 ring-inset ring-line'
                }`}
                aria-hidden="true"
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white shadow-card transition-[left] ${
                    certificados ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </span>
              {certificados ? 'Encendido' : 'Apagado'}
            </button>
          </form>
        </div>
      </section>
    </AdminPage>
  );
}
