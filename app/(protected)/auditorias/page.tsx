"use client";

import { useMemo, useState } from "react";

import { AuditFilters } from "@/features/audit/components/AuditFilters";
import { AuditHeader } from "@/features/audit/components/AuditHeader";
import { AuditInspector } from "@/features/audit/components/AuditInspector";
import { AuditStats } from "@/features/audit/components/AuditStats";
import { AuditTable } from "@/features/audit/components/AuditTable";
import { useAudits } from "@/features/audit/hooks/use-audits";
import { downloadAuditsCSV } from "@/features/audit/utils/audit-export";

import type { Audit, AuditFilters as Filters } from "@/features/audit/types/audit";

const INITIAL_FILTERS: Filters = {
  search: "",
  entidad: "",
  accion: "",
  fecha: "all",
};

export default function AuditoriaPage() {
  const {
    audits,
    isLoading,
    error,
    refreshAudits,
  } = useAudits();

  const [filters, setFilters] =
    useState<Filters>(INITIAL_FILTERS);

  const [selectedAudit, setSelectedAudit] =
    useState<Audit | null>(null);

  const filteredAudits = useMemo(() => {
    const now = new Date();

    return audits.filter((audit) => {
      const search = filters.search.trim().toLowerCase();

      const matchesSearch =
        !search ||
        String(audit.id).includes(search) ||
        audit.username.toLowerCase().includes(search) ||
        audit.entidad.toLowerCase().includes(search) ||
        String(audit.entidadId).includes(search);

      const matchesEntity =
        !filters.entidad ||
        audit.entidad === filters.entidad;

      const matchesAction =
        !filters.accion ||
        audit.accion === filters.accion;

      const auditDate = new Date(audit.fecha);

      let matchesDate = true;

      if (filters.fecha === "today") {
        matchesDate =
          auditDate.toDateString() === now.toDateString();
      }

      if (filters.fecha === "7days") {
        const sevenDaysAgo = new Date(now);

        sevenDaysAgo.setDate(
          now.getDate() - 7
        );

        matchesDate = auditDate >= sevenDaysAgo;
      }

      if (filters.fecha === "month") {
        matchesDate =
          auditDate.getMonth() === now.getMonth() &&
          auditDate.getFullYear() ===
            now.getFullYear();
      }

      return (
        matchesSearch &&
        matchesEntity &&
        matchesAction &&
        matchesDate
      );
    });
  }, [audits, filters]);

  const handleRefresh = async () => {
    await refreshAudits();

    setSelectedAudit(null);
  };

  return (
    <main className="min-h-full bg-background p-5">
      <div className="mx-auto max-w-[1680px] space-y-4">
        <AuditHeader
          onRefresh={handleRefresh}
          isLoading={isLoading}
          onExport={() =>
            downloadAuditsCSV(filteredAudits, "auditoria.csv")
          }
          canExport={filteredAudits.length > 0}
        />

        {error && (
          <div className="rounded-xl border border-line-error bg-error-container px-4 py-3 text-xs font-medium text-error">
            {error}
          </div>
        )}

        <AuditStats audits={audits} />

        <AuditFilters
          filters={filters}
          onChange={setFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="h-100 animate-pulse rounded-xl bg-white lg:col-span-7" />
            <div className="h-100 animate-pulse rounded-xl bg-white lg:col-span-5" />
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <AuditTable
                audits={filteredAudits}
                selectedAudit={selectedAudit}
                onSelect={setSelectedAudit}
              />
            </div>

            <div className="lg:col-span-5">
              <AuditInspector
                audit={selectedAudit}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}