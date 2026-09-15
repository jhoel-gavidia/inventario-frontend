import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface-container-lowest p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Compass size={22} />
        </div>

        <p className="font-mono text-xs font-bold uppercase tracking-widest text-secondary">
          404
        </p>

        <h1 className="mt-1 text-lg font-bold text-on-surface">
          Página no encontrada
        </h1>

        <p className="mt-2 text-sm leading-6 text-outline">
          La página que buscas no existe o fue movida.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}