'use client';

import { useEffect, useRef, useState } from 'react';
import { COUNTRIES, findCountry, flagOf, type Country } from '@/lib/countries';

/**
 * Selector de país para el teléfono. Cerrado muestra bandera e indicativo, que
 * es lo que hace falta al lado del número; abierto lista los nombres.
 */
export function CountrySelect({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = findCountry(value) ?? COUNTRIES[0];

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Al abrir, la opción activa queda a la vista.
  useEffect(() => {
    if (open) list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'center' });
  }, [open]);

  const choose = (country: Country) => {
    onChange(country.code);
    setOpen(false);
  };

  return (
    <div ref={box} className="relative">
      <input type="hidden" name={name} value={selected.code} />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`País: ${selected.name}`}
        className="flex h-full items-center gap-1.5 rounded-l-[10px] py-2.5 pl-3 pr-2.5 text-[14.5px] transition-colors hover:bg-surface-2"
      >
        <span aria-hidden="true">{flagOf(selected.code)}</span>
        <span className="font-mono text-[13.5px] text-muted">+{selected.dial}</span>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-faint"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={list}
          role="listbox"
          aria-label="País"
          className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-[260px] w-[280px] overflow-y-auto rounded-[12px] border border-line bg-surface py-1 shadow-lift"
        >
          {COUNTRIES.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                role="option"
                aria-selected={country.code === selected.code}
                onClick={() => choose(country)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[14px] transition-colors hover:bg-surface-2 ${
                  country.code === selected.code ? 'bg-primary-soft text-primary' : ''
                }`}
              >
                <span aria-hidden="true">{flagOf(country.code)}</span>
                <span className="min-w-0 flex-1 truncate">{country.name}</span>
                <span className="font-mono text-[12.5px] text-faint">+{country.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
