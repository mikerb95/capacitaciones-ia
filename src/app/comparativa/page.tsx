import { ComparisonView } from '@/components/comparison-view';
import { LeaveButton } from '@/components/leave-button';
import { SiteHeader } from '@/components/ui';
import { getComparison } from '@/db/queries';
import { requireScopedParticipant, scopeComparison } from '@/lib/scope';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Comparativa de módulos · Academia IA' };

export default async function ComparativaPage() {
  const { participant, scope } = await requireScopedParticipant();
  const platforms = scopeComparison(await getComparison(), scope);
  const totalModules = platforms.reduce((n, p) => n + p.modules.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Comparativa de módulos"
        subtitle={`${platforms.length} plataformas · ${totalModules} módulos`}
        back={{ href: '/', label: 'Inicio' }}
      >
        <LeaveButton name={participant.name ?? undefined} />
      </SiteHeader>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div className="mb-6 max-w-[70ch]">
          <h2 className="font-display text-[24px] font-semibold tracking-tight sm:text-[28px]">
            Qué hace cada plataforma
          </h2>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
            Una columna por herramienta, con sus módulos en el orden en que se dictan. Toca una card
            para ver el detalle: prompts, casos por área, el antes y el después, y los errores
            frecuentes.
          </p>
        </div>

        <ComparisonView platforms={platforms} />
      </main>
    </div>
  );
}
