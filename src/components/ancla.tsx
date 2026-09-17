'use client';

import { useEffect } from 'react';

/**
 * Lleva al elemento del ancla y lo marca un momento. Si es un `<details>` (una
 * pregunta frecuente), lo abre: llegar desde el buscador a una respuesta
 * cerrada obliga a buscarla de nuevo con la vista.
 */
export function revelarAncla(hash = window.location.hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  if (el instanceof HTMLDetailsElement) el.open = true;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Una sección entera no se marca: el anillo solo tiene sentido en una ficha.
  if (el.tagName === 'SECTION') return;
  el.removeAttribute('data-destacado');
  // Forzar el reflow reinicia la animación si se llega dos veces seguidas.
  void el.offsetWidth;
  el.setAttribute('data-destacado', '');
}

export const EVENTO_ANCLA = 'aula:ancla';

/** Se monta en las páginas con anclas buscables. */
export function Ancla() {
  useEffect(() => {
    const revelar = () => revelarAncla();
    // Tras una navegación del cliente el contenido puede pintarse un poco después.
    const t = window.setTimeout(revelar, 60);
    window.addEventListener('hashchange', revelar);
    window.addEventListener(EVENTO_ANCLA, revelar);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('hashchange', revelar);
      window.removeEventListener(EVENTO_ANCLA, revelar);
    };
  }, []);

  return null;
}
