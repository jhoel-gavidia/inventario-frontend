"use client";

import {
  Activity,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "../types/user";

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;

  const administrators = users.filter(
    (user) => user.rol === "ADMIN",
  ).length;

  const operators = users.filter(
    (user) => user.rol === "USER",
  ).length;

  const activeUsers = users.filter(
    (user) => user.estado,
  ).length;

  const inactiveUsers = totalUsers - activeUsers;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={<Users size={19} />}
        label="Total Usuarios"
        value={totalUsers}
        description={`${totalUsers} cuentas registradas`}
      />

      <MetricCard
        icon={<ShieldCheck size={19} />}
        label="Administradores"
        value={administrators}
        description={
          <>
            Rol{" "}
            <span className="font-mono font-semibold text-[#0b1c30]">
              ADMIN
            </span>
          </>
        }
      />

      <MetricCard
        icon={<Wrench size={19} />}
        label="Operadores"
        value={operators}
        description={
          <>
            Cuentas{" "}
            <span className="font-mono font-semibold text-[#0b1c30]">
              USER
            </span>
          </>
        }
      />

      <MetricCard
        icon={<Activity size={19} />}
        label="Estado Activo"
        value={activeUsers}
        description={
          <>
            {activeUsers > 0 && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#16823b]" />
            )}
            {Math.round(
              totalUsers > 0
                ? (activeUsers / totalUsers) * 100
                : 0,
            )}
            % operativas · {inactiveUsers} inactiva
            {inactiveUsers !== 1 ? "s" : ""}
          </>
        }
      />
    </section>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  description: ReactNode;
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <article className="rounded-xl border border-[#e5e7ef] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#434655]">
            {label}
          </p>

          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#737686]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
          {icon}
        </div>
      </div>
    </article>
  );
}