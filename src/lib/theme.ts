/**
 * Se ejecuta antes del primer pintado para que no haya parpadeo de tema.
 * Deja data-theme puesto en <html>, que es de donde lee todo lo demás.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('academia-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;
