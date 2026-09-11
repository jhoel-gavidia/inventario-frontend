"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getCategories } from "../services/category-service";
import type { Category } from "../types/product";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const refreshCategories = useCallback(async () => {
    try {
      setError(null);

      const data = await getCategories();

      setCategories(data);
    } catch {
      setError(
        "No se pudieron cargar las categorías.",
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setError(null);

        const data = await getCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            "No se pudieron cargar las categorías.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    categories,
    isLoading,
    error,
    refreshCategories,
  };
}

