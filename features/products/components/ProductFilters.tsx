"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import type { Category } from "../types/product";

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

  return (
    <section className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low text-secondary">
            <SlidersHorizontal size={16} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-on-surface">
              Filtros
            </h2>

            <p className="text-xs text-secondary">
              Refina la lista de productos
            </p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-secondary transition hover:text-on-surface sm:self-auto"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(260px,2fr)_1fr_1fr_1fr]">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar por nombre o código..."
            className="h-11 w-full rounded-lg border border-surface-container-low bg-white pl-10 pr-4 text-sm text-on-surface outline-none transition placeholder:text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className="h-11 rounded-lg border border-surface-container-low bg-white px-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
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
          className="h-11 rounded-lg border border-surface-container-low bg-white px-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
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
          className="h-11 rounded-lg border border-surface-container-low bg-white px-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activos</option>
          <option value="INACTIVE">Inactivos</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-container-low pt-4">
        <p className="text-xs text-secondary">
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