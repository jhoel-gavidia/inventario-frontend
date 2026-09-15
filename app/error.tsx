"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({
  error,
  retry,
}: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface-container-lowest p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-error-container text-error">
          <AlertTriangle size={22} />
        </div>

        <h1 className="text-lg font-bold text-on-surface">
          Algo salió mal
        </h1>

        <p className="mt-2 text-sm leading-6 text-outline">
          Ocurrió un error inesperado al procesar tu solicitud.
        </p>

        {error.digest && (
          <p className="mt-2 font-mono text-[11px] text-ink-faint">
            Código: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          <RotateCcw size={16} />
          Reintentar
        </button>
      </div>
    </main>
  );
}