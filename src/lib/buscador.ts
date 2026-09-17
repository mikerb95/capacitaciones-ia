import { getPlatform, getPlatformIds } from '@/db/queries';
import { cursoEnAlcance, getCurso, leccionesDe, type Bloque, type Leccion } from '@/lib/ruta';
import { normalizar, terminos } from '@/lib/normalizar';
import { hasModule, hasPlatform, type Scope } from '@/lib/scope';

/**
 * El buscador del aula: encuentra módulos, prompts, lecciones de la ruta,
 * ayuda, planes y material, con lo que la persona puede ver según su código.
 *
 * El índice se arma una vez con todo el catálogo y se recorta por alcance en
 * cada consulta. Así escribir letra por letra no vuelve a leer la base: el
 * contenido cambia desde el admin unas pocas veces al día, y un par de minutos
 * de retraso en el buscador no le quita nada a nadie.
 */

export const GRUPOS = [
  { key: 'modulo', titulo: 'Módulos' },
  { key: 'prompt', titulo: 'Prompts' },
  { key: 'leccion', titulo: 'Temario' },
  { key: 'ayuda', titulo: 'Ayuda' },
  { key: 'plan', titulo: 'Planes y modelos' },
  { key: 'material', titulo: 'Material y enlaces' },
] as const;

export type GrupoKey = (typeof GRUPOS)[number]['key'];

type Entrada = {
  grupo: GrupoKey;
  plataforma: string;
  titulo: string;
  /** Dónde vive: el módulo del prompt, la unidad de la lección, "Preguntas frecuentes"... */
  contexto: string;
  texto: string;
  href: string;
  externo?: boolean;
  /** Si depende de un módulo, el código tiene que incluirlo. */
  moduloId?: number;
  /** Las lecciones se recortan con la misma regla que la ruta: ver `leccionesVisibles`. */
  leccion?: string;
  // Versiones normalizadas, calculadas una sola vez al armar el índice.
  nTitulo: string;
  nContexto: string;
  nTexto: string;
};

type Plataforma = { id: string; name: string; color: string; modulos: Map<string, number> };

type Indice = { entradas: Entrada[]; plataformas: Map<string, Plataforma> };

/* ------------------------------------------------------------------ índice */

const VIGENCIA_MS = 2 * 60 * 1000;
let cache: { armado: number; indice: Promise<Indice> } | null = null;

function obtenerIndice() {
  if (!cache || Date.now() - cache.armado > VIGENCIA_MS) {
    const indice = armarIndice();
    cache = { armado: Date.now(), indice };
    // Si falla, el próximo pedido vuelve a intentar en vez de heredar el error.
    indice.catch(() => {
      if (cache?.indice === indice) cache = null;
    });
  }
  return cache.indice;
}

const junta = (...partes: (string | null | undefined)[]) => partes.filter(Boolean).join(' · ');

