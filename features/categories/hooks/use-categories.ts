"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category-service";
import type { Category } from "../../categories/types/category";

export const categoriesQueryKey = ["categorias"] as const;

function getQueryError(error: unknown): string | null {
  if (!error) {
    return null;
  }

  return "No se pudieron cargar las categorías.";
}

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const query = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getCategories,
    retry: false,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    error: getQueryError(query.error),
    refreshCategories: async () => {
      await query.refetch();
    },
  };
}
