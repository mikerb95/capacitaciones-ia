import { QuoteEmailCard } from '@/components/quote-email-card';
import { SiteHeader } from '@/components/ui';

export const metadata = { title: 'Caso: sacos de yute para café de exportación · Academia IA' };

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

export default function GuiaEcomPage() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Caso: sacos de yute para café de exportación"
        subtitle="Recursos para el ejercicio de hoy"
        back={{ href: '/', label: 'Inicio' }}
      />

      <main className="mx-auto flex max-w-[820px] flex-col gap-6 px-4 py-8 sm:px-6">
        <section>
          <h2 className="font-display text-[22px] font-semibold tracking-tight sm:text-[26px]">
            Adjudicar 20.000 sacos de yute
          </h2>
          <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-muted">
            Trabajás en logística de una exportadora de café. Hay que envasar el lote de café verde
            de la cosecha en sacos de yute antes de que salga el contenedor, y el coordinador tiene
            que resolver hoy a qué proveedor le compra las 20.000 unidades. Llegaron tres
            cotizaciones por correo, cada una con su propio formato. Abajo están los tres correos
            tal cual entraron a la bandeja: úsalos como fuente para pedirle a Copilot que arme la
            comparación y la decisión.
          </p>
        </section>

        <section className="rounded-card border border-line bg-surface-2 p-4">
          <p className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
            Para el ejercicio
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            Pídele a Copilot que arme una tabla comparativa de los tres correos y que recomiende a
            quién adjudicar, con el total real de cada oferta (impuestos y flete incluidos) y la
            fecha de entrega. El contenedor para exportación cierra reserva en 20 días.
          </p>
        </section>

        <section className="flex flex-col gap-4">
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
                hacemos en 15 días hábiles desde que confirman el pedido, y pueden pagar a 30 días
                de recibida la mercadería. Cualquier consulta me escriben.
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
                Saco de yute 50 kg - Precio por millar: USD 1.240 (equivale a USD 1,24 por saco).
                Pedido de 20.000 sacos = 20 millares = USD 24.800. Precio sin IVA.
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
        </section>
      </main>
    </div>
  );
}
