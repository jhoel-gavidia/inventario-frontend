import {
  AlertCircle,
  CheckCircle2,
  CircleOff,
} from "lucide-react";

import type { DashboardStats } from "../types/dashboard";

interface InventoryStatusProps {
  stats: DashboardStats;
}

export function InventoryStatus({
  stats,
}: InventoryStatusProps) {
  const totalActive =
    stats.productsInStock + stats.productsOutOfStock;

  const stockPercentage =
    totalActive > 0
      ? Math.round(
          (stats.productsInStock / totalActive) * 100,
        )
      : 0;

  return (
    <section className="rounded-xl border border-[#e5e7ef] bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-[#0b1c30]">
            Estado del inventario
          </h2>

          <p className="mt-1 text-xs text-[#737686]">
            Situación actual de los productos activos.
          </p>
        </div>

        <span className="font-mono text-sm font-medium text-[#737686]">
          {stockPercentage}%
        </span>
      </div>

      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-[#eff4ff]">
          <div
            className="h-full rounded-full bg-[#2563eb] transition-all"
            style={{
              width: `${stockPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#effaf2] text-[#16823b]">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-[#0b1c30]">
              {stats.productsInStock}
            </p>

            <p className="text-xs text-[#737686]">
              En stock
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff8eb] text-[#b7791f]">
            <AlertCircle size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-[#0b1c30]">
              {stats.productsOutOfStock}
            </p>

            <p className="text-xs text-[#737686]">
              Agotados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f2f5] text-[#737686]">
            <CircleOff size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-[#0b1c30]">
              {stats.inactiveProducts}
            </p>

            <p className="text-xs text-[#737686]">
              Inactivos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}