'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Comparison } from '@/db/queries';
import type { Level } from '@/db/schema';
import { moduleLogo, platformLogo } from '@/lib/brand-logos';
import { Abbr, LevelBadge, PlatformMark, StatusBadge } from './ui';

const LEVELS: Level[] = ['Básico', 'Intermedio', 'Avanzado'];

type Platform = Comparison[number];
type ModuleCard = Platform['modules'][number];

function ModuleCardLink({ platform, module }: { platform: Platform; module: ModuleCard }) {
  return (
    <Link
      href={`/${platform.id}/${module.slug}`}
      className="tone group block rounded-card border border-line bg-surface p-4 shadow-card transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[var(--tone-soft)] hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tone)]"
      style={{ ['--tone' as string]: module.color }}
    >
      <div className="mb-2 flex items-start gap-2.5">
        <Abbr abbr={module.abbr} color={module.color} logo={moduleLogo(platform.id, module.slug)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="size-1.5 flex-none rounded-full"
              style={{ background: module.color }}
              aria-hidden="true"
            />
            <h3 className="truncate font-display text-[15px] font-semibold tracking-tight">
              {module.name}
            </h3>
          </div>
          {module.meta && <p className="mt-0.5 text-[11.5px] text-faint">{module.meta}</p>}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{module.summary}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <LevelBadge level={module.level} />
        <span className="text-[12px] font-medium text-faint transition-colors group-hover:text-[var(--tone)]">
          Ver módulo
        </span>
      </div>
    </Link>
  );
}

function PlatformHeader({ platform, count }: { platform: Platform; count: number }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-card border border-line bg-surface-2 px-4 py-3">
      <PlatformMark
        initial={platform.initial}
        color={platform.color}
        logo={platformLogo(platform.id)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/${platform.id}`}
            className="truncate font-display text-[15.5px] font-semibold tracking-tight hover:text-primary"
          >
            {platform.name}
          </Link>
          <StatusBadge status={platform.status} />
        </div>
        <p className="text-[12px] text-faint">
          {count} {count === 1 ? 'módulo' : 'módulos'}
        </p>
      </div>
    </div>
  );
}

export function ComparisonView({ platforms }: { platforms: Comparison }) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [active, setActive] = useState(platforms[0]?.id ?? '');

  const filtered = useMemo(
    () =>
      platforms.map((p) => ({
        ...p,
        modules: levels.length
          ? p.modules.filter((m) => levels.includes(m.level))
          : p.modules,
      })),
    [platforms, levels],
  );

  function toggleLevel(level: Level) {
    setLevels((current) =>
      current.includes(level) ? current.filter((l) => l !== level) : [...current, level],
    );
  }

  const activePlatform = filtered.find((p) => p.id === active) ?? filtered[0];

  return (
    <div>
      {/* Filtro por nivel: sirve para acotar la comparativa en vivo */}
      <div className="no-print mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[12.5px] text-faint">Nivel:</span>
        {LEVELS.map((level) => {
          const on = levels.includes(level);
          return (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors ${
                on
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-line bg-surface text-muted hover:border-primary hover:text-text'
              }`}
            >
              {level}
            </button>
          );
        })}
        {levels.length > 0 && (
          <button
            onClick={() => setLevels([])}
            className="ml-1 text-[12.5px] text-faint underline underline-offset-2 hover:text-text"
          >
            Quitar filtro
          </button>
        )}
      </div>

      {/* Tabs: en pantallas chicas se ve una IA a la vez */}
      <div className="no-print mb-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`flex flex-none items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
              p.id === activePlatform?.id
                ? 'border-transparent text-white'
                : 'border-line bg-surface text-muted'
            }`}
            style={p.id === activePlatform?.id ? { background: p.color } : undefined}
          >
            {p.name}
            <span className="text-[11px] opacity-70">{p.modules.length}</span>
          </button>
        ))}
      </div>

      {/* Móvil y tablet: una columna */}
      <div className="lg:hidden">
        {activePlatform && (
          <>
            <PlatformHeader platform={activePlatform} count={activePlatform.modules.length} />
            <div className="grid gap-3 sm:grid-cols-2">
              {activePlatform.modules.map((m) => (
                <ModuleCardLink key={m.id} platform={activePlatform} module={m} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop y proyección: todas las columnas al tiempo */}
      <div
        className="hidden gap-4 lg:grid"
        style={{ gridTemplateColumns: `repeat(${filtered.length}, minmax(0, 1fr))` }}
      >
        {filtered.map((p) => (
          <section key={p.id} className="min-w-0">
            <PlatformHeader platform={p} count={p.modules.length} />
            <div className="flex flex-col gap-3">
              {p.modules.length === 0 ? (
                <p className="rounded-card border border-dashed border-line px-4 py-6 text-center text-[13px] text-faint">
                  Sin módulos en este nivel
                </p>
              ) : (
                p.modules.map((m) => <ModuleCardLink key={m.id} platform={p} module={m} />)
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
