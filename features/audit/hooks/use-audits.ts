"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getAuditResumen, getAuditsPagina } from "../services/audit-service";
import type { Audit, AuditFilters, AuditResumen } from "../types/audit";

export const auditsQueryKey = ["auditorias", "pagina"] as const;
export const auditResumenQueryKey = ["auditorias", "resumen"] as const;

interface UseAuditsPaginaReturn {
  audits: Audit[];
  totalElementos: number;
  totalPaginas: number;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
}

export function useAuditsPagina(
  filters: AuditFilters,
  pagina: number,
  tamano: number,
): UseAuditsPaginaReturn {
  const query = useQuery({
    queryKey: [...auditsQueryKey, filters, pagina, tamano],
    queryFn: () => getAuditsPagina(filters, pagina, tamano),
    retry: false,
    placeholderData: keepPreviousData,
  });

  return {
    audits: query.data?.contenido ?? [],
    totalElementos: query.data?.totalElementos ?? 0,
    totalPaginas: query.data?.totalPaginas ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error
      ? "No se pudieron cargar los registros de auditoría."
      : null,
  };
}

interface UseAuditResumenReturn {
  resumen: AuditResumen | null;
  isLoading: boolean;
}

export function useAuditResumen(): UseAuditResumenReturn {
  const query = useQuery({
    queryKey: auditResumenQueryKey,
    queryFn: getAuditResumen,
    retry: false,
  });

  return {
    resumen: query.data ?? null,
    isLoading: query.isLoading,
  };
}

export function useRefreshAudits() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: auditsQueryKey }),
      queryClient.invalidateQueries({ queryKey: auditResumenQueryKey }),
    ]);
}
