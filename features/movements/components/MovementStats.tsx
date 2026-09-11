"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
} from "lucide-react";

import type { Movement } from "../types/movement";

interface MovementStatsProps {
  movements: Movement[];
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getTotalUnits(
  movements: Movement[],
  type: "ENTRADA" | "SALIDA"
): number {
  return movements
    .filter(
      (movement) =>
        movement.tipo === type && isToday(movement.fecha)
    )
    .reduce(
      (movementTotal, movement) =>
        movementTotal +
        movement.detalles.reduce(
          (detailTotal, detail) =>
            detailTotal + detail.cantidad,
          0
        ),
      0
    );
}

export function MovementStats({
  movements,
}: MovementStatsProps) {
  const totalEntradas = getTotalUnits(
    movements,
    "ENTRADA"
  );

  const totalSalidas = getTotalUnits(
    movements,
    "SALIDA"
  );

  const balance = totalEntradas - totalSalidas;

  const stats = [
    {
      label: "Total entradas hoy",
      value: `+${totalEntradas}`,
      description: "unidades registradas",
      icon: ArrowDownToLine,
      iconClass: "text-[#004ac6] bg-[#eff4ff]",
      valueClass: "text-[#0b1c30]",
    },
    {
      label: "Total salidas hoy",
      value: `-${totalSalidas}`,
      description: "unidades despachadas",
      icon: ArrowUpFromLine,
      iconClass: "text-red-600 bg-red-50",
      valueClass: "text-[#0b1c30]",
    },
    {
      label: "Balance neto",
      value: `${balance >= 0 ? "+" : ""}${balance}`,
      description: "balance del día",
      icon: Scale,
      iconClass: "text-[#0b1c30] bg-[#eff4ff]",
      valueClass:
        balance >= 0
          ? "text-[#004ac6]"
          : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-xl border border-[#dce9ff] bg-white p-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#565e74]">
                {stat.label}
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold ${stat.valueClass}`}
                >
                  {stat.value}
                </span>

                <span className="text-xs text-[#565e74]">
                  unidades
                </span>
              </div>

              <p className="mt-1 text-xs text-[#565e74]">
                {stat.description}
              </p>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
            >
              <Icon size={21} strokeWidth={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}