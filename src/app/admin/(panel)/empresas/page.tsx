import Link from 'next/link';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { SiteHeader } from '@/components/ui';
import { getCompanies, type CompanyRow } from '@/db/queries';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Empresas · Academia IA' };

const dia = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });

/** Ventana del contrato en una línea, con lo que haya. */
function contractWindow(company: CompanyRow) {
  const { contractStart: from, contractEnd: to } = company;
  if (from && to) return `${dia.format(from)} a ${dia.format(to)}`;
  if (from) return `Desde ${dia.format(from)}`;
  if (to) return `Hasta ${dia.format(to)}`;
  return null;
}

/** Etiqueta del tipo, solo cuando dice algo: casi todas son clientes. */
const KIND_LABEL: Record<CompanyRow['kind'], string | null> = {
  cliente: null,
  capacitadora: 'Capacitadora',
  ambas: 'Cliente y capacitadora',
};

function CompanyCard({ company }: { company: CompanyRow }) {
  const contratadas = company.accessCodes.filter((c) => c.contracted);
  const intermediadas = company.brokeredCodes.filter((c) => c.contracted);
  const asistentes = [...contratadas, ...intermediadas].reduce(
    (n, c) => n + c.participants.length,
    0,
  );
  const kind = KIND_LABEL[company.kind];
  const window = contractWindow(company);
  const lead = company.contacts[0];

  return (
    <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card transition-colors hover:border-primary">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${company.panelActive ? 'bg-accent' : 'bg-faint'}`}
            />
            <h2 className="truncate font-display text-[15.5px] font-semibold tracking-tight">
              {company.name}
            </h2>
            {company.industry && (
              <span className="text-[12px] text-faint">{company.industry}</span>
            )}
            {kind && (
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                {kind}
              </span>
            )}
          </div>

          <p className="mt-1 text-[12.5px] text-faint">
            {contratadas.length}{' '}
            {contratadas.length === 1
              ? 'capacitación bajo contrato'
              : 'capacitaciones bajo contrato'}
            {intermediadas.length > 0 ? ` · ${intermediadas.length} para sus clientes` : ''}
            {' · '}
            {asistentes} {asistentes === 1 ? 'asistente' : 'asistentes'}
            {company.contractSessions ? ` · ${company.contractSessions} contratadas` : ''}
            {window ? ` · ${window}` : ''}
          </p>

          {lead && (
            <p className="mt-0.5 truncate text-[12.5px] text-muted">
              {[lead.name, lead.role, lead.email].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-[10px] px-2.5 py-1.5 font-mono text-[12.5px] tracking-[0.12em] ${
              company.panelActive ? 'bg-surface-2 text-text' : 'bg-surface-2 text-faint line-through'
            }`}
            title="Clave del panel de la empresa"
          >
            {company.panelKey}
          </span>
          <Link
            href={`/admin/empresas/${company.id}`}
            className="rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-text transition-colors hover:bg-primary-soft hover:text-primary"
          >
            Abrir
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function EmpresasPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Empresas"
        subtitle="Las que reciben tus capacitaciones y las que te subcontratan para dárselas a sus clientes, con su contrato, sus responsables y la clave de su panel."
        back={{ href: '/admin', label: 'Administrar contenido' }}
      >
        <Link
          href="/admin/accesos"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Códigos de acceso
        </Link>
        <Link
          href="/admin/empresas/nueva"
          className="rounded-[10px] bg-primary px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Nueva empresa
        </Link>
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        {companies.length === 0 ? (
          <p className="rounded-card border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-muted">
            Aún no hay empresas.{' '}
            <Link href="/admin/empresas/nueva" className="font-medium text-primary">
              Crea la primera
            </Link>
            : con ella cargas el contrato, sus responsables y la clave con la que entran a ver a su
            gente y el avance de cada uno.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
