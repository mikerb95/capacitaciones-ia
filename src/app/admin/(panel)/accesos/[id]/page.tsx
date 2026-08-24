import { notFound } from 'next/navigation';
import { AccessCodeForm } from '@/components/access-code-form';
import { field } from '@/components/form-kit';
import { QuestionList } from '@/components/question-list';
import { AdminPage } from '@/components/admin-page';
import { getAccessCode, getCompanyOptions, getTrainingQuestions } from '@/db/queries';
import { answerInSession, answerQuestion, deleteQuestion, updateAccessCode } from '../actions';
import { getScopeOptions } from '../scope-options';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const code = await getAccessCode(Number(id));
  return { title: code ? `Código ${code.code} · Academia IA` : 'Código · Academia IA' };
}

export default async function EditarAccesoPage({ params }: Props) {
  const { id } = await params;
  const code = await getAccessCode(Number(id));
  if (!code) notFound();

  const [platforms, companies, questions] = await Promise.all([
    getScopeOptions(),
    getCompanyOptions(),
    getTrainingQuestions(code.id),
  ]);

  const sinResponder = questions.filter((q) => q.status === 'abierta').length;

  return (
    <AdminPage
      title={`Código ${code.code}`}
      subtitle={
        code.contractor
          ? `${code.company?.name ?? code.label} · vía ${code.contractor.name}`
          : (code.company?.name ?? code.label)
      }
      back={{ href: '/admin/accesos', label: 'Capacitaciones' }}
      max={900}
    >
      <div className="flex flex-col gap-6">
        <AccessCodeForm
          action={updateAccessCode}
          platforms={platforms}
          companies={companies}
          mode="edit"
          id={code.id}
          defaults={{
            code: code.code,
            label: code.label,
            mode: !code.contracted ? 'propia' : code.contractorId ? 'tercerizada' : 'directa',
            companyId: code.companyId,
            contractorId: code.contractorId,
            notes: code.notes ?? '',
            moduleIds: code.scope.map((s) => s.moduleId),
            planKeys: Object.fromEntries(code.plans.map((p) => [p.platformId, p.plan.key])),
          }}
        />

        {/* ------------------------------------------------ los asistentes */}
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">Asistentes</h2>
            <span className="text-[12.5px] text-faint">
              quiénes entraron con el código y hasta dónde llegó cada uno
            </span>
            {code.participants.length > 0 && (
              <span className="ml-auto flex items-center gap-2.5">
                <span className="text-[12.5px] text-faint">avance del grupo</span>
                <ProgressBar percent={avanceGrupo.percent} />
              </span>
            )}
          </div>

          {code.participants.length === 0 ? (
            <p className="px-5 py-6 text-[13px] leading-relaxed text-faint">
              Todavía no entra nadie con este código. En cuanto alguien lo use, aquí aparece con los
              módulos que va abriendo.
            </p>
          ) : (
            <ul>
              {code.participants.map((p) => {
                const avance = progressOf(
                  p.views.map((v) => v.moduleId),
                  scopeIds,
                );

                return (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-5 py-3 last:border-0"
                  >
                    <span
                      className={`min-w-[140px] flex-1 truncate text-[13.5px] font-medium ${
                        p.name ? '' : 'text-faint'
                      }`}
                    >
                      {p.name ?? 'Sin nombre'}
                    </span>
                    <span className="text-[12px] text-faint" title={progressLabel(avance)}>
                      {avance.done}/{avance.total}
                    </span>
                    <ProgressBar percent={avance.percent} width={72} />
                    <span className="min-w-[128px] text-right text-[12px] text-faint">
                      visto {FECHA.format(p.lastSeenAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ------------------------------------------------- las preguntas */}
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">Preguntas</h2>
            <span className="text-[12.5px] text-faint">
              lo que dejó el grupo en el buzón de esta capacitación
            </span>
            {sinResponder > 0 && (
              <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {sinResponder} sin responder
              </span>
            )}
          </div>

          {/*
            El formulario va por `extras` y no como hijo: `QuestionList` es un
            componente de cliente, y una función de render no cruza esa
            frontera. Por eso llega ya renderizado, en un mapa por id.
          */}
          <QuestionList
            questions={questions}
            empty="Nadie preguntó nada con este código todavía."
            defaultFilter={sinResponder > 0 ? 'abierta' : 'todas'}
            extras={Object.fromEntries(
              questions.map((question) => [
                question.id,
                <div key={question.id}>
                  {/*
                    En vivo casi nunca se escribe la respuesta: se contesta
                    hablando. Por eso este botón va a la vista y no dentro del
                    desplegable, que es donde se responde con calma después.
                  */}
                  {question.status !== 'respondida' && (
                    <form action={answerInSession} className="mt-3">
                      <input type="hidden" name="id" value={question.id} />
                      <button
                        type="submit"
                        className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors ${
                          question.status === 'en_sesion'
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line bg-surface text-muted hover:border-primary hover:text-text'
                        }`}
                      >
                        {question.status === 'en_sesion'
                          ? '✓ Respondida en la sesión'
                          : 'Respondida en la sesión'}
                      </button>
                    </form>
                  )}

                  {/* Plegado: con quince preguntas, quince campos de texto
                      abiertos no dejan leer ninguna. */}
                  <details className="group mt-3">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[12.5px] font-semibold text-primary">
                      <span aria-hidden className="transition-transform group-open:rotate-90">
                        ›
                      </span>
                      {question.answer ? 'Editar respuesta' : 'Responder por escrito'}
                    </summary>

                    <form action={answerQuestion} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="id" value={question.id} />
                      <textarea
                        name="respuesta"
                        rows={2}
                        defaultValue={question.answer ?? ''}
                        className={`${field} resize-y leading-relaxed`}
                        placeholder="Escribe la respuesta que verá quien preguntó"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="submit"
                          className="rounded-[10px] bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
                        >
                          {question.answer ? 'Actualizar respuesta' : 'Responder'}
                        </button>
                        <span className="text-[12px] text-faint">
                          Vaciar el campo la devuelve a pendiente.
                        </span>
                      </div>
                    </form>

                    <form action={deleteQuestion} className="mt-2">
                      <input type="hidden" name="id" value={question.id} />
                      <button
                        type="submit"
                        className="text-[12px] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-[#c2410c]"
                      >
                        Borrar pregunta
                      </button>
                    </form>
                  </details>
                </div>,
              ]),
            )}
          />
        </section>
      </div>
    </AdminPage>
  );
}
