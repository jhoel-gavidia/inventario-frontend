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
      <div className="rounded-xl border border-[#e5e7ef] bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#2563eb]" />

            <h3 className="text-sm font-semibold text-[#0b1c30]">
              Resumen de Roles
            </h3>
          </div>

          <span className="font-mono text-xs font-semibold text-[#737686]">
            2 roles
          </span>
        </div>

        {/* Distribution */}
        <div className="mt-4">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#f1f3f7]">
            {admins > 0 && (
              <div
                className="h-full bg-[#2563eb]"
                style={{
                  width: `${adminPercentage}%`,
                }}
              />
            )}

            {operators > 0 && (
              <div
                className="h-full bg-[#737686]"
                style={{
                  width: `${userPercentage}%`,
                }}
              />
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#737686]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
              {admins} ADMIN ({adminPercentage}%)
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#737686]" />
              {operators} USER ({userPercentage}%)
            </span>
          </div>
        </div>

        {/* Role definitions */}
        <div className="mt-4 space-y-2.5">
          <div className="rounded-lg border border-[#eef0f5] bg-[#f8f9ff] p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="rounded-full bg-[#2563eb] px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                ADMIN
              </span>

              <span className="rounded-full bg-[#eff4ff] px-2 py-0.5 text-[10px] font-bold uppercase text-[#2563eb]">
                Control Total
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#737686]">
              Acceso a gestión de usuarios, catálogos,
              auditoría técnica, apertura y cierre de
              inventario de repuestos mototaxi.
            </p>
          </div>

          <div className="rounded-lg border border-[#eef0f5] bg-[#f8f9ff] p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="rounded-full bg-[#f1f3f7] px-2 py-0.5 font-mono text-[11px] font-bold text-[#434655]">
                USER
              </span>

              <span className="rounded-full bg-[#f1f3f7] px-2 py-0.5 text-[10px] font-bold uppercase text-[#737686]">
                Operación Taller
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#737686]">
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