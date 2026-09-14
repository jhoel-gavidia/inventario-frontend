import type { Product } from "@/features/products/types/product";
import type { Category } from "../../categories/types/category";
import type { Movement } from "@/features/movements/types/movement";

export interface CategoryStat {
  category: Category;
  productCount: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalEntries: number;
  totalExits: number;

  productsInStock: number;
  productsOutOfStock: number;
  inactiveProducts: number;

  categoryStats: CategoryStat[];
  attentionProducts: Product[];
  recentMovements: Movement[];
}