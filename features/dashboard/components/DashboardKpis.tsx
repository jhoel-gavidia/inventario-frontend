import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Package,
} from "lucide-react";

import type { DashboardStats } from "../types/dashboard";

interface DashboardKpisProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function DashboardKpis({ stats }: DashboardKpisProps) {
  const kpis = [
    {
      label: "Productos",
      value: stats.totalProducts,
      description: "registrados",
      icon: Package,
    },
    {
      label: "Stock disponible",
      value: stats.totalStock,
      description: "unidades",
      icon: Boxes,
    },
    {
      label: "Entradas",
      value: stats.totalEntries,
      description: "unidades ingresadas",
      icon: ArrowDownToLine,
    },
    {
      label: "Salidas",
      value: stats.totalExits,
      description: "unidades retiradas",
      icon: ArrowUpFromLine,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <article
            key={kpi.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {kpi.label}
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {kpi.value.toLocaleString("es-PE")}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {kpi.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Icon className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}