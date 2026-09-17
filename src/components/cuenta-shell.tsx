export function CuentaHeading({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 text-center">
      <h1 className="font-display text-[27px] font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

export function CuentaCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-card border border-line bg-surface p-6 shadow-card">{children}</div>;
}

export function CuentaFooter({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 flex flex-col gap-1.5 text-center text-[12.5px] leading-relaxed text-faint">
      {children}
    </p>
  );
}

export const footerLink =
  'font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-primary';