async function armarIndice(): Promise<Indice> {
  const ids = await getPlatformIds();
  const completas = await Promise.all(ids.map(({ id }) => getPlatform(id)));

  const entradas: Omit<Entrada, 'nTitulo' | 'nContexto' | 'nTexto'>[] = [];
  const plataformas = new Map<string, Plataforma>();

  for (const p of completas) {
    if (!p) continue;
    plataformas.set(p.id, {
      id: p.id,
      name: p.name,
      color: p.color,
      modulos: new Map(p.modules.map((m) => [m.slug, m.id])),
    });

    for (const m of p.modules) {
      entradas.push({
        grupo: 'modulo',
        plataforma: p.id,
        titulo: m.name,
        contexto: junta(m.level, m.category),
        texto: junta(
          m.summary,
          m.intro,
          m.shortName,
          ...m.outcomes.map((o) => o.text),
          ...m.steps.map((s) => `${s.title}: ${s.description}`),
          ...m.roles.map((r) => `${r.role}: ${r.task}. ${r.detail}`),
          ...m.mistakes.map((x) => `${x.bad} ${x.good}`),
        ),
        href: `/${p.id}/${m.slug}`,
        moduloId: m.id,
      });

      for (const pr of m.prompts) {
        entradas.push({
          grupo: 'prompt',
          plataforma: p.id,
          titulo: pr.tag,
          contexto: m.name,
          texto: pr.text,
          href: `/${p.id}/${m.slug}#prompt-${pr.id}`,
          moduloId: m.id,
        });
      }
    }

    for (const f of p.faqs) {
      entradas.push({
        grupo: 'ayuda',
        plataforma: p.id,
        titulo: f.question,
        contexto: 'Preguntas frecuentes',
        texto: f.answer,
        href: `/${p.id}#faq-${f.id}`,
      });
    }
    for (const x of p.practices) {
      entradas.push({
        grupo: 'ayuda',
        plataforma: p.id,
        titulo: x.title,
        contexto: 'Buenas prácticas',
        texto: x.description,
        href: `/${p.id}#practicas`,
      });
    }
    for (const s of p.specials) {
      entradas.push({
        grupo: 'ayuda',
        plataforma: p.id,
        titulo: s.title,
        contexto: junta('Diferenciales', s.kicker),
        texto: junta(s.description, s.example),
        href: `/${p.id}#diferenciales`,
      });
    }
    if (p.helpTitle || p.helpText) {
      entradas.push({
        grupo: 'ayuda',
        plataforma: p.id,
        titulo: p.helpTitle ?? 'Ayuda durante la práctica',
        contexto: 'Soporte',
        texto: p.helpText ?? '',
        href: `/${p.id}`,
      });
    }

    for (const pl of p.plans) {
      entradas.push({
        grupo: 'plan',
        plataforma: p.id,
        titulo: pl.name,
        contexto: junta(`Plan ${pl.audience}`, pl.price),
        texto: junta(pl.summary, pl.note),
        href: `/${p.id}?plan=${encodeURIComponent(pl.key)}#planes`,
      });
    }
    for (const mo of p.models) {
      entradas.push({
        grupo: 'plan',
        plataforma: p.id,
        titulo: mo.name,
        contexto: 'Modelo',
        texto: mo.description ?? '',
        href: `/${p.id}#planes`,
      });
    }

    for (const d of p.downloads) {
      entradas.push({
        grupo: 'material',
        plataforma: p.id,
        titulo: d.title,
        contexto: junta('Material', d.meta),
        texto: d.description ?? '',
        href: `/${p.id}#material`,
      });
    }
    for (const l of p.links) {
      entradas.push({
        grupo: 'material',
        plataforma: p.id,
        titulo: l.label,
        contexto: 'Enlace oficial',
        texto: l.href,
        href: l.href,
        externo: true,
      });
    }

    const curso = getCurso(p.id);
    if (curso) {
      for (const { leccion, unidad } of leccionesDe(curso)) {
        const nivel = curso.niveles.find((n) => n.key === unidad.nivel);
        entradas.push({
          grupo: 'leccion',
          plataforma: p.id,
          titulo: leccion.titulo,
          contexto: junta(nivel?.titulo, unidad.titulo),
          texto: textoDeLeccion(leccion),
          href: `/ruta/${p.id}/${leccion.slug}`,
          leccion: leccion.slug,
        });
      }
    }
  }

  return {
    plataformas,
    entradas: entradas.map((e) => ({
      ...e,
      nTitulo: normalizar(e.titulo),
      nContexto: normalizar(e.contexto),
      nTexto: normalizar(e.texto),
    })),
  };
}

/**
 * Lo buscable de una lección. De los exámenes solo entra el resumen: los
 * enunciados y las opciones no se exponen fuera del examen.
 */
function textoDeLeccion(l: Leccion) {
  const partes: string[] = [l.resumen];
  if (l.tipo === 'lectura') partes.push(...l.objetivos);
  if (l.tipo === 'practica') partes.push(l.caso.tarea, l.consigna);
  if (l.tipo !== 'examen') partes.push(...l.bloques.map(textoDeBloque));
  return junta(...partes);
}

function textoDeBloque(b: Bloque): string {
  switch (b.tipo) {
    case 'texto':
    case 'subtitulo':
      return b.texto;
    case 'lista':
      return b.items.join(' · ');
    case 'nota':
      return `${b.titulo}: ${b.texto}`;
    case 'conceptos':
      return b.items.map((i) => `${i.termino}: ${i.definicion}`).join(' · ');
    case 'codigo':
      return junta(b.titulo, b.explicacion);
    case 'prompt':
      return `${b.etiqueta}: ${b.texto}`;
    case 'comparar':
      return junta(b.antes.titulo, b.antes.texto, b.despues.titulo, b.despues.texto);
    case 'chat':
      return junta(b.titulo, b.pregunta);
    default:
      return '';
  }
}

/* ----------------------------------------------------------------- búsqueda */

export type Resultado = {
  grupo: GrupoKey;
  titulo: string;
  contexto: string;
  fragmento: string | null;
  href: string;
  externo: boolean;
  plataforma: { id: string; name: string; color: string };
};

export type Respuesta = {
  grupos: { key: GrupoKey; titulo: string; total: number; resultados: Resultado[] }[];
  total: number;
};

const POR_GRUPO = 5;

