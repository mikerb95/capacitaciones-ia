'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DeckFull } from '@/db/queries';
import { SlideStage } from './slide-stage';

type Slide = DeckFull['slides'][number];

export function Audience({
  pin,
  title,
  styles,
  slides,
  initialSlide,
}: {
  pin: string;
  title: string;
  styles: string | null;
  slides: Slide[];
  initialSlide: number;
}) {
  const [index, setIndex] = useState(initialSlide);
  const [following, setFollowing] = useState(true);
  const [live, setLive] = useState(true);
  const followingRef = useRef(following);

  useEffect(() => {
    followingRef.current = following;
  }, [following]);

  // Polling: es lo más robusto para una sala con red irregular.
  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const response = await fetch(`/api/live/${pin}`, { cache: 'no-store' });
        const state = await response.json();
        if (cancelled) return;
        setLive(Boolean(state.live));
        if (state.live && followingRef.current && typeof state.slide === 'number') {
          setIndex(state.slide);
        }
      } catch {
        // Un fallo de red puntual no saca a nadie de la sesión.
      }
    }

    void tick();
    const timer = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [pin]);

  const move = useCallback(
    (next: number) => {
      setFollowing(false);
      setIndex(Math.max(0, Math.min(slides.length - 1, next)));
    },
    [slides.length],
  );

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0b0e1a] text-white">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5">
        <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{title}</span>
        {live ? (
          <span className="flex items-center gap-1.5 rounded-full bg-[#0fa97a]/15 px-2.5 py-1 text-[11.5px] font-semibold text-[#2fd3a0]">
            <span className="size-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />
            En vivo
          </span>
        ) : (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] text-white/50">
            La sesión terminó
          </span>
        )}
      </header>

      <main className="min-h-0 flex-1">
        <SlideStage html={slide.html} styles={styles} className="h-full p-3" />
      </main>

      <footer className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={() => move(index - 1)}
          disabled={index === 0}
          className="rounded-[10px] border border-white/15 px-3.5 py-2 text-[13px] disabled:opacity-30"
        >
          Anterior
        </button>

        {following ? (
          <span className="text-[12.5px] text-white/40">
            Siguiendo al expositor · {index + 1} de {slides.length}
          </span>
        ) : (
          <button
            onClick={() => setFollowing(true)}
            className="rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-medium"
          >
            Volver a seguir al expositor
          </button>
        )}

        <button
          onClick={() => move(index + 1)}
          disabled={index === slides.length - 1}
          className="rounded-[10px] bg-white/10 px-3.5 py-2 text-[13px] disabled:opacity-30"
        >
          Siguiente
        </button>
      </footer>
    </div>
  );
}
