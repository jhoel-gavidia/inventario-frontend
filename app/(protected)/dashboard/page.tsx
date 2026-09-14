"use client";

import { RefreshCw } from "lucide-react";

import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";

import { InventoryStatus } from "@/features/dashboard/components/InventoryStatus";
import { CategoryDistribution } from "@/features/dashboard/components/CategoryDistribution";
import { DashboardKpis } from "@/features/dashboard/components/DashboardKpis";
import { AttentionPanel } from "@/features/dashboard/components/AttentionPanel";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

export default function DashboardPage() {
  const {
    stats,
    isLoading,
    error,
    refreshDashboard,
  } = useDashboard();

  return (
    <main className="min-h-full bg-[#f8f9ff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        <header className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0b1c30]">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#737686]">
              Resumen general del inventario.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refreshDashboard()}
            disabled={isLoading}
            className="flex h-10 items-center gap-2 rounded-lg border border-[#dfe2ea] bg-white px-4 text-sm font-medium text-[#434655] transition hover:bg-[#f8f9ff] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isLoading ? "animate-spin" : ""
              }
            />
            Actualizar
          </button>
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-[#f2cccc] bg-[#fff7f7] px-4 py-3 text-sm text-[#ba1a1a]">
            {error}
          </div>
        ) : null}

        <DashboardKpis
          stats={stats}
          isLoading={isLoading}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-7">
            <InventoryStatus stats={stats} />

            <CategoryDistribution
              categories={stats.categoryStats}
            />
          </div>

          <div className="space-y-6 xl:col-span-5">
            <AttentionPanel
              products={stats.attentionProducts}
            />

            <RecentActivity
              movements={stats.recentMovements}
            />
          </div>
        </div>

        <div className="mt-6">
          <QuickActions />
        </div>
      </div>
    </main>
  );
}