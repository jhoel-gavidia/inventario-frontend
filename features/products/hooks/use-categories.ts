"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCategories,
} from "../services/category-service";
import type { Category } from "../types/product";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      setError(null);

      const data = await getCategories();

      setCategories(data);
    } catch {
      setError("No se pudieron cargar las categorías.");
    }
  }, []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      await refreshCategories();

      setIsLoading(false);
    }

    load();
  }, [refreshCategories]);

  return {
    categories,
    isLoading,
    error,
    refreshCategories,
  };
}