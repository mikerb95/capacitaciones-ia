import { copilotCurso } from './copilot';
import { jiraCurso } from './jira';
import type {
  Curso,
  EstadoLeccion,
  Examen,
  Leccion,
  NivelKey,
  Pregunta,
  PreguntaDiagnostico,
  RegistroLeccion,
  Unidad,
} from './tipos';

export * from './tipos';

/**
 * Cursos disponibles, por plataforma. Una plataforma sin curso sigue teniendo
 * su portal y sus módulos: la ruta es un extra, no un requisito.
 */
const CURSOS: Record<string, Curso> = {
  jira: jiraCurso,
  copilot: copilotCurso,
};

/** La llave del diagnóstico en la tabla de avance. No choca con ninguna lección. */
export const DIAGNOSTICO = 'diagnostico';

/** Segmentos de la ruta que no son lecciones. Un slug de lección no puede llamarse así. */
const RESERVADOS = new Set([DIAGNOSTICO, 'certificado']);

export function getCurso(platformId: string): Curso | null {
  return CURSOS[platformId] ?? null;
}

/**
 * El curso recortado al alcance del código: se van las unidades cuyo módulo no
 * entra en la capacitación. Las unidades sin módulo (los fundamentos, el cierre)
 * se quedan siempre, porque no dependen de un producto que la empresa pague.
 *
 * Dentro de las unidades que sí se quedan, un examen puede tener preguntas de
 * un módulo fuera de alcance (así arma un curso como Copilot, con exámenes de
 * cierre que evalúan varios módulos a la vez): esas preguntas se recortan una
 * por una, y si al examen le quedan menos de tres, la lección entera se va. El
 * diagnóstico se recorta con la misma regla, pregunta por pregunta.
 */
export function cursoEnAlcance(curso: Curso, moduloVisible: (slug: string) => boolean): Curso {
  const enAlcance = (p: Pregunta) => !p.modulo || moduloVisible(p.modulo);

  const unidades = curso.unidades
    .filter((u) => !u.modulo || moduloVisible(u.modulo))
    .map((u) => ({
      ...u,
      lecciones: u.lecciones.filter((l) => {
        if (l.tipo !== 'examen') return true;
        return l.preguntas.filter(enAlcance).length >= MINIMO_PREGUNTAS_EXAMEN;
      }),
    }))
    .map((u) => ({
      ...u,
      lecciones: u.lecciones.map((l) =>
        l.tipo === 'examen' ? { ...l, preguntas: l.preguntas.filter(enAlcance) } : l,
      ),
    }))
    .filter((u) => u.lecciones.length > 0);

  return {
    ...curso,
    unidades,
    diagnostico: curso.diagnostico.filter(enAlcance),
  };
}

/** Bajo esto un examen deja de medir algo y se retira en vez de mostrarse vacío. */
const MINIMO_PREGUNTAS_EXAMEN = 3;

export type LeccionUbicada = {
  leccion: Leccion;
  unidad: Unidad;
  /** Posición en el curso entero, desde 0. */
  indice: number;
  /** Posición dentro de la unidad, desde 1. */
  numero: number;
};

/** El curso aplanado en el orden en que se recorre. */
export function leccionesDe(curso: Curso): LeccionUbicada[] {
  const lista: LeccionUbicada[] = [];
  for (const unidad of curso.unidades) {
    unidad.lecciones.forEach((leccion, i) => {
      lista.push({ leccion, unidad, indice: lista.length, numero: i + 1 });
    });
  }
  return lista;
}

export function buscarLeccion(curso: Curso, slug: string) {
  if (RESERVADOS.has(slug)) return null;
  return leccionesDe(curso).find((l) => l.leccion.slug === slug) ?? null;
}

export function estadoDe(registro: RegistroLeccion | undefined): EstadoLeccion {
  if (!registro) return 'pendiente';
  if (registro.completed) return 'completada';
  return registro.attempts > 0 ? 'reprobada' : 'pendiente';
}

