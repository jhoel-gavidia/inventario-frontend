"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { RecentMovements } from "@/features/dashboard/components/RecentMovements";
import { TodayFlow } from "@/features/dashboard/components/TodayFlow";

export default function DashboardPage() {
  const { isChecking } = useAuth();

  if (isChecking) {
    return null;
  }

  return (
    <main className="relative w-full bg-surface px-6 py-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        {/* Encabezado */}
        <div className="flex flex-col justify-between gap-3 py-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Panel de Control
            </h1>

            <p className="mt-0.5 text-xs text-secondary">
              Almacén y Repuestos • Jhoelito
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700"
            >
              + Entrada
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-surface-container-lowest px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              − Salida
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              Ajuste
            </button>
          </div>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="flex flex-col gap-5 xl:col-span-8">
            <RecentMovements />
          </div>

          <div className="flex flex-col gap-5 xl:col-span-4">
            <TodayFlow />
          </div>
        </div>
      </div>
    </main>
  );
}