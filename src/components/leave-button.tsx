import Link from 'next/link';
import { leave } from '@/app/ingresar/actions';

/**
 * Cierra la sesión del asistente. Va en la cabecera de las páginas públicas.
 * A quien entró solo con el código le ofrece crear la cuenta, que es lo que
 * hace que su avance lo siga a otro dispositivo.
 */
export function LeaveButton({ name, hasAccount = false }: { name?: string; hasAccount?: boolean }) {
  return (
    <form action={leave} className="flex items-center gap-2">
      {name && <span className="hidden text-[12.5px] text-faint sm:inline">{name}</span>}
      {!hasAccount && (
        <Link
          href="/cuenta/crear"
          className="rounded-[10px] bg-primary-soft px-3 py-2 text-[12.5px] font-semibold text-primary transition-opacity hover:opacity-85"
        >
          Guardar mi avance
        </Link>
      )}
      <button
        type="submit"
        className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
      >
        Salir
      </button>
    </form>
  );
}
