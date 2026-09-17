import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

/** Marco de las páginas de cuenta: el mismo del ingreso con código. */
export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-bg">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-[13px] text-faint transition-colors hover:text-primary">
          ← Aula Virtual
        </Link>
        <ThemeToggle />
      </div>

      <main className="grid place-items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}
