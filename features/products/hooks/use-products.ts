"use client";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getProducts } from "../services/product-service";
import type { Product } from "../types/product";

export const productsQueryKey = ["productos"] as const;

function getQueryError(error: unknown): string | null {
  if (!error) {
    return null;
  }

  return "No se pudieron cargar los productos.";
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
    retry: false,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    error: getQueryError(query.error),
    refreshProducts: () =>
      queryClient.invalidateQueries({ queryKey: productsQueryKey }),
  };
}
