"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import type { Category } from "@/features/categories/types/category";

interface ProductFiltersProps {
  search: string;
  category: string;
  stockStatus: string;
  status: string;

  categories: Category[];

  totalResults: number;
  totalProducts: number;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStockStatusChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export function ProductFilters({
  search,
  category,
  stockStatus,
  status,
  categories,
  totalResults,
  totalProducts,
  onSearchChange,
  onCategoryChange,
  onStockStatusChange,
  onStatusChange,
  onClear,
}: ProductFiltersProps) {
  const hasFilters =
    search.trim() !== "" ||
    category !== "ALL" ||
    stockStatus !== "ALL" ||
    status !== "ALL";

  const inputClassName =
    "h-10 w-full rounded-lg border border-line-strong bg-white px-3 text-sm text-on-surface outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-container/10";

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h2 className="font-semibold">Filtros</h2>

            <p className="mt-0.5 text-xs text-outline">
              Refina la lista de productos
            </p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-outline transition hover:text-on-surface sm:self-auto"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr]">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar por nombre o código..."
            aria-label="Buscar por nombre o código"
            className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          aria-label="Filtrar por categoría"
          className={inputClassName}
        >
          <option value="ALL">Todas las categorías</option>

          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>

        <select
          value={stockStatus}
          onChange={(event) =>
            onStockStatusChange(event.target.value)
          }
          aria-label="Filtrar por stock"
          className={inputClassName}
        >
          <option value="ALL">Todo el stock</option>
          <option value="IN_STOCK">Con stock</option>
          <option value="OUT_OF_STOCK">Sin stock</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          aria-label="Filtrar por estado"
          className={inputClassName}
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activos</option>
          <option value="INACTIVE">Inactivos</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
        <p className="text-xs text-outline">
          Mostrando{" "}
          <span className="font-medium text-on-surface">
            {totalResults}
          </span>{" "}
          de{" "}
          <span className="font-medium text-on-surface">
            {totalProducts}
          </span>{" "}
          productos
        </p>
      </div>
    </section>
  );
}