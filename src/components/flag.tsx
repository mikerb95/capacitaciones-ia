import * as flags from 'country-flag-icons/react/3x2';
import type { ComponentType, HTMLAttributes, SVGAttributes } from 'react';

type FlagProps = HTMLAttributes<HTMLElement> & SVGAttributes<HTMLElement>;

const FLAG_COMPONENTS = flags as Record<string, ComponentType<FlagProps>>;

/**
 * Bandera en SVG por código ISO, en vez de emoji: en Windows no hay glifos
 * de bandera y el emoji se ve como el par de letras.
 */
export function Flag({ code, className }: { code: string; className?: string }) {
  const Icon = FLAG_COMPONENTS[code.toUpperCase()];
  if (!Icon) return null;
  return <Icon className={className} aria-label={code} />;
}
