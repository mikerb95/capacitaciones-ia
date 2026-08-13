'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const SLIDE_WIDTH = 1280;
export const SLIDE_HEIGHT = 720;

/**
 * Pinta una lámina importada dentro de un iframe sin permisos de ejecución.
 * El iframe se dibuja siempre a 1280x720 y se escala al contenedor, así el
 * diseño se ve igual en el proyector, en el portátil y en el celular.
 */
export function SlideStage({
  html,
  styles,
  className = '',
}: {
  html: string;
  styles: string | null;
  className?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const fit = useCallback(() => {
    const node = holder.current;
    if (!node) return;
    const { width, height } = node.getBoundingClientRect();
    if (!width || !height) return;
    setScale(Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT));
  }, []);

  useEffect(() => {
    fit();
    const observer = new ResizeObserver(fit);
    if (holder.current) observer.observe(holder.current);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [fit]);

  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;width:${SLIDE_WIDTH}px;height:${SLIDE_HEIGHT}px;overflow:hidden;background:#fff}
    ${styles ?? ''}
  </style></head><body>${html}</body></html>`;

  return (
    <div ref={holder} className={`grid place-items-center overflow-hidden ${className}`}>
      <div
        style={{
          width: SLIDE_WIDTH * scale,
          height: SLIDE_HEIGHT * scale,
        }}
        className="relative overflow-hidden rounded-lg bg-white shadow-card"
      >
        <iframe
          title="Lámina"
          sandbox=""
          srcDoc={doc}
          className="absolute left-0 top-0 border-0"
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
}
