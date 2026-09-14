"use client";

import { CalendarDays, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 border-b border-line bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-on-surface">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-outline">
          Resumen general del inventario
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-sm text-outline sm:flex">
          <CalendarDays className="h-4 w-4" />

          <span className="capitalize">{today}</span>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />

          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>
    </header>
  );
}