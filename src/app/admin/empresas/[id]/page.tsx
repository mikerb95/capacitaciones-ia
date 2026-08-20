import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { CompanyForm } from '@/components/company-form';
import { SiteHeader } from '@/components/ui';
import { getCompany } from '@/db/queries';
import { deleteCompany, rotatePanelKey, toggleCompanyPanel, updateCompany } from '../actions';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creada?: string; guardada?: string }>;
};

const fecha = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });

/** `Date` al formato que entiende un `<input type="date">`, en hora local. */
function toDateInput(date: Date | null) {
  if (!date) return '';
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mes}-${dia}`;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const company = await getCompany(Number(id));
  return { title: company ? `${company.name} · Academia IA` : 'Empresa · Academia IA' };
}

export default async function EmpresaPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { creada, guardada } = await searchParams;
  const company = await getCompany(Number(id));
  if (!company) notFound();

  const contratadas = company.accessCodes.filter((c) => c.contracted);
  const sueltas = company.accessCodes.filter((c) => !c.contracted);
  const asistentes = contratadas.reduce((n, c) => n + c.participants.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title={company.name}
        subtitle={
          company.contractSessions
            ? `${contratadas.length} de ${company.contractSessions} capacitaciones dictadas`
            : `${contratadas.length} ${contratadas.length === 1 ? 'capacitación dictada' : 'capacitaciones dictadas'}`
        }
        back={{ href: '/admin/empresas', label: 'Empresas' }}
      >
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto flex max-w-[900px] flex-col gap-5 px-4 py-8 sm:px-6">
        {(creada || guardada) && (
          <p className="rounded-[10px] bg-accent-soft px-4 py-2.5 text-[13px] text-accent">
            {creada
              ? 'Empresa creada. Entrégale la clave de abajo a su responsable.'
              : 'Cambios guardados.'}
          </p>
        )}

        {/* ------------------------------------------------------- panel */}
        <section className="rounded-card border border-line bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[15.5px] font-semibold tracking-tight">
                Clave del panel
              </h2>
              <p className="mt-0.5 max-w-[60ch] text-[12.5px] leading-relaxed text-faint">
                Con esta clave sus responsables entran en{' '}
                <Link href="/empresa" className="font-medium text-primary">
                  /empresa
                </Link>{' '}
                y ven a su gente y el avance de cada uno. Solo aparecen las capacitaciones marcadas
                como dictadas bajo contrato, y el teléfono de los asistentes no se muestra.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-[10px] bg-surface-2 px-3 py-2 font-mono text-[16px] tracking-[0.14em] ${
                  company.panelActive ? 'text-text' : 'text-faint line-through'
                }`}
              >
                {company.panelKey}
              </span>
              <form action={rotatePanelKey}>
                <input type="hidden" name="id" value={company.id} />
                <button
                  type="submit"
                  className="rounded-[10px] border border-line px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  Rotar
                </button>
              </form>
              <form action={toggleCompanyPanel}>
                <input type="hidden" name="id" value={company.id} />
                <button
                  type="submit"
                  className="rounded-[10px] border border-line px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  {company.panelActive ? 'Apagar panel' : 'Encender panel'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- capacitaciones */}
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">
              Capacitaciones
            </h2>
            <span className="text-[12.5px] text-faint">
              {asistentes} {asistentes === 1 ? 'asistente' : 'asistentes'} en total
            </span>
            <Link
              href="/admin/accesos/nuevo"
              className="ml-auto rounded-[10px] border border-line px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
            >
              Nueva capacitación
            </Link>
          </div>

          {company.accessCodes.length === 0 ? (
            <p className="px-5 py-4 text-[13px] leading-relaxed text-faint">
              Todavía no hay capacitaciones de esta empresa. Crea el PIN, marca que la dictas en su
              nombre y elígela como contratante.
            </p>
          ) : (
            <ul>
              {[...contratadas, ...sueltas].map((code) => (
                <li
                  key={code.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line px-5 py-3 last:border-0"
                >
                  <span className="font-mono text-[15px] font-semibold tracking-[0.14em] text-muted">
                    {code.code}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">
                    {code.label}
                  </span>
                  {!code.contracted && (
                    <span
                      className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-faint"
                      title="No está marcada como dictada bajo contrato, así que no sale en el panel de la empresa."
                    >
                      Fuera del panel
                    </span>
                  )}
                  <span className="text-[12px] text-faint">
                    {code.participants.length}{' '}
                    {code.participants.length === 1 ? 'asistente' : 'asistentes'}
                  </span>
                  <span className="text-[12px] text-faint">{fecha.format(code.createdAt)}</span>
                  <Link
                    href={`/admin/accesos/${code.id}`}
                    className="rounded-md bg-surface-2 px-2.5 py-1 text-[12.5px] font-medium text-text transition-colors hover:bg-primary-soft hover:text-primary"
                  >
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <CompanyForm
          action={updateCompany}
          mode="edit"
          id={company.id}
          defaults={{
            name: company.name,
            industry: company.industry ?? '',
            kind: company.kind,
            logo: company.logo ?? '',
            materialsUntil: toDateInput(company.materialsUntil),
            contractRef: company.contractRef ?? '',
            contractStart: toDateInput(company.contractStart),
            contractEnd: toDateInput(company.contractEnd),
            contractSessions: company.contractSessions ? String(company.contractSessions) : '',
            contractNotes: company.contractNotes ?? '',
            notes: company.notes ?? '',
            contacts: company.contacts.map((c) => ({
              name: c.name,
              role: c.role ?? '',
              email: c.email ?? '',
              phone: c.phone ?? '',
            })),
          }}
        />

        <form action={deleteCompany} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={company.id} />
          <button
            type="submit"
            className="rounded-[10px] border border-line px-3 py-2 text-[12.5px] font-medium text-faint transition-colors hover:border-[#c2410c] hover:text-[#c2410c]"
          >
            Borrar empresa
          </button>
          <span className="text-[12px] text-faint">
            Sus capacitaciones y sus asistentes quedan intactos: solo dejan de colgar de un
            contrato, y el panel deja de existir.
          </span>
        </form>
      </main>
    </div>
  );
}
