'use server';

import { refresh } from 'next/cache';
import { saveCourseProgress } from '@/db/queries';
import {
  DIAGNOSTICO,
  buscarLeccion,
  calificarExamen,
  nivelDePartida,
  type NivelKey,
  type ResultadoExamen,
} from '@/lib/ruta';
import { cargarCurso } from '@/lib/ruta/contexto';
import {
  TOPE_PRACTICA,
  TOPE_PROYECTO,
  practicaAprobada,
  puntajeDe,
  revisarPractica,
  type RevisionPractica,
} from '@/lib/ruta/evaluador';

/**
 * Acciones de la ruta guiada. Del navegador llegan solo llaves y respuestas:
 * el temario, las respuestas correctas y las rúbricas se releen del servidor
 * en cada llamada, porque son lo que le da valor al avance y no se le pueden
 * creer al cliente.
 */

type Fallo = { error: string };

async function leccionDe(platformId: string, slug: string) {
  const cargado = await cargarCurso(platformId);
  if (!cargado) return null;
  const ubicada = buscarLeccion(cargado.curso, slug);
  if (!ubicada) return null;
  return { ...cargado, ...ubicada };
}

/** Marca una lectura como completada. Pide haber contestado el chequeo, que se valida en el cliente. */
export async function completarLectura(platformId: string, slug: string): Promise<Fallo | { ok: true }> {
  const found = await leccionDe(platformId, slug);
  if (!found || found.leccion.tipo !== 'lectura') return { error: 'Esa lección no está en tu ruta.' };

  await saveCourseProgress(found.participant.id, platformId, slug, { completed: true });
  refresh();
  return { ok: true };
}

export async function enviarExamen(
  platformId: string,
  slug: string,
  respuestas: Record<string, number>,
): Promise<Fallo | ResultadoExamen> {
  const found = await leccionDe(platformId, slug);
  if (!found || found.leccion.tipo !== 'examen') return { error: 'Ese examen no está en tu ruta.' };

  const examen = found.leccion;
  const faltan = examen.preguntas.filter((p) => !Number.isInteger(respuestas[p.id]));
  if (faltan.length) {
    return {
      error:
        faltan.length === 1 ? 'Te falta contestar una pregunta.' : `Te faltan ${faltan.length} preguntas.`,
    };
  }

  const nota = calificarExamen(examen, respuestas);
  const row = await saveCourseProgress(found.participant.id, platformId, slug, {
    completed: nota.aprobado,
    score: nota.puntaje,
    attempt: true,
  });

  refresh();
  return {
    ...nota,
    aprobacion: examen.aprobacion,
    intentos: row?.attempts ?? 1,
    mejorPuntaje: row?.score ?? nota.puntaje,
  };
}

export type EntregaPractica = {
  revision: RevisionPractica;
  puntaje: number | null;
  completada: boolean;
  recortado: boolean;
};

export async function revisarEntrega(
  platformId: string,
  slug: string,
  texto: string,
): Promise<Fallo | EntregaPractica> {
  const found = await leccionDe(platformId, slug);
  if (!found || found.leccion.tipo !== 'practica') return { error: 'Esa práctica no está en tu ruta.' };

  const practica = found.leccion;
  const limpio = texto.trim();
  if (limpio.length < 30) return { error: 'Escribe un poco más para poder revisarlo.' };

  const tope = practica.proyecto ? TOPE_PROYECTO : TOPE_PRACTICA;
  const revision = await revisarPractica(practica, limpio.slice(0, tope), found.curso.titulo);

  if (revision.via === 'manual') {
    // Sin revisor disponible no hay puntaje todavía: se anota el intento y el
    // puntaje llega cuando la persona se autoevalúe.
    await saveCourseProgress(found.participant.id, platformId, slug, { attempt: true });
    refresh();
    return { revision, puntaje: null, completada: false, recortado: limpio.length > tope };
  }

  const cumplidos = revision.veredicto.criterios.filter((c) => c.cumple).length;
  const puntaje = puntajeDe(cumplidos, practica.rubrica.length);
  const completada = practicaAprobada(practica, puntaje);

  await saveCourseProgress(found.participant.id, platformId, slug, {
    completed: completada,
    score: puntaje,
    attempt: true,
  });

  refresh();
  return { revision, puntaje, completada, recortado: limpio.length > tope };
}

/**
 * La autoevaluación, cuando no hubo revisor. Se le cree a la persona: el
 * portal no protege nada que valga la pena falsear, y quien se marca todo sin
 * haberlo escrito solo se engaña a sí mismo.
 */
export async function autoevaluar(
  platformId: string,
  slug: string,
  marcados: string[],
): Promise<Fallo | { puntaje: number; completada: boolean }> {
  const found = await leccionDe(platformId, slug);
  if (!found || found.leccion.tipo !== 'practica') return { error: 'Esa práctica no está en tu ruta.' };

  const practica = found.leccion;
  const validos = new Set(practica.rubrica.map((c) => c.id));
  const cumplidos = new Set(marcados.filter((id) => validos.has(id))).size;
  const puntaje = puntajeDe(cumplidos, practica.rubrica.length);
  const completada = practicaAprobada(practica, puntaje);

  await saveCourseProgress(found.participant.id, platformId, slug, { completed: completada, score: puntaje });
  refresh();
  return { puntaje, completada };
}

export type ResultadoDiagnostico = {
  nivel: NivelKey;
  porNivel: { nivel: NivelKey; aciertos: number; total: number }[];
};

export async function guardarDiagnostico(
  platformId: string,
  respuestas: Record<string, number>,
): Promise<Fallo | ResultadoDiagnostico> {
  const cargado = await cargarCurso(platformId);
  if (!cargado) return { error: 'Esta ruta no está en tu capacitación.' };

  const { curso, participant } = cargado;
  const preguntas = curso.diagnostico;
  if (preguntas.some((p) => !Number.isInteger(respuestas[p.id]))) {
    return { error: 'Contesta todas las preguntas. Si no sabes, elige "No lo sé".' };
  }

  const nivel = nivelDePartida(curso, preguntas, respuestas);
  const porNivel = curso.niveles.map((n) => {
    const del = preguntas.filter((p) => p.nivel === n.key);
    return {
      nivel: n.key,
      total: del.length,
      aciertos: del.filter((p) => p.opciones[respuestas[p.id]]?.correcta).length,
    };
  });
  const aciertos = porNivel.reduce((s, n) => s + n.aciertos, 0);

  await saveCourseProgress(participant.id, platformId, DIAGNOSTICO, {
    completed: true,
    score: puntajeDe(aciertos, preguntas.length),
    attempt: true,
    result: nivel,
  });

  refresh();
  return { nivel, porNivel };
}
