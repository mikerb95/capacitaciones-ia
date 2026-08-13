import { adminLogout } from '@/app/admin/login/actions';

/** Cierra la sesión del panel. Vive en el encabezado de todas las pantallas de admin. */
export function AdminLogoutButton() {
  return (
    <form action={adminLogout}>
      <button
        type="submit"
        className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-faint transition-colors hover:border-primary hover:text-text"
      >
        Salir
      </button>
    </form>
  );
}
