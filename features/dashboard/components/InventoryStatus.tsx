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
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-on-surface">
            Estado del inventario
          </h2>

          <p className="mt-1 text-xs text-outline">
            Situación actual de los productos activos.
          </p>
        </div>

        <span className="font-mono text-sm font-medium text-outline">
          {stockPercentage}%
        </span>
      </div>

      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-surface-container-low">
          <div
            className="h-full rounded-full bg-primary-container transition-all"
            style={{
              width: `${stockPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-container text-success">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-on-surface">
              {stats.productsInStock}
            </p>

            <p className="text-xs text-outline">
              En stock
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-container text-warning">
            <AlertCircle size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-on-surface">
              {stats.productsOutOfStock}
            </p>

            <p className="text-xs text-outline">
              Agotados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-soft text-outline">
            <CircleOff size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-on-surface">
              {stats.inactiveProducts}
            </p>

            <p className="text-xs text-outline">
              Inactivos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}