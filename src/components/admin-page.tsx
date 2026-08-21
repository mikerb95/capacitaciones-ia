import Link from 'next/link';
import { AdminLogoutButton } from './admin-logout-button';
import { ThemeToggle } from './theme-toggle';

/**
 * Encabezado y cuerpo de una pantalla del panel. El sidebar lo pone el layout
 * de `(panel)`, así que aquí solo va lo de la pantalla: su título, sus
 * acciones y el ancho en que se lee cómodo su contenido.
 */
export function AdminPage({
  title,
  subtitle,
  back,
  actions,
  max = 1100,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Solo en las pantallas de detalle: el sidebar ya cubre la vuelta al nivel de arriba. */
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  max?: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur lg:top-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            {back && (
              <Link
                href={back.href}
                className="mb-0.5 inline-flex items-center gap-1.5 text-[12.5px] text-faint transition-colors hover:text-primary"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M13 8H3M7.5 3.5 3 8l4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {back.label}
              </Link>
            )}
            <h1 className="truncate font-display text-[17px] font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="truncate text-[12.5px] text-faint">{subtitle}</p>}
          </div>
          <div className="no-print flex items-center gap-2">
            {actions}
            <ThemeToggle />
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full px-4 py-8 sm:px-6" style={{ maxWidth: max }}>
        {children}
      </main>
    </>
  );
}

/** Botón de acción del encabezado, en sus dos pesos. */
export function AdminAction({
  href,
  primary,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? 'whitespace-nowrap rounded-[10px] bg-primary px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90'
          : 'whitespace-nowrap rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text'
      }
    >
      {children}
    </Link>
  );
}
