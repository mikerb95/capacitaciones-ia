/**
 * La ruta guiada: un curso de punta a punta sobre una plataforma, pensado para
 * llevar a alguien que nunca abrió la herramienta hasta dejarla funcionando
 * sola en su equipo.
 *
 * El contenido vive en código y no en la base, a diferencia de los módulos.
 * Un curso no es una ficha que se retoca desde el admin: es un temario con
 * exámenes, respuestas correctas y rúbricas que se revisan juntos, y un cambio
 * suelto en una pregunta sin tocar su explicación rompe la lección. Lo que sí
 * va a la base es el avance de cada persona, que se guarda contra el `slug` de
 * la lección. Por eso los slugs no se renombran una vez publicados.
 */

/** Los cinco escalones del curso, de quien no sabe qué es un issue a quien diseña el sistema del equipo. */
export const NIVELES = ['cero', 'basico', 'intermedio', 'avanzado', 'experto'] as const;
export type NivelKey = (typeof NIVELES)[number];

export type Nivel = {
  key: NivelKey;
  titulo: string;
  /** Lo que la persona puede hacer al terminar el nivel, en una frase. */
  promesa: string;
  color: string;
};

/** Pieza de contenido de una lección. Se pintan en orden, una debajo de otra. */
export type Bloque =
  | { tipo: 'texto'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'lista'; items: string[]; ordenada?: boolean }
  | { tipo: 'nota'; tono: 'clave' | 'ojo' | 'dato'; titulo: string; texto: string }
  | { tipo: 'conceptos'; items: { termino: string; definicion: string }[] }
  | { tipo: 'codigo'; titulo?: string; codigo: string; explicacion?: string }
  | { tipo: 'prompt'; etiqueta: string; texto: string }
  | {
      tipo: 'comparar';
      antes: { titulo: string; texto: string };
      despues: { titulo: string; texto: string };
    }
  | {
      tipo: 'ticket';
      clave: string;
      tipoIssue: string;
      resumen: string;
      estado: string;
      campos: { campo: string; valor: string }[];
      descripcion?: string;
    }
  | { tipo: 'chat'; titulo?: string; pregunta: string; respuesta: string }
  | {
      tipo: 'tablero';
      titulo?: string;
      columnas: { nombre: string; tarjetas: { clave: string; texto: string }[] }[];
    };

/** Pregunta de opción única. Cada opción explica por qué es o no es, que es donde se aprende. */
export type Pregunta = {
  id: string;
  enunciado: string;
  opciones: { texto: string; correcta?: boolean; explicacion: string }[];
};

/** Criterio de la rúbrica de una práctica. Pregunta de sí o no, igual que en el entrenador. */
export type CriterioPractica = { id: string; titulo: string; pregunta: string };

type LeccionBase = {
  /** Único en todo el curso: es la llave del avance guardado. */
  slug: string;
  titulo: string;
  /** Duración estimada, para el temario y para el "te faltan X horas". */
  minutos: number;
  resumen: string;
};

export type Lectura = LeccionBase & {
  tipo: 'lectura';
  objetivos: string[];
  bloques: Bloque[];
  /** Comprobación rápida al final: no califica, pero hay que contestarla para seguir. */
  chequeo: Pregunta[];
};

export type Practica = LeccionBase & {
  tipo: 'practica';
  /** El proyecto final: la práctica que integra todo y que pide el certificado. */
  proyecto?: boolean;
  bloques: Bloque[];
  caso: { rol: string; tarea: string; situacion: string };
  consigna: string;
  placeholder?: string;
  rubrica: CriterioPractica[];
  /** Cómo la resolvimos nosotros. Se muestra solo después de intentar. */
  solucion: string;
  pistas: string[];
};

export type Examen = LeccionBase & {
  tipo: 'examen';
  /** Porcentaje mínimo para aprobar, de 0 a 100. */
  aprobacion: number;
  preguntas: Pregunta[];
};

export type Leccion = Lectura | Practica | Examen;
export type TipoLeccion = Leccion['tipo'];

export type Unidad = {
  slug: string;
  titulo: string;
  descripcion: string;
  nivel: NivelKey;
  /**
   * El módulo del portal que la unidad profundiza. Sirve para dos cosas: si el
   * código de acceso no incluye ese módulo la unidad no se muestra, y abrir sus
   * lecciones cuenta como módulo recorrido en el panel de la empresa.
   */
  modulo?: string;
  lecciones: Leccion[];
};

export type PreguntaDiagnostico = Pregunta & { nivel: NivelKey };

export type Curso = {
  platformId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  color: string;
  aprendizajes: string[];
  requisitos: string[];
  niveles: Nivel[];
  unidades: Unidad[];
  diagnostico: PreguntaDiagnostico[];
};

/* ------------------------------------------------------------------ avance */

/** Lo que la base sabe de una lección para una persona. */
export type RegistroLeccion = {
  lessonSlug: string;
  completed: boolean;
  score: number | null;
  attempts: number;
  result: string | null;
};

export type EstadoLeccion = 'completada' | 'pendiente' | 'reprobada';
