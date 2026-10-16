"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createMovement } from "../services/movement-service";
import {
  movementResumenQueryKey,
  movementRowsQueryKey,
  movementsQueryKey,
} from "./use-movements";
import { productsQueryKey } from "@/features/products/hooks/use-products";

export function useCreateMovement() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createMovement,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: movementsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: movementRowsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: movementResumenQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: productsQueryKey,
        }),
      ]);
    },
  });

  return {
    createMovement: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}