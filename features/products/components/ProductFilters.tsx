import { Search, SlidersHorizontal } from "lucide-react";
import type { Category } from "../types/product";

interface ProductFiltersProps {
  search: string;
  category: string;
  status: string;
  totalResults: number;
  categories: Category[] | string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProductFilters({
  search,
  category,
  status,
  totalResults,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Search
            size={20}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por código (SKU) o nombre de repuesto..."
            className="w-full rounded-xl bg-surface-container-low py-3 pl-10 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-secondary focus:bg-white focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full cursor-pointer rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/30"
          >
            <option value="ALL">
              Todas las Categorías ({categories.length})
            </option>

            {categories.map((item) => {
              const value = typeof item === "string" ? item : item.id;
              const label = typeof item === "string" ? item : item.nombre;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full cursor-pointer rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/30"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="IN_STOCK">Con Stock (Mayor a 0)</option>
            <option value="OUT_OF_STOCK">
              Sin Stock (Agotados - 0 u.)
            </option>
            <option value="ACTIVO">Estado: ACTIVO</option>
            <option value="INACTIVO">Estado: INACTIVO</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 pt-1 text-sm text-secondary sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} />

          <span className="font-medium">
            Mostrando {totalResults} de 284 repuestos
          </span>

          <span className="hidden font-mono text-[11px] sm:inline">
            • Taller Jhoelito
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Sincronizado con BD
        </div>
      </div>
    </div>
  );
}