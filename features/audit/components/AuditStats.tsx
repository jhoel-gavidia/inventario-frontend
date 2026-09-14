import {
  Activity,
  FileClock,
  Package,
  Users,
} from "lucide-react";

import type { Audit } from "../types/audit";

interface AuditStatsProps {
  audits: Audit[];
}

export function AuditStats({ audits }: AuditStatsProps) {
  const total = audits.length;

  const criticalActions = audits.filter(
    (audit) => audit.accion === "DELETE"
  ).length;

  const entityCounts = audits.reduce<Record<string, number>>(
    (acc, audit) => {
      acc[audit.entidad] = (acc[audit.entidad] ?? 0) + 1;

      return acc;
    },
    {}
  );

  const mostModifiedEntity =
    Object.entries(entityCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] ?? "—";

  const auditedUsers = new Set(
    audits.map((audit) => audit.usuarioId)
  ).size;

  const stats = [
    {
      label: "Total auditorías",
      value: total,
      description: "Registros disponibles",
      icon: FileClock,
    },
    {
      label: "Acciones críticas",
      value: criticalActions,
      description: "Eliminaciones registradas",
      icon: Activity,
    },
    {
      label: "Entidad más modificada",
      value: mostModifiedEntity,
      description:
        mostModifiedEntity === "—"
          ? "Sin registros"
          : `${entityCounts[mostModifiedEntity]} registros`,
      icon: Package,
    },
    {
      label: "Usuarios auditados",
      value: auditedUsers,
      description: "Usuarios con actividad",
      icon: Users,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="flex items-center justify-between rounded-xl border border-line bg-white p-4"
          >
            <div className="min-w-0">
              <span className="text-xs font-semibold text-ink-muted">
                {stat.label}
              </span>

              <p className="mt-0.5 truncate font-mono text-2xl font-semibold tracking-tight text-on-surface">
                {stat.value}
              </p>

              <span className="mt-1 block text-[11px] font-medium text-outline">
                {stat.description}
              </span>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
              <Icon size={20} />
            </div>
          </article>
        );
      })}
    </section>
  );
}