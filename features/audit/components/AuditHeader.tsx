"use client";

import { Download, RefreshCw, ShieldCheck } from "lucide-react";

interface AuditHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExport: () => void;
  canExport: boolean;
}

export function AuditHeader({
  onRefresh,
  isLoading,
  onExport,
  canExport,
}: AuditHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-on-surface sm:text-2xl">
              Módulo de Auditoría
            </h1>

            <p className="mt-0.5 text-xs text-outline">
              Registro histórico de operaciones y cambios en el sistema.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={15}
            className={isLoading ? "animate-spin" : ""}
          />

          Actualizar
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={!canExport}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} />

          Exportar CSV
        </button>
      </div>
    </div>
  );
}