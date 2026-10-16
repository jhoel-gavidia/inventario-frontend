"use client";

import { useEffect, useMemo, useState } from "react";

import { AuditFilters } from "@/features/audit/components/AuditFilters";
import { AuditHeader } from "@/features/audit/components/AuditHeader";
import { AuditInspector } from "@/features/audit/components/AuditInspector";
import { AuditStats } from "@/features/audit/components/AuditStats";
import { AuditTable } from "@/features/audit/components/AuditTable";
import {
  useAuditResumen,
  useAuditsPagina,
  useRefreshAudits,
} from "@/features/audit/hooks/use-audits";
import {
  getAllAuditsFiltered,
} from "@/features/audit/services/audit-service";
import { downloadAuditsCSV } from "@/features/audit/utils/audit-export";

import type { Audit, AuditFilters as Filters } from "@/features/audit/types/audit";

const INITIAL_FILTERS: Filters = {
  search: "",
  entidad: "",
  accion: "",
  fecha: "all",
};

const PAGE_SIZE = 10;

export default function AuditoriaPage() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const refreshAudits = useRefreshAudits();

  const queryFilters = useMemo<Filters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const {
    audits,
    totalElementos,
    totalPaginas,
    isLoading,
    isFetching,
    error,
  } = useAuditsPagina(queryFilters, currentPage, PAGE_SIZE);

  const { resumen } = useAuditResumen();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    setCurrentPage(0);
  }

  const safeTotalPages = Math.max(totalPaginas, 1);

  const handleRefresh = async () => {
    await refreshAudits();

    setCurrentPage(0);
    setSelectedAudit(null);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const all = await getAllAuditsFiltered(queryFilters);

      if (all.length > 0) {
        downloadAuditsCSV(all, "auditoria.csv");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-full bg-background p-5">
      <div className="mx-auto max-w-[1680px] space-y-4">
        <AuditHeader
          onRefresh={() => void handleRefresh()}
          isLoading={isLoading || isFetching || isExporting}
          onExport={() => void handleExport()}
          canExport={totalElementos > 0 && !isExporting}
        />

        {error && (
          <div className="rounded-xl border border-line-error bg-error-container px-4 py-3 text-xs font-medium text-error">
            {error}
          </div>
        )}

        <AuditStats resumen={resumen} />

        <AuditFilters
          filters={filters}
          onChange={handleFiltersChange}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="h-100 animate-pulse rounded-xl bg-white lg:col-span-7" />
            <div className="h-100 animate-pulse rounded-xl bg-white lg:col-span-5" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <AuditTable
                audits={audits}
                selectedAudit={selectedAudit}
                onSelect={setSelectedAudit}
                totalItems={totalElementos}
                currentPage={currentPage + 1}
                totalPages={safeTotalPages}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setCurrentPage(page - 1)}
              />
            </div>

            <div className="lg:col-span-5">
              <AuditInspector audit={selectedAudit} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
