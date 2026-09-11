"use client";

import { useCallback, useEffect, useState } from "react";
import { getMovements } from "../services/movement-service";
import type { Movement } from "../types/movement";

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMovements = useCallback(async () => {
    try {
      setError(null);

      const data = await getMovements();

      setMovements(data);
    } catch {
      setError("No se pudieron cargar los movimientos.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMovements() {
      try {
        setError(null);

        const data = await getMovements();

        if (!cancelled) {
          setMovements(data);
        }
      } catch {
        if (!cancelled) {
          setError("No se pudieron cargar los movimientos.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMovements();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    movements,
    isLoading,
    error,
    refreshMovements,
  };
}