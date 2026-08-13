import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionTitle, SiteHeader } from '@/components/ui';
import { getModuleById, getPlatformIds } from '@/db/queries';
import { deleteModule, saveModule } from '../../actions';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

const LEVELS = ['Básico', 'Intermedio', 'Avanzado'] as const;

const inputClass =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[13.5px] text-text outline-none transition-colors placeholder:text-faint focus:border-primary';

function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-[12.5px] font-medium text-muted">
        {label}
        {hint && <span className="ml-1.5 font-normal text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export default async function ModuleFormPage({ params }: Params) {
  const { id } = await params;
  const isNew = id === 'new';
  const mod = isNew ? null : await getModuleById(Number(id));
  const platforms = await getPlatformIds();

  if (!isNew && !mod) notFound();

  const outcomes = (mod?.outcomes ?? []).map((o) => o.text).join('\n');
  const prompts = (mod?.prompts ?? []).map((p) => `${p.tag} | ${p.text}`).join('\n');
  const steps = (mod?.steps ?? []).map((s) => `${s.title} | ${s.description}`).join('\n');
  const roles = (mod?.roles ?? []).map((r) => `${r.role} | ${r.task} | ${r.detail}`).join('\n');
  const mistakes = (mod?.mistakes ?? []).map((m) => `${m.bad} | ${m.good}`).join('\n');

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title={isNew ? 'Nuevo módulo' : `Editar: ${mod!.name}`}
        subtitle={isNew ? undefined : mod!.platform.name}
        back={{ href: '/admin', label: 'Volver al listado' }}
      />

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <form action={saveModule} className="flex flex-col gap-8">
          {mod && <input type="hidden" name="id" value={mod.id} />}

          <section>
            <SectionTitle kicker="Identidad" title="Lo que se ve en la comparativa" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Plataforma">
                <select
                  name="platformId"
                  defaultValue={mod?.platformId ?? platforms[0]?.id}
                  className={inputClass}
                  required
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Slug" hint="único dentro de la plataforma">
                <input
                  name="slug"
                  defaultValue={mod?.slug ?? ''}
                  className={inputClass}
                  placeholder="artifacts"
                  pattern="[a-z0-9\-]+"
                  required
                />
              </Field>
              <Field label="Nombre">
                <input name="name" defaultValue={mod?.name ?? ''} className={inputClass} required />
              </Field>
              <Field label="Nombre corto" hint="para el menú lateral">
                <input name="shortName" defaultValue={mod?.shortName ?? ''} className={inputClass} />
              </Field>
              <Field label="Sigla" hint="dos letras">
                <input
                  name="abbr"
                  defaultValue={mod?.abbr ?? ''}
                  maxLength={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Color">
                <input
                  name="color"
                  type="color"
                  defaultValue={mod?.color ?? '#3B5BDB'}
                  className="h-[38px] w-full cursor-pointer rounded-[10px] border border-line bg-surface px-1.5"
                />
              </Field>
              <Field label="Nivel">
                <select name="level" defaultValue={mod?.level ?? 'Básico'} className={inputClass}>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Categoría" hint="opcional">
                <input
                  name="category"
                  defaultValue={mod?.category ?? ''}
                  className={inputClass}
                  placeholder="Documentos"
                />
              </Field>
              <Field label="Meta" hint="ej: 5 prompts · 30 min">
                <input name="meta" defaultValue={mod?.meta ?? ''} className={inputClass} />
              </Field>
              <Field label="Estado">
                <select name="status" defaultValue={mod?.status ?? 'publicado'} className={inputClass}>
                  <option value="publicado">Publicado</option>
                  <option value="borrador">Borrador</option>
                </select>
              </Field>
              <Field label="Descripción corta" hint="la que sale en la card" wide>
                <textarea
                  name="summary"
                  defaultValue={mod?.summary ?? ''}
                  rows={2}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Introducción" wide>
                <textarea
                  name="intro"
                  defaultValue={mod?.intro ?? ''}
                  rows={3}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section>
            <SectionTitle
              kicker="Contenido"
              title="Listas del módulo"
              intro="Un ítem por línea. Los campos de una misma línea van separados por el carácter |"
            />
            <div className="grid gap-4">
              <Field label="Objetivos" hint="un objetivo por línea">
                <textarea name="outcomes" defaultValue={outcomes} rows={3} className={inputClass} />
              </Field>
              <Field label="Prompts" hint="etiqueta | texto del prompt">
                <textarea name="prompts" defaultValue={prompts} rows={6} className={inputClass} />
              </Field>
              <Field label="Paso a paso" hint="título | descripción">
                <textarea name="steps" defaultValue={steps} rows={5} className={inputClass} />
              </Field>
              <Field label="Casos por área" hint="área | caso de uso | detalle">
                <textarea name="roles" defaultValue={roles} rows={4} className={inputClass} />
              </Field>
              <Field label="Errores frecuentes" hint="así no | así sí">
                <textarea name="mistakes" defaultValue={mistakes} rows={4} className={inputClass} />
              </Field>
            </div>
          </section>

          <section>
            <SectionTitle kicker="El caso" title="Antes y después" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contexto del caso" wide>
                <textarea
                  name="baIntro"
                  defaultValue={mod?.baIntro ?? ''}
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <Field label="Cómo se hace hoy">
                <textarea
                  name="before"
                  defaultValue={mod?.before ?? ''}
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Con la herramienta">
                <textarea
                  name="after"
                  defaultValue={mod?.after ?? ''}
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Costo actual" hint="ej: dos días de espera">
                <input
                  name="beforeTime"
                  defaultValue={mod?.beforeTime ?? ''}
                  className={inputClass}
                />
              </Field>
              <Field label="Costo nuevo" hint="ej: una sesión de trabajo">
                <input
                  name="afterTime"
                  defaultValue={mod?.afterTime ?? ''}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section>
            <SectionTitle kicker="Ejemplo" title="Conversación de muestra" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título del ejemplo">
                <input
                  name="mockTitle"
                  defaultValue={mod?.mockTitle ?? ''}
                  className={inputClass}
                />
              </Field>
              <Field label="Título del panel">
                <input
                  name="mockPanelTitle"
                  defaultValue={mod?.mockPanelTitle ?? ''}
                  className={inputClass}
                />
              </Field>
              <Field label="Mensaje del usuario">
                <textarea
                  name="mockPrompt"
                  defaultValue={mod?.mockPrompt ?? ''}
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Respuesta de la IA">
                <textarea
                  name="mockReply"
                  defaultValue={mod?.mockReply ?? ''}
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Contenido del panel" hint="se respetan los saltos de línea" wide>
                <textarea
                  name="mockPanel"
                  defaultValue={mod?.mockPanel ?? ''}
                  rows={4}
                  className={`${inputClass} font-mono`}
                />
              </Field>
            </div>
          </section>

          <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] py-4 backdrop-blur">
            <button
              type="submit"
              className="rounded-[10px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Guardar módulo
            </button>
            <Link
              href="/admin"
              className="rounded-[10px] border border-line px-4 py-2.5 text-[13.5px] font-medium text-muted transition-colors hover:text-text"
            >
              Cancelar
            </Link>
          </div>
        </form>

        {mod && (
          <form action={deleteModule} className="mt-8 border-t border-line pt-6">
            <input type="hidden" name="id" value={mod.id} />
            <input type="hidden" name="platformId" value={mod.platformId} />
            <button
              type="submit"
              className="rounded-[10px] border border-line px-3.5 py-2 text-[13px] font-medium text-muted transition-colors hover:border-[#c2410c] hover:text-[#c2410c]"
            >
              Eliminar este módulo
            </button>
            <p className="mt-2 text-[12.5px] text-faint">
              Se borra el módulo con todas sus listas. Si está en el seed, vuelve a aparecer al
              correr <code className="font-mono">npm run db:seed</code>.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
