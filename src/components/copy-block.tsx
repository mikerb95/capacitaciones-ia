'use client';

import { useState } from 'react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      onClick={copy}
      className="no-print flex-none rounded-lg border border-line px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

/** Un bloque de texto para pegar tal cual en Copilot, con botón de copiar. */
export function CopyBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-card border border-line bg-surface shadow-card">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
          {label}
        </p>
        <CopyButton text={text} />
      </header>
      <p className="px-5 py-4 text-[13.5px] leading-relaxed whitespace-pre-line text-text">
        {text}
      </p>
    </div>
  );
}
