import Link from 'next/link';
import { ComparisonView } from '@/components/comparison-view';
import { SiteHeader } from '@/components/ui';
import { getComparison } from '@/db/queries';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const platforms = await getComparison();
  const totalModules = platforms.reduce((n, p) => n + p.modules.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Academia IA"
        subtitle={`Comparativa de módulos · ${platforms.length} plataformas · ${totalModules} módulos`}
      >
        <Link
          href="/admin"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Administrar
        </Link>
      </SiteHeader>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div className="mb-6 max-w-[75ch]">
          <h2 className="font-display text-[24px] font-semibold tracking-tight sm:text-[28px]">
            Qué hace cada plataforma
          </h2>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
            Una columna por herramienta, con sus módulos en el orden en que se dictan. Toca una
            card para ver el detalle: prompts, casos por área, el antes y el después, y los errores
            frecuentes.
          </p>
        </div>

        <ComparisonView platforms={platforms} />
      </main>
    </div>
  );
}
