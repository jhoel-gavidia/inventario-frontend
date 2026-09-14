"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAudits } from "../services/audit-service";
import type { Audit } from "../types/audit";

export const auditsQueryKey = ["auditorias"] as const;

function getQueryError(error: unknown): string | null {
  if (!error) {
    return null;
  }

  return "No se pudieron cargar los registros de auditoría.";
}

interface UseAuditsReturn {
  audits: Audit[];
  isLoading: boolean;
  error: string | null;
  refreshAudits: () => Promise<void>;
}

export function useAudits(): UseAuditsReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: auditsQueryKey,
    queryFn: getAudits,
    retry: false,
  });

  return {
    audits: query.data ?? [],
    isLoading: query.isLoading,
    error: getQueryError(query.error),
    refreshAudits: () =>
      queryClient.invalidateQueries({ queryKey: auditsQueryKey }),
  };
}