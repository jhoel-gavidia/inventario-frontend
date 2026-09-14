import {
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

import type { Movement } from "@/features/movements/types/movement";

interface RecentActivityProps {
  movements: Movement[];
}

function formatRelativeDate(date: string) {
  const value = new Date(date);
  const now = new Date();

  const diff = now.getTime() - value.getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Ahora";
  }

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Hace ${hours} h`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `Hace ${days} d`;
  }

  return value.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
  });
}

export function RecentActivity({
  movements,
}: RecentActivityProps) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div>
        <h2 className="font-semibold text-on-surface">
          Actividad reciente
        </h2>

        <p className="mt-1 text-sm text-outline">
          Últimos movimientos registrados
        </p>
      </div>

      {movements.length === 0 ? (
        <div className="py-10 text-center text-sm text-ink-faint">
          No hay movimientos registrados.
        </div>
      ) : (
        <div className="mt-5 divide-y divide-line-soft">
          {movements.map((movement) => {
            const isEntry = movement.tipo === "ENTRADA";

            const totalUnits = movement.detalles.reduce(
              (total, detail) => total + detail.cantidad,
              0,
            );

            const Icon = isEntry
              ? ArrowDownToLine
              : ArrowUpFromLine;

            return (
              <div
                key={movement.id}
                className="flex items-center gap-3 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-soft">
                  <Icon className="h-4 w-4 text-ink-muted" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-on-surface">
                    {isEntry
                      ? "Entrada de productos"
                      : "Salida de productos"}
                  </p>

                  <p className="mt-0.5 text-xs text-ink-faint">
                    {movement.detalles.length}{" "}
                    {movement.detalles.length === 1
                      ? "producto"
                      : "productos"}
                    {" · "}
                    {totalUnits} unidades
                  </p>
                </div>

                <span className="shrink-0 text-xs text-ink-faint">
                  {formatRelativeDate(movement.fecha)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}