"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../services/product-service";
import { getCategories } from "../services/category-service";
import type { Product, Category } from "../types/product";

interface UseProductsReturn {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial en mount, no es una cascada de renders
    void loadAll();
  }, [loadAll]);

  const removeProduct = async (id: number) => {
    try {
      setError(null);
      await deleteProduct(id);
      await loadAll();
    } catch {
      setError("No se pudo eliminar el producto.");
    }
  };

  return {
    products,
    categories,
    isLoading,
    error,
    refreshProducts: loadAll,
    removeProduct,
  };
}