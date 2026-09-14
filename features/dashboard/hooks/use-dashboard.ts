"use client";

import { useCallback, useEffect, useState } from "react";

import { getCategories } from "@/features/products/services/category-service";
import { getProducts } from "@/features/products/services/product-service";
import { getMovements } from "@/features/movements/services/movement-service";

import type {
  Category,
  Product,
} from "@/features/products/types/product";

import type { Movement } from "@/features/movements/types/movement";

import type { DashboardStats } from "../types/dashboard";

const INITIAL_STATS: DashboardStats = {
  totalProducts: 0,
  totalStock: 0,
  totalEntries: 0,
  totalExits: 0,
  productsInStock: 0,
  productsOutOfStock: 0,
  inactiveProducts: 0,
  categoryStats: [],
  attentionProducts: [],
  recentMovements: [],
};

function buildDashboardStats(
  products: Product[],
  categories: Category[],
  movements: Movement[],
): DashboardStats {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category]),
  );

  const categoryCountMap = new Map<number, number>();

  for (const product of products) {
    const currentCount =
      categoryCountMap.get(product.categoriaId) ?? 0;

    categoryCountMap.set(
      product.categoriaId,
      currentCount + 1,
    );
  }

  const categoryStats = Array.from(
    categoryCountMap.entries(),
  )
    .map(([categoryId, productCount]) => {
      const category = categoryMap.get(categoryId);

      if (!category) {
        return null;
      }

      return {
        category,
        productCount,
      };
    })
    .filter(
      (
        item,
      ): item is {
        category: Category;
        productCount: number;
      } => item !== null,
    )
    .sort((a, b) => b.productCount - a.productCount);

  const totalStock = products.reduce(
    (total, product) =>
      total + product.stockActual,
    0,
  );

  const totalEntries = movements
    .filter(
      (movement) => movement.tipo === "ENTRADA",
    )
    .reduce(
      (total, movement) =>
        total +
        movement.detalles.reduce(
          (movementTotal, detail) =>
            movementTotal + detail.cantidad,
          0,
        ),
      0,
    );

  const totalExits = movements
    .filter(
      (movement) => movement.tipo === "SALIDA",
    )
    .reduce(
      (total, movement) =>
        total +
        movement.detalles.reduce(
          (movementTotal, detail) =>
            movementTotal + detail.cantidad,
          0,
        ),
      0,
    );

  const activeProducts = products.filter(
    (product) => product.estado,
  );

  const productsInStock = activeProducts.filter(
    (product) => product.stockActual > 0,
  );

  const productsOutOfStock = activeProducts.filter(
    (product) => product.stockActual === 0,
  );

  const attentionProducts =
    productsOutOfStock.slice(0, 5);

  const recentMovements = [...movements]
    .sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime(),
    )
    .slice(0, 5);

  return {
    totalProducts: products.length,
    totalStock,
    totalEntries,
    totalExits,

    productsInStock: productsInStock.length,
    productsOutOfStock: productsOutOfStock.length,
    inactiveProducts: products.filter(
      (product) => !product.estado,
    ).length,

    categoryStats,
    attentionProducts,
    recentMovements,
  };
}

async function fetchDashboard(): Promise<DashboardStats> {
  const [products, categories, movements] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getMovements(),
    ]);

  return buildDashboardStats(
    products,
    categories,
    movements,
  );
}

export function useDashboard() {
  const [stats, setStats] =
    useState<DashboardStats>(INITIAL_STATS);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshDashboard =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchDashboard();

        setStats(data);
      } catch {
        setError(
          "No se pudo cargar el resumen del inventario.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await fetchDashboard();

        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError(
            "No se pudo cargar el resumen del inventario.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    stats,
    isLoading,
    error,
    refreshDashboard,
  };
}