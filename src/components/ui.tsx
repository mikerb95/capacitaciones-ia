import Link from 'next/link';
import type { Level } from '@/db/schema';
import { ThemeToggle } from './theme-toggle';

/** Insignia de nivel. El color viene del nivel, no de la plataforma. */
export function LevelBadge({ level }: { level: Level }) {
  const tone: Record<Level, string> = {
    Básico: 'bg-accent-soft text-accent',
    Intermedio: 'bg-primary-soft text-primary',
    Avanzado: 'bg-[color-mix(in_srgb,var(--tone)_14%,transparent)] text-[var(--tone)]',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[level]}`}
    >
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label: Record<string, string> = {
    completo: 'Completo',
    'en-redaccion': 'En redacción',
    borrador: 'Borrador',
    publicado: 'Publicado',
  };
  const tone: Record<string, string> = {
    completo: 'bg-accent-soft text-accent',
    publicado: 'bg-accent-soft text-accent',
    'en-redaccion': 'bg-[#fdebe2] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]',
    borrador: 'bg-surface-2 text-faint',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[status] ?? tone.borrador}`}
    >
      {label[status] ?? status}
    </span>
  );
}

/** Cuadrito con las iniciales del módulo, teñido con su color. */
export function Abbr({ abbr, color, size = 26 }: { abbr: string; color: string; size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-[7px] font-mono text-[10px] font-semibold"
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      {abbr}
    </span>
  );
}

export function PlatformMark({
  initial,
  color,
  size = 34,
}: {
  initial: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="grid flex-none place-items-center rounded-[10px] font-display font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
}

export function SiteHeader({
  title,
  subtitle,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
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
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function SectionTitle({
  kicker,
  title,
  intro,
}: {
  kicker?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-4">
      {kicker && (
        <div className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
          {kicker}
        </div>
      )}
      <h2 className="font-display text-[20px] font-semibold tracking-tight">{title}</h2>
      {intro && <p className="mt-1 max-w-[70ch] text-[14px] leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function Card({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-5 shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
