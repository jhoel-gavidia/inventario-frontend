"use client";

import { useProducts } from "@/features/products/hooks/use-products";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useMovements } from "@/features/movements/hooks/use-movements";

import type { Product } from "@/features/products/types/product";
import type { Category } from "../../categories/types/category";

import type { Movement } from "@/features/movements/types/movement";

import type { DashboardStats } from "../types/dashboard";

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
    const currentCount = categoryCountMap.get(product.categoriaId) ?? 0;

    categoryCountMap.set(product.categoriaId, currentCount + 1);
  }

  const categoryStats = Array.from(categoryCountMap.entries())
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
    (total, product) => total + product.stockActual,
    0,
  );

  const totalEntries = movements
    .filter((movement) => movement.tipo === "ENTRADA")
    .reduce(
      (total, movement) =>
        total +
        movement.detalles.reduce(
          (movementTotal, detail) => movementTotal + detail.cantidad,
          0,
        ),
      0,
    );

  const totalExits = movements
    .filter((movement) => movement.tipo === "SALIDA")
    .reduce(
      (total, movement) =>
        total +
        movement.detalles.reduce(
          (movementTotal, detail) => movementTotal + detail.cantidad,
          0,
        ),
      0,
    );

  const activeProducts = products.filter((product) => product.estado);

  const productsInStock = activeProducts.filter(
    (product) => product.stockActual > 0,
  );

  const productsOutOfStock = activeProducts.filter(
    (product) => product.stockActual === 0,
  );

  const attentionProducts = productsOutOfStock.slice(0, 5);

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  return {
    totalProducts: products.length,
    totalStock,
    totalEntries,
    totalExits,

    productsInStock: productsInStock.length,
    productsOutOfStock: productsOutOfStock.length,
    inactiveProducts: products.filter((product) => !product.estado).length,

    categoryStats,
    attentionProducts,
    recentMovements,
  };
}

export function useDashboard() {
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const movementsQuery = useMovements();

  const stats = buildDashboardStats(
    productsQuery.products,
    categoriesQuery.categories,
    movementsQuery.movements,
  );

  const isLoading =
    productsQuery.isLoading ||
    categoriesQuery.isLoading ||
    movementsQuery.isLoading;

  const error =
    productsQuery.error || categoriesQuery.error || movementsQuery.error
      ? "No se pudo cargar el resumen del inventario."
      : null;

  const refreshDashboard = async () => {
    await Promise.all([
      productsQuery.refreshProducts(),
      categoriesQuery.refreshCategories(),
      movementsQuery.refreshMovements(),
    ]);
  };

  return {
    stats,
    isLoading,
    error,
    refreshDashboard,
  };
}