/** Lecciones que la ruta de esta persona muestra, por plataforma. */
function leccionesVisibles(indice: Indice, scope: Scope) {
  const visibles = new Map<string, Set<string>>();
  for (const p of indice.plataformas.values()) {
    const curso = getCurso(p.id);
    if (!curso) continue;
    const recortado = cursoEnAlcance(curso, (slug) => {
      const id = p.modulos.get(slug);
      return id !== undefined && hasModule(scope, id);
    });
    visibles.set(p.id, new Set(leccionesDe(recortado).map((l) => l.leccion.slug)));
  }
  return visibles;
}

export async function buscar(
  consulta: string,
  { scope, plataforma }: { scope: Scope; plataforma?: string },
): Promise<Respuesta> {
  const palabras = terminos(consulta);
  if (palabras.length === 0) return { grupos: [], total: 0 };

  const indice = await obtenerIndice();
  const frase = palabras.join(' ');
  const lecciones = leccionesVisibles(indice, scope);

  const encontrados: { e: Entrada; puntos: number }[] = [];

  for (const e of indice.entradas) {
    if (plataforma && e.plataforma !== plataforma) continue;
    if (!hasPlatform(scope, e.plataforma)) continue;
    if (e.moduloId !== undefined && !hasModule(scope, e.moduloId)) continue;
    if (e.leccion && !lecciones.get(e.plataforma)?.has(e.leccion)) continue;

    const puntos = puntuar(e, palabras, frase);
    if (puntos > 0) encontrados.push({ e, puntos });
  }

  encontrados.sort((a, b) => b.puntos - a.puntos);

  const grupos = GRUPOS.map(({ key, titulo }) => {
    const delGrupo = encontrados.filter((x) => x.e.grupo === key);
    return {
      key,
      titulo,
      total: delGrupo.length,
      resultados: delGrupo.slice(0, POR_GRUPO).map(({ e }) => aResultado(e, indice, palabras)),
    };
  }).filter((g) => g.total > 0);

  // El grupo con el mejor resultado va primero, como en Jira: lo que más se
  // parece a lo escrito no debería quedar debajo de cinco prompts.
  const mejor = (key: GrupoKey) => encontrados.find((x) => x.e.grupo === key)?.puntos ?? 0;
  grupos.sort((a, b) => mejor(b.key) - mejor(a.key));

  return { grupos, total: encontrados.length };
}

/** Cero si falta alguna palabra. El título pesa más que el cuerpo. */
function puntuar(e: Entrada, palabras: string[], frase: string) {
  let puntos = 0;
  for (const p of palabras) {
    const enTitulo = e.nTitulo.indexOf(p);
    if (enTitulo >= 0) {
      puntos += inicioDePalabra(e.nTitulo, enTitulo) ? 12 : 7;
    } else if (e.nContexto.includes(p)) {
      puntos += 4;
    } else if (e.nTexto.includes(p)) {
      puntos += 1.5;
    } else {
      return 0;
    }
  }
  if (e.nTitulo.startsWith(frase)) puntos += 20;
  else if (palabras.length > 1 && e.nTitulo.includes(frase)) puntos += 12;
  // A igual coincidencia, el título corto es el que más se parece.
  return puntos + 1 / (1 + e.nTitulo.length / 40);
}

const inicioDePalabra = (texto: string, i: number) => i === 0 || !/[\p{L}\p{N}]/u.test(texto[i - 1]);

function aResultado(e: Entrada, indice: Indice, palabras: string[]): Resultado {
  const p = indice.plataformas.get(e.plataforma)!;
  return {
    grupo: e.grupo,
    titulo: e.titulo,
    contexto: e.contexto,
    fragmento: fragmento(e, palabras),
    href: e.href,
    externo: Boolean(e.externo),
    plataforma: { id: p.id, name: p.name, color: p.color },
  };
}

/**
 * El pedazo del cuerpo donde aparece lo buscado. Si todo se encontró en el
 * título, se muestra el comienzo del cuerpo, que suele ser el resumen.
 */
function fragmento(e: Entrada, palabras: string[]) {
  if (!e.texto || e.externo) return null;

  const posiciones = palabras.map((p) => e.nTexto.indexOf(p)).filter((i) => i >= 0);
  const antes = 40;
  const largo = 150;

  if (posiciones.length === 0) {
    return e.texto.length > largo ? `${e.texto.slice(0, largo).trimEnd()}…` : e.texto;
  }

  const primera = Math.min(...posiciones);
  let desde = Math.max(0, primera - antes);
  // Se arranca en un límite de palabra para no mostrar medio término.
  if (desde > 0) {
    const espacio = e.texto.indexOf(' ', desde);
    if (espacio >= 0 && espacio < primera) desde = espacio + 1;
  }
  const hasta = Math.min(e.texto.length, desde + largo);
  return `${desde > 0 ? '…' : ''}${e.texto.slice(desde, hasta).trim()}${hasta < e.texto.length ? '…' : ''}`;
}
