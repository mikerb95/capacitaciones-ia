import { copilotCurso } from '../src/lib/ruta/copilot';

const MODULOS_SEED = new Set([
  'chat', 'word', 'excel', 'ppt', 'teams', 'outlook', 'cowork', 'studio', 'researcher-analyst',
]);

let errores = 0;
function fail(msg: string) {
  errores++;
  console.error('FAIL:', msg);
}

const curso = copilotCurso;

const slugs = new Map<string, number>();
for (const u of curso.unidades) {
  for (const l of u.lecciones) {
    slugs.set(l.slug, (slugs.get(l.slug) ?? 0) + 1);
  }
}
for (const [slug, n] of slugs) {
  if (n > 1) fail(`slug duplicado: ${slug} (${n} veces)`);
  if (slug === 'diagnostico' || slug === 'certificado') fail(`slug reservado usado: ${slug}`);
}
console.log('Total lecciones:', [...slugs.keys()].length);

function checarPreguntas(preguntas: any[], ctx: string) {
  for (const p of preguntas) {
    const correctas = p.opciones.filter((o: any) => o.correcta === true).length;
    if (correctas !== 1) fail(`${ctx} pregunta ${p.id}: ${correctas} opciones correctas (debe ser 1)`);
    if (p.modulo && !MODULOS_SEED.has(p.modulo)) fail(`${ctx} pregunta ${p.id}: modulo invalido "${p.modulo}"`);
  }
}

let minutosTotales = 0;
for (const u of curso.unidades) {
  if (u.modulo && !MODULOS_SEED.has(u.modulo)) fail(`unidad ${u.slug}: modulo invalido "${u.modulo}"`);
  for (const l of u.lecciones) {
    minutosTotales += l.minutos;
    if (l.tipo === 'lectura') {
      checarPreguntas(l.chequeo, `lectura ${l.slug}`);
    } else if (l.tipo === 'examen') {
      checarPreguntas(l.preguntas, `examen ${l.slug}`);
      if (l.preguntas.length < 3) fail(`examen ${l.slug}: solo ${l.preguntas.length} preguntas (<3)`);
    } else if (l.tipo === 'practica') {
      const ids = l.rubrica.map((r: any) => r.id);
      if (new Set(ids).size !== ids.length) fail(`practica ${l.slug}: ids de rubrica duplicados`);
      if (l.rubrica.length < 4 || l.rubrica.length > 6) fail(`practica ${l.slug}: rubrica de ${l.rubrica.length} criterios (esperado 4-6)`);
    }
  }
}

checarPreguntas(curso.diagnostico, 'diagnostico');
if (curso.diagnostico.length !== 10) fail(`diagnostico: ${curso.diagnostico.length} preguntas (esperado 10)`);

const conteoNivel = new Map<string, number>();
for (const p of curso.diagnostico) {
  conteoNivel.set(p.nivel, (conteoNivel.get(p.nivel) ?? 0) + 1);
}
for (const n of curso.niveles) {
  if ((conteoNivel.get(n.key) ?? 0) !== 2) fail(`diagnostico nivel ${n.key}: ${conteoNivel.get(n.key) ?? 0} preguntas (esperado 2)`);
}

console.log('Minutos totales:', minutosTotales, `(${Math.round((minutosTotales / 60) * 10) / 10} h)`);
console.log('Unidades:', curso.unidades.length);
console.log(errores === 0 ? 'OK: sin errores' : `${errores} error(es)`);
process.exit(errores === 0 ? 0 : 1);
