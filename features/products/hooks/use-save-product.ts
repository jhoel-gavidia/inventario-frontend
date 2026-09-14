"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  updateProduct,
} from "../services/product-service";
import { productsQueryKey } from "./use-products";
import type {
  Product,
  ProductRequest,
} from "../types/product";

interface SaveProductInput {
  product: Product | null;
  data: ProductRequest;
}

export function useSaveProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ product, data }: SaveProductInput) =>
      product
        ? updateProduct(product.id, data)
        : createProduct(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: productsQueryKey,
      }),
  });

  return {
    saveProduct: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}