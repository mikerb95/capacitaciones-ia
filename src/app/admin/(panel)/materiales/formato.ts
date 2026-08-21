import { MATERIALES } from '@/lib/materiales';
import type { StoredMaterial } from '@/lib/materiales-blob';

export const FECHA = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** Peso de un archivo en la unidad en que se deja leer de un vistazo. */
export function peso(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Cuántos documentos declara el catálogo en total. */
export const TOTAL_DOCS = Object.values(MATERIALES).flat().length;

/** ¿Este archivo del store corresponde a un documento que el catálogo declara? */
export const enCatalogo = (m: StoredMaterial) =>
  Boolean(MATERIALES[m.platformId]?.some((doc) => `${doc.slug}.${doc.kind}` === m.file));

/**
 * Cómo está la vigencia del material a medida. Es lo primero que hay que ver
 * en esta pantalla: con la fecha vacía o pasada, el portal sirve el genérico y
 * todo lo que esté subido da igual.
 */
export function vigencia(materialsUntil: Date | null, ahora: Date) {
  if (!materialsUntil) {
    return { estado: 'sin-fecha' as const, texto: 'Sin vigencia', vigente: false };
  }
  if (materialsUntil < ahora) {
    return {
      estado: 'vencida' as const,
      texto: `Venció el ${FECHA.format(materialsUntil)}`,
      vigente: false,
    };
  }
  return {
    estado: 'vigente' as const,
    texto: `Hasta el ${FECHA.format(materialsUntil)}`,
    vigente: true,
  };
}

/** El mismo chip de vigencia en las dos pantallas, con el mismo color. */
export const chipVigencia = {
  'sin-fecha': 'bg-surface-2 text-faint',
  vencida: 'bg-[#fdebe2] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]',
  vigente: 'bg-accent-soft text-accent',
} as const;