/** Minutos a una etiqueta corta: "25 min", "2 h", "3 h 40 min". */
export function duracion(minutos: number) {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/* --------------------------------------------------------------- resumen */

export type Resumen = {
  total: number;
  completadas: number;
  porcentaje: number;
  minutosTotales: number;
  minutosRestantes: number;
  examenes: { total: number; aprobados: number };
  proyecto: { slug: string; titulo: string; entregado: boolean } | null;
  /** Nivel desde el que conviene arrancar según el diagnóstico, si lo hizo. */
  partida: NivelKey | null;
  /** La lección con la que sigue. `null` cuando ya no queda nada. */
  siguiente: LeccionUbicada | null;
  certificable: boolean;
};

/**
 * Todo lo que la portada y el reproductor necesitan saber del avance, de una
 * sola pasada.
 *
 * La siguiente lección arranca en el nivel que marcó el diagnóstico: quien ya
 * sabe qué es un sprint no tiene por qué empezar por ahí. Lo que quede atrás
 * sin hacer no se esconde, y cuando se acaba lo de adelante, se le ofrece.
 *
 * El certificado pide los exámenes y el proyecto, no las lecturas. Quien
 * aprueba el examen de fundamentos demostró lo que las lecturas enseñan, y
 * obligarlo a abrirlas una por una sería medir clics.
 */
export function resumir(curso: Curso, registros: RegistroLeccion[]): Resumen {
  const porSlug = new Map(registros.map((r) => [r.lessonSlug, r]));
  const lecciones = leccionesDe(curso);
  const hecha = (l: LeccionUbicada) => porSlug.get(l.leccion.slug)?.completed === true;

  const completadas = lecciones.filter(hecha);
  const minutosTotales = lecciones.reduce((n, l) => n + l.leccion.minutos, 0);
  const minutosHechos = completadas.reduce((n, l) => n + l.leccion.minutos, 0);

  const examenes = lecciones.filter((l) => l.leccion.tipo === 'examen');
  const proyecto = lecciones.find((l) => l.leccion.tipo === 'practica' && l.leccion.proyecto);

  const partidaGuardada = porSlug.get(DIAGNOSTICO)?.result as NivelKey | undefined;
  const partida =
    partidaGuardada && curso.niveles.some((n) => n.key === partidaGuardada)
      ? partidaGuardada
      : null;

  // "En el nivel o después": si el alcance del código dejó ese nivel sin
  // unidades, se arranca en el siguiente que sí tenga.
  const orden = curso.niveles.map((n) => n.key);
  const desde = partida
    ? lecciones.findIndex((l) => orden.indexOf(l.unidad.nivel) >= orden.indexOf(partida))
    : 0;
  const siguiente =
    (desde >= 0 ? lecciones.slice(desde).find((l) => !hecha(l)) : undefined) ??
    lecciones.find((l) => !hecha(l)) ??
    null;

  const aprobados = examenes.filter(hecha).length;
  const entregado = proyecto ? hecha(proyecto) : true;

  return {
    total: lecciones.length,
    completadas: completadas.length,
    porcentaje: lecciones.length ? Math.round((completadas.length / lecciones.length) * 100) : 0,
    minutosTotales,
    minutosRestantes: minutosTotales - minutosHechos,
    examenes: { total: examenes.length, aprobados },
    proyecto: proyecto
      ? { slug: proyecto.leccion.slug, titulo: proyecto.leccion.titulo, entregado }
      : null,
    partida,
    siguiente,
    certificable: examenes.length > 0 && aprobados === examenes.length && entregado,
  };
}

/* ---------------------------------------------------------- calificación */

/**
 * Lo que viaja al navegador de un examen: el enunciado y las opciones, sin cuál
 * es la correcta ni las explicaciones. Eso se queda en el servidor y vuelve
 * solo después de enviar, que es lo que hace que el examen mida algo.
 */
export type PreguntaPublica = { id: string; enunciado: string; opciones: string[] };

export function sinRespuestas(preguntas: Pregunta[]): PreguntaPublica[] {
  return preguntas.map((p) => ({
    id: p.id,
    enunciado: p.enunciado,
    opciones: p.opciones.map((o) => o.texto),
  }));
}

export type DetallePregunta = {
  id: string;
  elegida: number | null;
  acerto: boolean;
  /** Por qué la opción elegida es o no es. */
  explicacion: string | null;
  /** La correcta y su explicación, solo cuando el examen quedó aprobado. */
  correcta: number | null;
  explicacionCorrecta: string | null;
};

export type ResultadoExamen = {
  puntaje: number;
  aprobado: boolean;
  aprobacion: number;
  aciertos: number;
  total: number;
  intentos: number;
  mejorPuntaje: number;
  detalle: DetallePregunta[];
};

/**
 * Califica un envío. La correcta se revela solo si aprobó: mostrarla en cada
 * intento reprobado convierte el examen en un "prueba y copia". Quien reprueba
 * sí ve, pregunta por pregunta, si acertó y por qué su opción no era.
 */
export function calificarExamen(examen: Examen, respuestas: Record<string, number>) {
  let aciertos = 0;

  const parcial = examen.preguntas.map((p) => {
    const elegida = Number.isInteger(respuestas[p.id]) ? respuestas[p.id] : null;
    const opcion = elegida !== null ? p.opciones[elegida] : undefined;
    const correcta = p.opciones.findIndex((o) => o.correcta);
    const acerto = Boolean(opcion?.correcta);
    if (acerto) aciertos++;
    return { p, elegida: opcion ? elegida : null, acerto, correcta, opcion };
  });

  const total = examen.preguntas.length;
  const puntaje = total ? Math.round((aciertos / total) * 100) : 0;
  const aprobado = puntaje >= examen.aprobacion;

  const detalle: DetallePregunta[] = parcial.map(({ p, elegida, acerto, correcta, opcion }) => ({
    id: p.id,
    elegida,
    acerto,
    explicacion: opcion?.explicacion ?? null,
    correcta: aprobado ? correcta : null,
    explicacionCorrecta: aprobado ? (p.opciones[correcta]?.explicacion ?? null) : null,
  }));

  return { puntaje, aprobado, aciertos, total, detalle };
}

/**
 * El nivel de partida: el primero donde la persona falla alguna pregunta. Si
 * contesta bien todo lo de fundamentos y básico pero se equivoca en JQL, su
 * lugar es intermedio. Contestar todo bien la deja en experto, que es el
 * proyecto y el gobierno, no un "ya sabes todo".
 */
export function nivelDePartida(
  curso: Curso,
  preguntas: PreguntaDiagnostico[],
  respuestas: Record<string, number>,
) {
  for (const nivel of curso.niveles) {
    const delNivel = preguntas.filter((p) => p.nivel === nivel.key);
    const falla = delNivel.some((p) => !p.opciones[respuestas[p.id]]?.correcta);
    if (falla) return nivel.key;
  }
  return curso.niveles[curso.niveles.length - 1].key;
}
