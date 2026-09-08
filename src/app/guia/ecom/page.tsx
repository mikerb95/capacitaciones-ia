import Link from 'next/link';
import { CopyBlock } from '@/components/copy-block';
import { QuoteEmailCard } from '@/components/quote-email-card';
import { SectionTitle, SiteHeader } from '@/components/ui';

export const metadata = {
  title: 'Casos: exportadora de café · Aula Virtual',
};

const RAW_TEXTIL = `De: Textil Envases del Sur <ventas@textilenvasesdelsur.com.ar>
Asunto: Cotización sacos de yute - Pedido 20.000 unidades

Estimado/a,

Gracias por su consulta. Le acercamos el detalle de nuestra oferta para envasar café verde de exportación:

Producto: saco de yute 50 kg, grado exportación
Cantidad: 20.000 unidades
Precio unitario: USD 1,15 (IVA incluido)
Total: USD 23.000
Forma de pago: 100% anticipado, contra confirmación del pedido
Plazo de entrega: 45 días desde acreditado el pago

Quedamos atentos a su confirmación.

Saludos,
Ramiro Acosta
Textil Envases del Sur`;

const RAW_LITORAL = `De: Yuteros del Litoral <pedidos@yuterosdellitoral.com>
Asunto: Re: cotización sacos de yute

Buenas tardes. Para el pedido de 20.000 sacos de yute de 50 kg para su café de exportación les cotizamos a USD 1,28 + IVA el saco, puesto en su planta de trilla (el flete ya está incluido en ese precio, no se cobra aparte). La entrega la hacemos en 15 días hábiles desde que confirman el pedido, y pueden pagar a 30 días de recibida la mercadería. Cualquier consulta me escriben.

Saludos,
Vanina Corvalán
Yuteros del Litoral`;

const RAW_SANMARTIN = `De: Bolsas San Martín <administracion@bolsassanmartin.com>
Asunto: Presupuesto - sacos de yute

Estimados,

Adjuntamos presupuesto para su pedido de envases para café verde:

Saco de yute 50 kg - Precio por millar: USD 1.240 (equivale a USD 1,24 por saco). Pedido de 20.000 sacos = 20 millares = USD 24.800. Precio sin IVA.

Condiciones generales: entrega 30 días corridos desde la seña. Seña del 50% al confirmar el pedido, saldo contra entrega. Los precios no incluyen flete ni seguro de transporte. Cotización válida por 5 días hábiles.

Saludos,
Bolsas San Martín`;

const DATOS_ENTREGA = `Proveedor: Yuteros del Litoral (contacto: Vanina Corvalán)
Acuerdo vigente: 20.000 sacos de yute, entrega en 15 días hábiles, flete incluido, pago a 30 días de recibida la mercadería.
Cambio: la naviera adelantó la reserva del contenedor 5 días. Se necesita la entrega en 10 días hábiles en lugar de 15. El resto del acuerdo se mantiene igual.`;

const PETICION_ENTREGA = `Escribile un correo formal a Vanina Corvalán, de Yuteros del Litoral, pidiéndole que adelante la entrega de los 20.000 sacos de yute de 15 a 10 días hábiles, porque la naviera adelantó la reserva del contenedor. Aclará que el resto del acuerdo se mantiene igual (flete incluido, pago a 30 días) y pedile que confirme si pueden cumplir esa fecha antes de coordinar el contenedor.`;

const PETICION_CHAT = `Explicame en términos simples qué normas o certificaciones se piden habitualmente a los sacos de yute que se usan para exportar café verde (por ejemplo, normas fitosanitarias o de calidad), y qué preguntas le haría a un proveedor nuevo para confirmar que las cumple.`;

const NAV = [
  { href: '#redaccion', label: '01 · Redacción' },
  { href: '#analisis', label: '02 · Organización y análisis' },
  { href: '#otras-herramientas', label: '03 · Otras herramientas' },
];

