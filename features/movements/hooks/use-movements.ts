"use client";

import { useQuery } from "@tanstack/react-query";
import { getMovements } from "../services/movement-service";
import type { Movement } from "../types/movement";

export const movementsQueryKey = ["movimientos"] as const;

function getQueryError(error: unknown): string | null {
  if (!error) {
    return null;
  }

  return "No se pudieron cargar los movimientos.";
}

interface UseMovementsReturn {
  movements: Movement[];
  isLoading: boolean;
  error: string | null;
  refreshMovements: () => Promise<void>;
}

export function useMovements(): UseMovementsReturn {
  const query = useQuery({
    queryKey: movementsQueryKey,
    queryFn: getMovements,
    retry: false,
  });

  return {
    movements: query.data ?? [],
    isLoading: query.isLoading,
    error: getQueryError(query.error),
    refreshMovements: async () => {
      await query.refetch();
    },
  };
}