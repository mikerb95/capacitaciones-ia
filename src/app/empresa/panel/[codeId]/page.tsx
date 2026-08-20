import { notFound } from 'next/navigation';
import { Abbr, ProgressBar, SiteHeader } from '@/components/ui';
import { moduleLogo } from '@/lib/brand-logos';
import { QuestionList } from '@/components/question-list';
import {
  getComparison,
  getCompanyTrainings,
  getTrainingQuestions,
  getTrainingSessions,
} from '@/db/queries';
import { requireCompany } from '@/lib/company-access';
import { progressLabel, progressOf, scopeSetOf } from '@/lib/progress';
import { leaveCompanyPanel } from '../../actions';
import { counterpart } from '../counterpart';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ codeId: string }> };

const fecha = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });
const fechaHora = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export async function generateMetadata({ params }: Props) {
  const { codeId } = await params;
  const company = await requireCompany();
  const training = (await getCompanyTrainings(company.id)).find((t) => t.id === Number(codeId));
  return { title: training ? `${training.label} · ${company.name}` : 'Capacitación · Academia IA' };
}

export default async function CompanyTrainingPage({ params }: Props) {
  const { codeId } = await params;
  const company = await requireCompany();

  const [trainings, platforms] = await Promise.all([
    getCompanyTrainings(company.id),
    getComparison(),
  ]);

  // Solo se llega a las capacitaciones de la propia empresa: el id de la URL se
  // busca dentro de las suyas, nunca contra la tabla entera.
  const training = trainings.find((t) => t.id === Number(codeId));
  if (!training) notFound();

  const [sessions, questions] = await Promise.all([
    getTrainingSessions(training.id),
    getTrainingQuestions(training.id),
  ]);

  const catalog = new Set(platforms.flatMap((p) => p.modules.map((m) => m.id)));
  const scopeIds = scopeSetOf(training.scope, catalog);

  const catalogIndex = new Map(
    platforms.flatMap((p) =>
      p.modules.map((m) => [m.id, { ...m, platform: p.name, platformId: p.id }] as const),
    ),
  );

  // El avance se mira como grupo, no persona por persona: el panel responde
  // "cuánto recorrió el equipo", no "quién hizo la tarea".
  const viewedInScope = training.participants.flatMap((p) =>
    p.views.filter((v) => scopeIds.has(v.moduleId)),
  );

  const groupProgress = progressOf(
    [...new Set(viewedInScope.map((v) => v.moduleId))],
    scopeIds,
  );

  const lastActivity = viewedInScope.reduce<Date | null>(
    (latest, v) => (!latest || v.lastSeenAt > latest ? v.lastSeenAt : latest),
    null,
  );

  // Cuánta gente abrió cada módulo del alcance: dónde prendió y dónde no.
  const adoption = [...scopeIds]
    .map((moduleId) => {
      const info = catalogIndex.get(moduleId);
      const count = training.participants.filter((p) =>
        p.views.some((v) => v.moduleId === moduleId),
      ).length;
      return info ? { ...info, count } : null;
    })
    .filter((m) => m !== null)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const gente = training.participants.length;
  const sinResponder = questions.filter((q) => q.status === 'abierta').length;

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title={training.label}
        subtitle={[company.name, counterpart(training, company.id), fecha.format(training.createdAt)]
          .filter(Boolean)
          .join(' · ')}
        back={{ href: '/empresa/panel', label: 'Todas tus capacitaciones' }}
      >
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
        {/* ------------------------------------------------- la asistencia */}
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">Asistencia</h2>
            <span className="text-[12.5px] text-faint">
              quién siguió cada sesión en vivo desde su dispositivo
            </span>
          </div>

          {sessions.length === 0 ? (
            <p className="px-5 py-4 text-[13px] leading-relaxed text-faint">
              Todavía no hay sesiones en vivo con asistentes de esta capacitación.
            </p>
          ) : (
            <ul>
              {sessions.map((session) => (
                <li key={session.id} className="border-b border-line px-5 py-4 last:border-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[14px] font-medium">{session.title}</span>
                    <span className="text-[12px] text-faint">
                      {fechaHora.format(session.startedAt)}
                      {session.endedAt ? '' : ' · en curso'}
                    </span>
                    <span className="ml-auto text-[12.5px] text-muted">
                      {session.people.length}{' '}
                      {session.people.length === 1 ? 'asistente' : 'asistentes'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {session.people.map((person) => (
                      <span
                        key={person.name}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-[12.5px] text-muted"
                      >
                        {person.name}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ------------------------------------------------ avance del grupo */}
        <section className="rounded-card border border-line bg-surface px-5 py-4 shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">
              Avance del grupo
            </h2>
            <span className="text-[12.5px] text-faint">
              {gente} {gente === 1 ? 'persona entró' : 'personas entraron'} al material
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[13px] text-muted">
              {progressLabel(groupProgress)}
              {lastActivity ? ` · última visita ${fechaHora.format(lastActivity)}` : ''}
            </span>
            <ProgressBar percent={groupProgress.percent} />
          </div>
        </section>

        {/* ------------------------------------------------- las preguntas */}
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">Preguntas</h2>
            <span className="text-[12.5px] text-faint">
              lo que dejó anotado tu gente durante la capacitación
            </span>
            {sinResponder > 0 && (
              <span className="ml-auto rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] text-muted">
                {sinResponder} sin responder
              </span>
            )}
          </div>

          <QuestionList
            questions={questions}
            empty="Todavía nadie dejó una pregunta en esta capacitación."
          />
        </section>

        {/* -------------------------------------------------- los módulos */}
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">
              Qué material recorrieron
            </h2>
            <span className="text-[12.5px] text-faint">
              cuánta gente abrió cada módulo de los que cubría la capacitación
            </span>
          </div>

          <ul>
            {adoption.map((mod) => (
              <li
                key={mod.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-5 py-3 last:border-0"
              >
                <Abbr
                  abbr={mod.abbr}
                  color={mod.color}
                  logo={moduleLogo(mod.platformId, mod.slug)}
                />
                <div className="min-w-[180px] flex-1">
                  <div className="truncate text-[13.5px] font-medium">{mod.name}</div>
                  <div className="text-[12px] text-faint">{mod.platform}</div>
                </div>
                <span className="text-[12.5px] text-muted">
                  {mod.count} de {gente}
                </span>
                <ProgressBar
                  percent={gente === 0 ? 0 : Math.round((mod.count / gente) * 100)}
                  width={80}
                />
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[12px] leading-relaxed text-faint">
          La asistencia es la que cada quien declaró al entrar con su nombre: no pedimos ni
          guardamos correo ni teléfono de tu gente, así que tómala como un registro de presencia,
          no como una verificación de identidad. El avance cuenta los módulos que el grupo abrió en
          el portal, sin atribuirlos a nadie en particular. Las preguntas marcadas como anónimas
          lo son de verdad: no guardamos quién las escribió, ni aquí ni en ningún otro lado.
        </p>
      </main>
    </div>
  );
}
