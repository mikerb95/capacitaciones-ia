/**
 * Envoltura de las rutas imprimibles. Estas páginas no son parte del portal:
 * existen para que `scripts/build-materiales.ts` las convierta en PDF, así que
 * fijan la paleta clara a mano. Si heredaran el tema del sistema, el PDF
 * saldría oscuro o claro según la máquina donde se generó.
 */
export default function MaterialesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="doc">
      <style>{css}</style>
      {children}
    </div>
  );
}

const css = `
@page { size: letter; margin: 16mm 15mm 18mm; }

.doc {
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-2: #f2f5fd;
  --border: #dce3f3;
  --text: #101426;
  --muted: #565f7a;
  --faint: #8189a3;
  --primary: #3b5bdb;
  --primary-soft: #e5eafd;
  --accent: #0fa97a;
  --accent-soft: #dcf6ec;
  background: #ffffff;
  color: var(--text);
  min-height: 100vh;
}

/* En pantalla se simula la hoja para poder revisar sin exportar. */
@media screen {
  .doc { background: #e8ecf7; padding: 24px 0; }
  .sheet {
    width: 216mm;
    min-height: 279mm;
    margin: 0 auto 24px;
    padding: 16mm 15mm 18mm;
    background: #fff;
    box-shadow: 0 2px 4px rgb(20 26 56 / 0.08), 0 18px 40px rgb(20 26 56 / 0.12);
  }
}

@media print {
  /* La hoja ocupa el alto útil (carta menos los márgenes del @page) para que
     el pie de página se vaya al fondo en vez de quedar pegado al contenido. */
  .sheet { padding: 0; min-height: 245mm; }
  .sheet + .sheet { break-before: page; }
}

.avoid-break { break-inside: avoid; }
`;
