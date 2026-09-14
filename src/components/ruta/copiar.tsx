'use client';

import { useState } from 'react';

export function Copiar({ texto, etiqueta = 'Copiar' }: { texto: string; etiqueta?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="no-print flex-none rounded-lg border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
    >
      {copiado ? 'Copiado' : etiqueta}
    </button>
  );
}
