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
    "h-10 w-full rounded-lg border border-[#dfe2ea] bg-white px-3 text-sm text-[#0b1c30] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10";

  return (
    <section className="rounded-xl border border-[#e5e7ef] bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h2 className="font-semibold">Filtros</h2>

            <p className="mt-0.5 text-xs text-[#737686]">
              Refina la lista de productos
            </p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-[#737686] transition hover:text-[#0b1c30] sm:self-auto"
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
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar por nombre o código..."
            className="h-10 w-full rounded-lg border border-[#dfe2ea] bg-white pl-9 pr-3 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#737686] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
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
          className={inputClassName}
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activos</option>
          <option value="INACTIVE">Inactivos</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#eef0f5] pt-4">
        <p className="text-xs text-[#737686]">
          Mostrando{" "}
          <span className="font-medium text-[#0b1c30]">
            {totalResults}
          </span>{" "}
          de{" "}
          <span className="font-medium text-[#0b1c30]">
            {totalProducts}
          </span>{" "}
          productos
        </p>
      </div>
    </section>
  );
}