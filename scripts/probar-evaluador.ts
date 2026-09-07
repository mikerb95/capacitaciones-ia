/**
 * Prueba de humo del evaluador del entrenador: manda dos intentos de verdad a
 * los proveedores configurados y revisa que lo que vuelve tenga la forma del
 * esquema.
 *
 * Es lo único del entrenador que no se puede verificar leyendo código: que el
 * modelo devuelva el JSON completo, con los seis criterios y el prompt
 * mejorado. Sin llave configurada no falla, avisa: sin proveedores el
 * entrenador cae a la autocalificación, que es el comportamiento correcto.
 *
 *   npm run entrenador:probar
 *   npm run entrenador:probar -- chatgpt guia-de-prompts
 *
 * Los dos intentos son a propósito uno flojo y uno completo: si el evaluador
 * los califica igual, el problema no es la forma del JSON sino la rúbrica.
 */
import { getModule, getTrainerCatalog } from '../src/db/queries';
import { CRITERIOS, retosDeModulo, seEntrena } from '../src/lib/entrenador';
import { evaluar } from '../src/lib/evaluador';

const FLOJO = 'Necesito que me ayudes a redactar un correo para el cliente sobre el retraso.';

const COMPLETO = `Redacta un correo para Marcela Ruiz, la jefa de compras de Alimentos del Valle, avisando que el pedido 4471 se atrasa dos semanas por un problema del proveedor de empaques.
Contexto: es cliente desde hace seis años, nunca les habíamos incumplido, y ya pagaron el 50%.
Quiero: máximo 150 palabras, tono formal pero cercano, que arranque con la fecha nueva y no con la disculpa, y que cierre proponiendo una llamada esta semana.
No inventes compensaciones ni descuentos: eso todavía no está aprobado.`;

async function elegirModulo(): Promise<{ platformId: string; slug: string }> {
  const [platformId, slug] = process.argv.slice(2);
  if (platformId && slug) return { platformId, slug };

  const catalogo = await getTrainerCatalog();
  for (const p of catalogo) {
    const mod = p.modules.find(seEntrena);
    if (mod) return { platformId: p.id, slug: mod.slug };
  }
  throw new Error('Ningún módulo de la base tiene casos y prompts para entrenar.');
}

function revisar(veredicto: {
  criterios: { id: string; cumple: boolean; comentario: string }[];
  resumen: string;
  mejorado: string;
}) {
  const fallas: string[] = [];
  const ids = veredicto.criterios.map((c) => c.id);
  const esperados = CRITERIOS.map((c) => c.id);

  if (ids.join() !== esperados.join()) {
    fallas.push(`criterios: llegaron [${ids.join(', ')}], se esperaban [${esperados.join(', ')}]`);
  }
  const mudos = veredicto.criterios.filter((c) => c.comentario.trim().length < 10);
  if (mudos.length) fallas.push(`comentarios vacíos en: ${mudos.map((c) => c.id).join(', ')}`);
  if (veredicto.resumen.trim().length < 20) fallas.push('resumen vacío o de una palabra');
  if (veredicto.mejorado.trim().length < 40) fallas.push('prompt mejorado vacío o demasiado corto');

  return fallas;
}

async function main() {
  const { platformId, slug } = await elegirModulo();
  const mod = await getModule(platformId, slug);
  if (!mod) throw new Error(`No existe el módulo ${platformId}/${slug}.`);
  if (!seEntrena(mod)) throw new Error(`El módulo ${platformId}/${slug} no tiene con qué entrenar.`);

  const reto = retosDeModulo(mod)[0];
  console.log(`Módulo: ${mod.platform.name} / ${mod.name}`);
  console.log(`Reto:   ${reto.rol} - ${reto.tarea}\n`);

  let problemas = 0;

  for (const [etiqueta, intento] of [
    ['intento flojo', FLOJO],
    ['intento completo', COMPLETO],
  ] as const) {
    const inicio = Date.now();
    const resultado = await evaluar({
      reto,
      intento,
      moduloNombre: mod.name,
      plataformaNombre: mod.platform.name,
      tropiezos: mod.mistakes.map((m) => ({ bad: m.bad, good: m.good })),
    });
    const segundos = ((Date.now() - inicio) / 1000).toFixed(1);

    console.log(`── ${etiqueta} (${segundos}s)`);

    if (resultado.via === 'manual') {
      problemas++;
      console.log('   Ningún proveedor respondió: cayó a la autocalificación.');
      console.log('   Revisa que GOOGLE_GENERATIVE_AI_API_KEY o GROQ_API_KEY estén en .env.local.\n');
      continue;
    }

    const { proveedor, veredicto } = resultado;
    const cumplidos = veredicto.criterios.filter((c) => c.cumple).length;
    console.log(`   Proveedor: ${proveedor} · cumple ${cumplidos} de ${CRITERIOS.length}`);
    for (const c of veredicto.criterios) {
      console.log(`   ${c.cumple ? '✓' : '✗'} ${c.id}: ${c.comentario}`);
    }
    console.log(`   Resumen: ${veredicto.resumen}`);
    console.log(`   Mejorado: ${veredicto.mejorado.slice(0, 200)}${veredicto.mejorado.length > 200 ? '…' : ''}`);

    const fallas = revisar(veredicto);
    if (fallas.length) {
      problemas++;
      console.log(`   FORMA INCORRECTA: ${fallas.join(' · ')}`);
    }
    console.log();
  }

  if (problemas) {
    console.log(`Terminó con ${problemas} problema(s).`);
    process.exit(1);
  }
  console.log('El evaluador devuelve el JSON con la forma del esquema.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