export default function GuiaEcomPage() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Casos: exportadora de café"
        subtitle="Recursos para los ejemplos en vivo"
        back={{ href: '/', label: 'Inicio' }}
      />

      <main className="mx-auto flex max-w-[820px] flex-col gap-10 px-4 py-8 sm:px-6">
        <section>
          <h2 className="font-display text-[22px] font-semibold tracking-tight sm:text-[26px]">
            Una exportadora de café, un mismo hilo
          </h2>
          <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-muted">
            Trabajás en logística de una exportadora de café. Los tres bloques de abajo siguen el
            mismo caso, uno por cada punto de la sesión de hoy: primero se decide a qué proveedor
            comprarle los sacos de yute, después se le pide un cambio de entrega por correo, y por
            último se resuelve algo con una herramienta que no necesita licencia.
          </p>
          <nav className="mt-4 flex flex-wrap gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full border border-line px-3 py-1 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </section>

        <section id="analisis" className="scroll-mt-20">
          <SectionTitle
            kicker="02 · Organización y análisis de información"
            title="Adjudicar 20.000 sacos de yute"
            intro="Llegaron tres cotizaciones por correo, cada una con su propio formato. Abajo están los tres correos tal cual entraron a la bandeja: úsalos como fuente para pedirle a Copilot que arme la comparación y la decisión."
          />

          <div className="rounded-card border border-line bg-surface-2 p-4">
            <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
              Para el ejercicio
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Pídele a Copilot que arme una tabla comparativa de los tres correos y que recomiende
              a quién adjudicar, con el total real de cada oferta (impuestos y flete incluidos) y
              la fecha de entrega. El contenedor para exportación cierra reserva en 20 días.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <QuoteEmailCard
              from="Textil Envases del Sur"
              subject="Cotización sacos de yute - Pedido 20.000 unidades"
              raw={RAW_TEXTIL}
              body={
                <>
                  Estimado/a,
                  {'\n\n'}
                  Gracias por su consulta. Le acercamos el detalle de nuestra oferta para envasar
                  café verde de exportación:
                  {'\n\n'}
                  <table className="w-full border-collapse text-left text-[13px]">
                    <tbody>
                      {[
                        ['Producto', 'Saco de yute 50 kg, grado exportación'],
                        ['Cantidad', '20.000 unidades'],
                        ['Precio unitario', 'USD 1,15 (IVA incluido)'],
                        ['Total', 'USD 23.000'],
                        ['Forma de pago', '100% anticipado, contra confirmación del pedido'],
                        ['Plazo de entrega', '45 días desde acreditado el pago'],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-line last:border-0">
                          <td className="py-1.5 pr-4 align-top font-semibold text-faint">{k}</td>
                          <td className="py-1.5 align-top">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {'\n'}
                  Quedamos atentos a su confirmación.
                  {'\n\n'}
                  Saludos,{'\n'}
                  Ramiro Acosta{'\n'}
                  Textil Envases del Sur
                </>
              }
            />

            <QuoteEmailCard
              from="Yuteros del Litoral"
              subject="Re: cotización sacos de yute"
              raw={RAW_LITORAL}
              body={
                <>
                  Buenas tardes. Para el pedido de 20.000 sacos de yute de 50 kg para su café de
                  exportación les cotizamos a USD 1,28 + IVA el saco, puesto en su planta de trilla
                  (el flete ya está incluido en ese precio, no se cobra aparte). La entrega la
                  hacemos en 15 días hábiles desde que confirman el pedido, y pueden pagar a 30
                  días de recibida la mercadería. Cualquier consulta me escriben.
                  {'\n\n'}
                  Saludos,{'\n'}
                  Vanina Corvalán{'\n'}
                  Yuteros del Litoral
                </>
              }
            />

            <QuoteEmailCard
              from="Bolsas San Martín"
              subject="Presupuesto - sacos de yute"
              raw={RAW_SANMARTIN}
              body={
                <>
                  Estimados,
                  {'\n\n'}
                  Adjuntamos presupuesto para su pedido de envases para café verde:
                  {'\n\n'}
                  Saco de yute 50 kg - Precio por millar: USD 1.240 (equivale a USD 1,24 por
                  saco). Pedido de 20.000 sacos = 20 millares = USD 24.800. Precio sin IVA.
                  {'\n\n'}
                  <span className="text-[11.5px] text-faint">
                    Condiciones generales: entrega 30 días corridos desde la seña. Seña del 50% al
                    confirmar el pedido, saldo contra entrega. Los precios no incluyen flete ni
                    seguro de transporte. Cotización válida por 5 días hábiles.
                  </span>
                  {'\n\n'}
                  Saludos,{'\n'}
                  Bolsas San Martín
                </>
              }
            />
          </div>
        </section>

        <section id="redaccion" className="scroll-mt-20">
          <SectionTitle
            kicker="01 · Redacción de correos e informes"
            title="Correo a un proveedor sobre condiciones de entrega"
            intro="Ya se adjudicaron los sacos a Yuteros del Litoral. Pero la naviera acaba de adelantar la reserva del contenedor, y hace falta pedirle al proveedor que adelante también su entrega. Es un correo delicado: se le está pidiendo un esfuerzo extra a alguien que ya cumplió con lo pactado."
          />

          <div className="rounded-card border border-line bg-surface-2 p-4">
            <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
              Datos de partida
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed whitespace-pre-line text-muted">
              {DATOS_ENTREGA}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <p className="text-[13px] leading-relaxed text-muted">
              Pegá la petición de abajo en Copilot y pedile el borrador de correo. Después revisalo
              contra la lista de qué observar.
            </p>
            <CopyBlock label="Petición para Copilot" text={PETICION_ENTREGA} />
          </div>

          <div className="mt-4 rounded-card border border-line bg-surface p-5 shadow-card">
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
                Antes de enviarlo: revisar nombres, fechas y que el compromiso sea el que
                realmente pueden cumplir.
              </li>
            </ul>
          </div>
        </section>

        <section id="otras-herramientas" className="scroll-mt-20">
          <SectionTitle
            kicker="03 · Otras herramientas de IA para el trabajo"
            title="Una pregunta pública, sin licencia"
            intro="No todo necesita la licencia completa de Microsoft 365 Copilot. Copilot Chat, la versión web sin costo, no ve los archivos ni los correos de la empresa, pero alcanza de sobra para preguntas generales que no dependen de datos internos."
          />

          <div className="rounded-card border border-line bg-surface-2 p-4">
            <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
              Para el ejercicio
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Antes de cerrarle la compra a un proveedor nuevo, el coordinador quiere entender qué
              normas de calidad se usan habitualmente en la industria. Es información pública, no
              depende de ningún archivo de la empresa: exactamente lo que Copilot Chat gratuito
              puede resolver.
            </p>
          </div>

          <div className="mt-4">
            <CopyBlock label="Petición para Copilot Chat" text={PETICION_CHAT} />
          </div>

          <div className="mt-4 rounded-card border border-line bg-surface p-5 shadow-card">
            <p className="mb-3 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
              Qué observar
            </p>
            <ul className="flex flex-col gap-2.5">
              <li className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="mt-[3px] text-accent">·</span>
                Copilot Chat gratuito responde bien acá porque no hace falta ningún dato de la
                empresa: es una pregunta que le harías igual desde tu casa.
              </li>
              <li className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="mt-[3px] text-accent">·</span>
                Si la siguiente pregunta fuera &laquo;compará esto con nuestra política de
                compras&raquo;, ya no alcanza: eso necesita la licencia paga, que sí ve los
                archivos de la empresa.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
