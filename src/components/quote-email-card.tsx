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
      {copied ? 'Copiado' : 'Copiar correo'}
    </button>
  );
}

export function QuoteEmailCard({
  from,
  subject,
  body,
  raw,
}: {
  from: string;
  subject: string;
  body: React.ReactNode;
  raw: string;
}) {
  return (
    <article className="rounded-card border border-line bg-surface shadow-card">
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold">{from}</p>
          <p className="truncate text-[12px] text-faint">Asunto: {subject}</p>
        </div>
        <CopyButton text={raw} />
      </header>
      <div className="px-5 py-4 text-[13.5px] leading-relaxed whitespace-pre-line text-text">
        {body}
      </div>
    </article>
  );
}
