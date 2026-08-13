import { leave } from '@/app/ingresar/actions';

/** Cierra la sesión del asistente. Va en la cabecera de las páginas públicas. */
export function LeaveButton({ name }: { name?: string }) {
  return (
    <form action={leave} className="flex items-center gap-2">
      {name && <span className="hidden text-[12.5px] text-faint sm:inline">{name}</span>}
      <button
        type="submit"
        className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
      >
        Salir
      </button>
    </form>
  );
}
