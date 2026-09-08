import { CopyBlock } from '@/components/copy-block';
import { SiteHeader } from '@/components/ui';

export const metadata = {
  title: 'Caso: correo a un proveedor por cambio en la entrega · Aula Virtual',
};

const DATOS = `Proveedor: Yuteros del Litoral (contacto: Vanina Corvalán)
Acuerdo vigente: 20.000 sacos de yute, entrega en 15 días hábiles, flete incluido, pago a 30 días de recibida la mercadería.
Cambio: la naviera adelantó la reserva del contenedor 5 días. Se necesita la entrega en 10 días hábiles en lugar de 15. El resto del acuerdo se mantiene igual.`;

const PETICION = `Escribile un correo formal a Vanina Corvalán, de Yuteros del Litoral, pidiéndole que adelante la entrega de los 20.000 sacos de yute de 15 a 10 días hábiles, porque la naviera adelantó la reserva del contenedor. Aclará que el resto del acuerdo se mantiene igual (flete incluido, pago a 30 días) y pedile que confirme si pueden cumplir esa fecha antes de coordinar el contenedor.`;

export default function GuiaEntregaPage() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Caso: correo por cambio en la entrega"
        subtitle="Recursos para el ejercicio de hoy"
        back={{ href: '/', label: 'Inicio' }}
      />

      <main className="mx-auto flex max-w-[820px] flex-col gap-6 px-4 py-8 sm:px-6">
        <section>
          <h2 className="font-display text-[22px] font-semibold tracking-tight sm:text-[26px]">
            Correo a un proveedor sobre condiciones de entrega
          </h2>
          <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-muted">
            Seguimos con la exportadora de café: ya se adjudicaron los 20.000 sacos de yute a
            Yuteros del Litoral. Pero la naviera acaba de adelantar la reserva del contenedor, y
            hace falta pedirle al proveedor que adelante también su entrega. Es un correo delicado:
            se le está pidiendo un esfuerzo extra a alguien que ya cumplió con lo pactado.
          </p>
        </section>

        <section className="rounded-card border border-line bg-surface-2 p-4">
          <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
            Datos de partida
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed whitespace-pre-line text-muted">
            {DATOS}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
            Para el ejercicio
          </p>
          <p className="text-[13px] leading-relaxed text-muted">
            Pegá la petición de abajo en Copilot y pedile el borrador de correo. Después revisalo
            contra la lista de qué observar.
          </p>
          <CopyBlock label="Petición para Copilot" text={PETICION} />
        </section>

        <section className="rounded-card border border-line bg-surface p-5 shadow-card">
          <p className="mb-3 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
            Qué observar en el borrador
          </p>
          <ul className="flex flex-col gap-2.5">
            <li className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
              <span className="mt-[3px] text-accent">·</span>
              El tono formal y la razón del cambio quedan claros sin sonar exigente.
            </li>
            <li className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
              <span className="mt-[3px] text-accent">·</span>
              Antes de enviarlo: revisar nombres, fechas y que el compromiso sea el que realmente
              pueden cumplir.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
