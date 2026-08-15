import Link from 'next/link';
import { ProgressBar, SiteHeader } from '@/components/ui';
import { getComparison, getCompanyTrainings, type CompanyTraining } from '@/db/queries';
import { requireCompany } from '@/lib/company-access';
import { progressOf, scopeSetOf } from '@/lib/progress';
import { leaveCompanyPanel } from '../actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Panel de tu empresa · Academia IA' };

const fecha = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });

function TrainingCard({
  training,
  catalog,
}: {
  training: CompanyTraining;
  catalog: Set<number>;
}) {
  const scopeIds = scopeSetOf(training.scope, catalog);

  // Mismo criterio que el detalle: qué recorrió el grupo, no el promedio por
  // persona. Un módulo cuenta una vez, lo haya abierto uno o veinte.
  const { percent } = progressOf(
    training.participants.flatMap((p) => p.views.map((v) => v.moduleId)),
    scopeIds,
  );

  return (
    <Link
      href={`/empresa/panel/${training.id}`}
      className="block overflow-hidden rounded-card border border-line bg-surface shadow-card transition-colors hover:border-primary"
    >
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${training.active ? 'bg-accent' : 'bg-faint'}`}
            />
            <h2 className="truncate font-display text-[15.5px] font-semibold tracking-tight">
              {training.label}
            </h2>
            {!training.active && (
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-faint">
                Cerrada
              </span>
            )}
          </div>

          <p className="mt-1 text-[12.5px] text-faint">
            {fecha.format(training.createdAt)} · {training.participants.length}{' '}
            {training.participants.length === 1 ? 'asistente' : 'asistentes'} ·{' '}
            {scopeIds.size} {scopeIds.size === 1 ? 'módulo' : 'módulos'}
          </p>

          {training.plans.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {training.plans.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] text-muted"
                >
                  {p.platform.name}
                  <span className="font-semibold text-text">{p.plan.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <ProgressBar percent={percent} />
          <span className="text-[12px] text-faint">avance del grupo</span>
        </div>
      </div>
    </Link>
  );
}

export default async function CompanyPanelPage() {
  const company = await requireCompany();
  const [trainings, platforms] = await Promise.all([
    getCompanyTrainings(company.id),
    getComparison(),
  ]);

  const catalog = new Set(platforms.flatMap((p) => p.modules.map((m) => m.id)));
  const asistentes = trainings.reduce((n, t) => n + t.participants.length, 0);

  const contrato = [
    company.contractRef,
    company.contractStart ? `desde ${fecha.format(company.contractStart)}` : null,
    company.contractEnd ? `hasta ${fecha.format(company.contractEnd)}` : null,
    company.contractSessions
      ? `${trainings.length} de ${company.contractSessions} capacitaciones dictadas`
      : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader title={company.name} subtitle="Panel de seguimiento">
        <form action={leaveCompanyPanel}>
          <button
            type="submit"
            className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
          >
            Salir
          </button>
        </form>
      </SiteHeader>

      <main className="mx-auto flex max-w-[900px] flex-col gap-5 px-4 py-8 sm:px-6">
        <section className="rounded-card border border-line bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <div>
              <div className="font-display text-[26px] font-semibold tracking-tight">
                {trainings.length}
              </div>
              <div className="text-[12.5px] text-faint">
                {trainings.length === 1 ? 'capacitación' : 'capacitaciones'}
              </div>
            </div>
            <div>
              <div className="font-display text-[26px] font-semibold tracking-tight">
                {asistentes}
              </div>
              <div className="text-[12.5px] text-faint">
                {asistentes === 1 ? 'persona registrada' : 'personas registradas'}
              </div>
            </div>

            {contrato.length > 0 && (
              <p className="min-w-[200px] flex-1 text-[12.5px] leading-relaxed text-muted">
                {contrato.join(' · ')}
              </p>
            )}
          </div>

          {company.contractNotes && (
            <p className="mt-4 border-t border-line pt-3.5 text-[13px] leading-relaxed text-muted">
              {company.contractNotes}
            </p>
          )}
        </section>

        {trainings.length === 0 ? (
          <p className="rounded-card border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-muted">
            Todavía no hay capacitaciones registradas a nombre de tu empresa. En cuanto dictemos la
            primera, aquí verás quién se registró y hasta dónde llegó cada quien.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} catalog={catalog} />
            ))}
          </div>
        )}

        <p className="text-[12px] leading-relaxed text-faint">
          El avance cuenta los módulos que el grupo abrió en el portal. Es un indicio de recorrido,
          no una calificación.
        </p>
      </main>
    </div>
  );
}
