'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import type { DeckFull } from '@/db/queries';
import { pushSlide, startLive, stopLive } from '@/app/admin/(panel)/presentaciones/actions';
import { SlideStage } from './slide-stage';

export function Presenter({
  deck,
  initialPin,
  initialSlide,
}: {
  deck: DeckFull;
  initialPin: string | null;
  initialSlide: number;
}) {
  const [index, setIndex] = useState(initialSlide);
  const [pin, setPin] = useState<string | null>(initialPin);
  const [notesOpen, setNotesOpen] = useState(false);
  const [lost, setLost] = useState(false);
  const [pending, startTransition] = useTransition();

  const total = deck.slides.length;
  const slide = deck.slides[index];

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIndex(clamped);
      // Si el envío falla, la sala se queda congelada: hay que avisarlo.
      if (pin) {
        pushSlide(deck.id, clamped).then(
          () => setLost(false),
          () => setLost(true),
        );
      }
    },
    [total, pin, deck.id],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        go(index + 1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === 'Home') go(0);
      if (event.key === 'End') go(total - 1);
      if (event.key === 'n') setNotesOpen((open) => !open);
      if (event.key === 'f') void document.documentElement.requestFullscreen?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, total]);

  function toggleLive() {
    startTransition(async () => {
      if (pin) {
        await stopLive(deck.id);
        setPin(null);
        setLost(false);
      } else {
        const session = await startLive(deck.id, index);
        setPin(session.pin);
      }
    });
  }

  if (!slide) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-6 text-center">
        <div>
          <p className="text-[15px] text-muted">Esta presentación no tiene láminas.</p>
          <Link href="/admin/presentaciones" className="mt-2 inline-block text-primary">
            Volver a presentaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0b0e1a] text-white">
      <header className="no-print flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <Link href="/admin/presentaciones" className="text-[12.5px] text-white/50 hover:text-white">
          &larr; Presentaciones
        </Link>
        <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{deck.title}</span>

        {pin ? (
          lost ? (
            <span className="flex items-center gap-2 rounded-full bg-[#c2410c]/20 px-3 py-1 text-[12.5px] font-semibold text-[#f4a06a]">
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              Sin conexión con la sala
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-[#0fa97a]/15 px-3 py-1 text-[12.5px] font-semibold text-[#2fd3a0]">
              <span className="size-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />
              En vivo · PIN {pin}
            </span>
          )
        ) : (
          <span className="text-[12.5px] text-white/40">Sin transmitir</span>
        )}

        <button
          onClick={toggleLive}
          disabled={pending}
          className={`rounded-[10px] px-3 py-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 ${
            pin ? 'bg-white/10 text-white' : 'bg-[#0fa97a] text-white'
          }`}
        >
          {pin ? 'Terminar transmisión' : 'Transmitir en vivo'}
        </button>
        <button
          onClick={() => setNotesOpen((open) => !open)}
          className="rounded-[10px] border border-white/15 px-3 py-1.5 text-[12.5px] font-medium text-white/70 hover:text-white"
        >
          Notas
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <SlideStage html={slide.html} styles={deck.styles} className="min-h-0 flex-1 p-3" />

        {notesOpen && (
          <div className="no-print mx-3 mb-2 max-h-40 overflow-y-auto rounded-lg bg-white/5 p-3 text-[13px] leading-relaxed text-white/70">
            {slide.notes ?? 'Esta lámina no trae notas del expositor.'}
          </div>
        )}
      </main>

      <footer className="no-print flex items-center justify-between gap-4 px-4 py-3">
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="rounded-[10px] border border-white/15 px-4 py-2 text-[13px] font-medium disabled:opacity-30"
        >
          Anterior
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/60 transition-[width] duration-300"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
          <span className="flex-none font-mono text-[12.5px] text-white/50">
            {index + 1} / {total}
          </span>
        </div>

        <button
          onClick={() => go(index + 1)}
          disabled={index === total - 1}
          className="rounded-[10px] bg-white/10 px-4 py-2 text-[13px] font-medium disabled:opacity-30"
        >
          Siguiente
        </button>
      </footer>

      <p className="no-print pb-3 text-center text-[11.5px] text-white/30">
        Flechas para avanzar · F pantalla completa · N notas
        {pin && ' · la audiencia entra en /vivo con el PIN'}
      </p>
    </div>
  );
}
