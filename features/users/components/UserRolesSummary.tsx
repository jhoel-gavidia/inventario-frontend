"use client";

import type { User } from "../types/user";

interface UserRolesSummaryProps {
  users: User[];
}

export function UserRolesSummary({
  users,
}: UserRolesSummaryProps) {
  const total = users.length;

  const admins = users.filter(
    (user) => user.rol === "ADMIN",
  ).length;

  const operators = users.filter(
    (user) => user.rol === "USER",
  ).length;

  const adminPercentage =
    total > 0 ? Math.round((admins / total) * 100) : 0;

  const userPercentage =
    total > 0 ? Math.round((operators / total) * 100) : 0;

  return (
    <section className="min-w-0 xl:col-span-4">
      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary-container" />

            <h3 className="text-sm font-semibold text-on-surface">
              Resumen de Roles
            </h3>
          </div>

          <span className="font-mono text-xs font-semibold text-outline">
            2 roles
          </span>
        </div>

        {/* Distribution */}
        <div className="mt-4">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-neutral-soft">
            {admins > 0 && (
              <div
                className="h-full bg-primary-container"
                style={{
                  width: `${adminPercentage}%`,
                }}
              />
            )}

            {operators > 0 && (
              <div
                className="h-full bg-outline"
                style={{
                  width: `${userPercentage}%`,
                }}
              />
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-outline">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-container" />
              {admins} ADMIN ({adminPercentage}%)
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-outline" />
              {operators} USER ({userPercentage}%)
            </span>
          </div>
        </div>

        {/* Role definitions */}
        <div className="mt-4 space-y-2.5">
          <div className="rounded-lg border border-line-soft bg-background p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="rounded-full bg-primary-container px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                ADMIN
              </span>

              <span className="rounded-full bg-surface-container-low px-2 py-0.5 text-[10px] font-bold uppercase text-primary-container">
                Control Total
              </span>
            </div>

            <p className="text-xs leading-relaxed text-outline">
              Acceso a gestión de usuarios, catálogos,
              auditoría técnica, apertura y cierre de
              inventario de repuestos mototaxi.
            </p>
          </div>

          <div className="rounded-lg border border-line-soft bg-background p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="rounded-full bg-neutral-soft px-2 py-0.5 font-mono text-[11px] font-bold text-ink-muted">
                USER
              </span>

              <span className="rounded-full bg-neutral-soft px-2 py-0.5 text-[10px] font-bold uppercase text-outline">
                Operación Taller
              </span>
            </div>

            <p className="text-xs leading-relaxed text-outline">
              Registro diario de entradas y salidas de
              repuestos en bodega, consulta rápida de
              existencias y comprobación de stock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}