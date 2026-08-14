import type { ReactNode } from 'react';

/** Clase base de los campos del admin, para que todos midan y respiren igual. */
export const field =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14px] outline-none transition-colors placeholder:text-faint focus:border-primary';

/** Bloque numerado de un formulario largo: título, intro y contenido. */
export function Step({
  number,
  title,
  intro,
  children,
}: {
  number: number;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-primary-soft font-mono text-[11.5px] font-semibold text-primary">
          {number}
        </span>
        <div>
          <h2 className="font-display text-[15.5px] font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-faint">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-muted">
        {label}
        {hint && <span className="ml-1 font-normal text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Aviso de error de un formulario, en el tono de alerta del sitio. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-[10px] bg-[#fdebe2] px-4 py-2.5 text-[13px] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]"
    >
      {children}
    </p>
  );
}
