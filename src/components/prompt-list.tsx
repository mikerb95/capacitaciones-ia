'use client';

import { useState } from 'react';

type Prompt = { id: number; tag: string; text: string };

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

export function PromptList({ prompts }: { prompts: Prompt[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {prompts.map((p) => (
        <li
          key={p.id}
          className="flex items-start gap-3 rounded-card border border-line bg-surface p-3.5 shadow-card"
        >
          <span className="mt-0.5 flex-none rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-medium text-muted">
            {p.tag}
          </span>
          <p className="min-w-0 flex-1 text-[13.5px] leading-relaxed text-text">{p.text}</p>
          <CopyButton text={p.text} />
        </li>
      ))}
    </ul>
  );
}
