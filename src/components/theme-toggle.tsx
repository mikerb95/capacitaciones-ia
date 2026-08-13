'use client';

/**
 * Se ejecuta antes del primer pintado para que no haya parpadeo de tema.
 * Deja el atributo data-theme puesto en <html>, que es de donde lee todo lo demás.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('academia-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      window.localStorage.setItem('academia-theme', next);
    } catch {
      // Sin localStorage el tema simplemente no se recuerda.
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      title="Cambiar tema"
      className="grid size-9 place-items-center rounded-[10px] border border-line bg-surface text-muted transition-colors hover:border-primary hover:text-text"
    >
      {/* El icono se elige por CSS, así no depende del estado de React */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="hidden dark:block"
      >
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="block dark:hidden"
      >
        <path
          d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
