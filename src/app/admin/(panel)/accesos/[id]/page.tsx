import { notFound } from 'next/navigation';
import { AccessCodeForm } from '@/components/access-code-form';
import { field } from '@/components/form-kit';
import { QuestionList } from '@/components/question-list';
import { AdminPage } from '@/components/admin-page';
import { getAccessCode, getCompanyOptions, getTrainingQuestions } from '@/db/queries';
import { answerQuestion, deleteQuestion, updateAccessCode } from '../actions';
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

          <QuestionList
            questions={questions}
            empty="Nadie preguntó nada con este código todavía."
          >
            {(question) => (
              <div className="mt-3 flex flex-col gap-2">
                <form action={answerQuestion} className="flex flex-col gap-2">
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

                <form action={deleteQuestion}>
                  <input type="hidden" name="id" value={question.id} />
                  <button
                    type="submit"
                    className="text-[12px] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-[#c2410c]"
                  >
                    Borrar pregunta
                  </button>
                </form>
              </div>
            )}
          </QuestionList>
        </section>
      </div>
    </AdminPage>
  );
}
