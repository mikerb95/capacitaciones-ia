'use client';

import { useActionState, useState } from 'react';
import type { CompanyAction, CompanyState } from '@/app/admin/empresas/actions';
import type { CompanyKind } from '@/db/schema';
import { Field, FormError, Step, field } from './form-kit';

export type ContactDefaults = {
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type CompanyDefaults = {
  name: string;
  industry: string;
  kind: CompanyKind;
  /** El logo que ya tiene guardado, como `data:` URI. */
  logo: string;
  materialsUntil: string;
  contractRef: string;
  contractStart: string;
  contractEnd: string;
  contractSessions: string;
  contractNotes: string;
  notes: string;
  contacts: ContactDefaults[];
};

const EMPTY_CONTACT: ContactDefaults = { name: '', role: '', email: '', phone: '' };

const EMPTY: CompanyDefaults = {
  name: '',
  industry: '',
  kind: 'cliente',
  logo: '',
  materialsUntil: '',
  contractRef: '',
  contractStart: '',
  contractEnd: '',
  contractSessions: '',
  contractNotes: '',
  notes: '',
  contacts: [EMPTY_CONTACT],
};

const KINDS: { value: CompanyKind; title: string; hint: string }[] = [
  {
    value: 'cliente',
    title: 'Cliente',
    hint: 'Su gente recibe las capacitaciones.',
  },
  {
    value: 'capacitadora',
    title: 'Capacitadora',
    hint: 'Te contrata para dictárselas a sus clientes.',
  },
  {
    value: 'ambas',
    title: 'Las dos cosas',
    hint: 'Unas veces capacita a su gente, otras te subcontrata.',
  },
];

/**
 * El logo del cliente, que es lo que después lleva su material a medida. Se
 * previsualiza al escogerlo porque un logo equivocado no se nota hasta que
 * sale impreso en catorce documentos.
 */
function LogoField({ current }: { current: string }) {
  const [preview, setPreview] = useState(current);
  const [remove, setRemove] = useState(false);

  return (
    <div className="flex items-start gap-4">
      <span className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-[10px] border border-line bg-surface-2">
        {preview && !remove ? (
          // eslint-disable-next-line @next/next/no-img-element -- es un data: URI o un blob: local
          <img src={preview} alt="" className="max-h-12 max-w-12 object-contain" />
        ) : (
          <span className="text-[10px] text-faint">sin logo</span>
        )}
      </span>

      <div className="flex flex-col gap-2">
        <input
          type="file"
          name="logo"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          disabled={remove}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="text-[12.5px] text-muted file:mr-3 file:rounded-[8px] file:border file:border-line file:bg-surface-2 file:px-3 file:py-1.5 file:text-[12.5px] file:font-medium file:text-ink"
        />
        <p className="text-[11.5px] text-faint">
          PNG, JPG, WEBP o SVG, hasta 512 KB. Sale en la cabecera de su material junto al logo de
          la herramienta.
        </p>

        {current && (
          <label className="flex items-center gap-2 text-[12px] text-muted">
            <input
              type="checkbox"
              name="logoRemove"
              checked={remove}
              onChange={(e) => setRemove(e.target.checked)}
            />
            Quitar el logo guardado
          </label>
        )}
      </div>
    </div>
  );
}

export function CompanyForm({
  action,
  defaults = EMPTY,
  mode,
  id,
}: {
  action: CompanyAction;
  defaults?: CompanyDefaults;
  mode: 'create' | 'edit';
  id?: number;
}) {
  const [state, formAction, pending] = useActionState<CompanyState, FormData>(action, {});
  const [kind, setKind] = useState<CompanyKind>(defaults.kind);
  // Una fila en blanco de arranque: pedir "agregar contacto" antes de poder
  // escribir el primero es un clic de más en el caso normal.
  const [contacts, setContacts] = useState<ContactDefaults[]>(
    defaults.contacts.length ? defaults.contacts : [EMPTY_CONTACT],
  );

  const patch = (i: number, key: keyof ContactDefaults, value: string) =>
    setContacts((current) => current.map((c, j) => (i === j ? { ...c, [key]: value } : c)));

  const remove = (i: number) =>
    setContacts((current) => {
      const next = current.filter((_, j) => j !== i);
      return next.length ? next : [EMPTY_CONTACT];
    });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {id && <input type="hidden" name="id" value={id} />}

      <Step
        number={1}
        title="La empresa"
        intro="El nombre con el que la reconoces y con el que aparece en su panel."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <input
              name="name"
              required
              defaultValue={defaults.name}
              aria-invalid={state.field === 'name'}
              placeholder="Ferretería del Norte S.A.S."
              className={field}
            />
          </Field>

          <Field label="Sector" hint="opcional">
            <input
              name="industry"
              defaultValue={defaults.industry}
              placeholder="Retail, salud, logística..."
              className={field}
            />
          </Field>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            {/* Sin <Field>: adentro hay botones, no un solo control al que
                pueda apuntar una etiqueta. */}
            <span className="text-[12.5px] font-medium text-muted">De qué lado está</span>
            <input type="hidden" name="kind" value={kind} />
            <div className="grid gap-2 sm:grid-cols-3">
              {KINDS.map((option) => {
                const active = kind === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setKind(option.value)}
                    aria-pressed={active}
                    className={`rounded-[10px] border px-3.5 py-3 text-left transition-colors ${
                      active
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-line bg-surface text-muted hover:border-primary'
                    }`}
                  >
                    <span className="block text-[13px] font-semibold">{option.title}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug opacity-80">
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-[11.5px] leading-relaxed text-faint">
              Recorta los selectores al crear un código: en el de la capacitadora solo salen las
              intermediarias, y en el de quien recibe solo las que capacitan a su propia gente.
            </span>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            {/* Sin <Field>: adentro hay un checkbox con su propia etiqueta y las
                etiquetas no se pueden anidar. */}
            <span className="text-[12.5px] font-medium text-muted">
              Logo <span className="ml-1 font-normal text-faint">opcional</span>
            </span>
            <LogoField current={defaults.logo} />
          </div>
        </div>
      </Step>

      <Step
        number={2}
        title="El contrato"
        intro="Bajo qué acuerdo dictas para ellos. Todo opcional: sirve para ubicarte meses después y para saber cuánto queda por dictar."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Referencia" hint="opcional">
            <input
              name="contractRef"
              defaultValue={defaults.contractRef}
              placeholder="Contrato 2026-014, orden de compra..."
              className={field}
            />
          </Field>

          <Field label="Capacitaciones contratadas" hint="opcional">
            <input
              name="contractSessions"
              inputMode="numeric"
              defaultValue={defaults.contractSessions}
              placeholder="8"
              className={field}
            />
          </Field>

          <Field label="Desde" hint="opcional">
            <input
              name="contractStart"
              type="date"
              defaultValue={defaults.contractStart}
              aria-invalid={state.field === 'contract'}
              className={field}
            />
          </Field>

          <Field label="Hasta" hint="opcional">
            <input
              name="contractEnd"
              type="date"
              defaultValue={defaults.contractEnd}
              aria-invalid={state.field === 'contract'}
              className={field}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Material a medida vigente hasta" hint="opcional">
              <input
                name="materialsUntil"
                type="date"
                defaultValue={defaults.materialsUntil}
                aria-invalid={state.field === 'materials'}
                className={field}
              />
              <span className="text-[11.5px] text-faint">
                Hasta esta fecha su gente descarga el material con la marca y los casos de la
                empresa. Después vuelve al material genérico.
              </span>
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Detalles del contrato" hint="opcional">
              <textarea
                name="contractNotes"
                rows={3}
                defaultValue={defaults.contractNotes}
                placeholder="Alcance acordado, sedes, tarifa, condiciones de facturación."
                className={`${field} resize-y`}
              />
            </Field>
          </div>
        </div>
      </Step>

      <Step
        number={3}
        title="Responsables"
        intro="Quién responde de su lado. El primero es el contacto principal, el que recibe la clave del panel."
      >
        <div className="flex flex-col gap-3">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-line bg-surface-2 p-3.5"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
                  {i === 0 ? 'Principal' : `Contacto ${i + 1}`}
                </span>
                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="ml-auto rounded-md border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-faint transition-colors hover:border-[#c2410c] hover:text-[#c2410c]"
                  >
                    Quitar
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="contactName"
                  value={contact.name}
                  onChange={(e) => patch(i, 'name', e.target.value)}
                  aria-label="Nombre del responsable"
                  placeholder="Nombre y apellido"
                  className={field}
                />
                <input
                  name="contactRole"
                  value={contact.role}
                  onChange={(e) => patch(i, 'role', e.target.value)}
                  aria-label="Cargo"
                  placeholder="Jefa de talento humano"
                  className={field}
                />
                <input
                  name="contactEmail"
                  type="email"
                  value={contact.email}
                  onChange={(e) => patch(i, 'email', e.target.value)}
                  aria-label="Correo"
                  aria-invalid={state.field === 'contacts'}
                  placeholder="nombre@empresa.com"
                  className={field}
                />
                <input
                  name="contactPhone"
                  value={contact.phone}
                  onChange={(e) => patch(i, 'phone', e.target.value)}
                  aria-label="Teléfono"
                  placeholder="+57 300 000 0000"
                  className={field}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setContacts((current) => [...current, EMPTY_CONTACT])}
            className="self-start rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Agregar responsable
          </button>
        </div>
      </Step>

      <Step number={4} title="Notas" intro="Lo que convenga recordar de esta cuenta. No sale en su panel.">
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults.notes}
          placeholder="Cómo llegaron, con quién hablas, qué esperan de las sesiones."
          className={`${field} resize-y`}
        />
      </Step>

      {state.error && <FormError>{state.error}</FormError>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Guardando...' : mode === 'create' ? 'Crear empresa' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
