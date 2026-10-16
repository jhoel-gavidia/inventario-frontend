"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllMovements,
  getMovementResumen,
  getMovementRows,
} from "../services/movement-service";
import type {
  Movement,
  MovementResumen,
  MovementRow,
  MovementRowFilters,
} from "../types/movement";

export const movementsQueryKey = ["movimientos", "todos"] as const;
export const movementRowsQueryKey = ["movimientos", "detalles"] as const;
export const movementResumenQueryKey = ["movimientos", "resumen"] as const;

interface UseAllMovementsReturn {
  movements: Movement[];
  isLoading: boolean;
  error: string | null;
  refreshMovements: () => Promise<void>;
}

export function useAllMovements(): UseAllMovementsReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: movementsQueryKey,
    queryFn: getAllMovements,
    retry: false,
  });

  return {
    movements: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? "No se pudieron cargar los movimientos." : null,
    refreshMovements: () =>
      queryClient.invalidateQueries({ queryKey: movementsQueryKey }),
  };
}

interface UseMovementRowsReturn {
  rows: MovementRow[];
  totalElementos: number;
  totalPaginas: number;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refreshRows: () => Promise<void>;
}

export function useMovementRows(
  filters: MovementRowFilters,
  pagina: number,
  tamano: number,
): UseMovementRowsReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...movementRowsQueryKey, filters, pagina, tamano],
    queryFn: () => getMovementRows(filters, pagina, tamano),
    retry: false,
    placeholderData: keepPreviousData,
  });

  return {
    rows: query.data?.contenido ?? [],
    totalElementos: query.data?.totalElementos ?? 0,
    totalPaginas: query.data?.totalPaginas ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? "No se pudieron cargar los movimientos." : null,
    refreshRows: () =>
      queryClient.invalidateQueries({ queryKey: movementRowsQueryKey }),
  };
}

interface UseMovementResumenReturn {
  resumen: MovementResumen | null;
  isLoading: boolean;
  refreshResumen: () => Promise<void>;
}

export function useMovementResumen(): UseMovementResumenReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: movementResumenQueryKey,
    queryFn: getMovementResumen,
    retry: false,
  });

  return {
    resumen: query.data ?? null,
    isLoading: query.isLoading,
    refreshResumen: () =>
      queryClient.invalidateQueries({ queryKey: movementResumenQueryKey }),
  };
}
