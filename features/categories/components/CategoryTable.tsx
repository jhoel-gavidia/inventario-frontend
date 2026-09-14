import {
  ArrowUpRight,
  Pencil,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import type { Category } from "../types/category";

interface CategoryTableProps {
  categories: Category[];
  search: string;
  onSearchChange: (value: string) => void;
  getProductCount: (categoryId: number) => number;
  onViewProducts: (categoryId: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function CategoryTable({
  categories,
  search,
  onSearchChange,
  getProductCount,
  onViewProducts,
  onEdit,
  onDelete,
  isLoading,
  error,
  onRetry,
}: CategoryTableProps) {
  return (
    <section className="min-w-0 xl:col-span-8">
      <div className="rounded-xl border border-line bg-white">
        <div className="border-b border-line-soft p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
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
                placeholder="Buscar categoría..."
                aria-label="Buscar categoría"
                className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
              />
            </div>

            <span className="text-xs text-outline">
              {categories.length}{" "}
              {categories.length === 1
                ? "categoría"
                : "categorías"}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-162.5 text-left">
            <thead>
              <tr className="border-b border-line-soft text-xs uppercase tracking-wide text-outline">
                <th className="w-20 px-5 py-3 font-medium">
                  ID
                </th>

                <th className="px-5 py-3 font-medium">
                  Categoría
                </th>

                <th className="px-5 py-3 text-center font-medium">
                  Repuestos
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line-faint">
              {isLoading ? (
                <LoadingRows />
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-14 text-center"
                  >
                    <p className="text-sm font-medium text-error">
                      No se pudieron cargar las categorías.
                    </p>

                    <button
                      type="button"
                      onClick={onRetry}
                      className="mt-2 text-xs font-medium text-primary-container hover:underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <EmptyState />
              ) : (
                categories.map((category) => {
                  const count = getProductCount(category.id);

                  return (
                    <tr
                      key={category.id}
                      className="transition hover:bg-surface-hover"
                    >
                      <td className="px-5 py-4 font-mono text-xs font-medium text-outline">
                        #{category.id}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-on-surface">
                          {category.nombre}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            onViewProducts(category.id)
                          }
                          aria-label={`Ver ${count} ${
                            count === 1
                              ? "repuesto"
                              : "repuestos"
                          } de ${category.nombre}`}
                          className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 font-mono text-xs font-semibold text-primary-container transition hover:bg-primary-container hover:text-white"
                        >
                          {count}

                          <span className="font-sans">
                            {count === 1
                              ? "repuesto"
                              : "repuestos"}
                          </span>

                          <ArrowUpRight size={13} />
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(category)}
                            title="Editar categoría"
                            aria-label={`Editar ${category.nombre}`}
                            className="rounded-lg p-2 text-outline transition hover:bg-surface-container-low hover:text-primary-container"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(category)}
                            title="Eliminar categoría"
                            aria-label={`Eliminar ${category.nombre}`}
                            className="rounded-lg p-2 text-outline transition hover:bg-error-soft hover:text-error"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-line-soft px-5 py-4">
          <span className="text-xs text-outline">
            {categories.length}{" "}
            {categories.length === 1
              ? "categoría"
              : "categorías"}{" "}
            encontradas
          </span>

          <span className="text-xs text-outline">
            Vista completa
          </span>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={4}
        className="px-5 py-14 text-center"
      >
        <div className="mx-auto max-w-sm">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-soft text-outline">
            <Tag size={18} />
          </div>

          <p className="text-sm font-medium">
            No hay categorías
          </p>

          <p className="mt-1 text-xs text-outline">
            No se encontraron categorías con el criterio de
            búsqueda.
          </p>
        </div>
      </td>
    </tr>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          <td
            colSpan={4}
            className="px-5 py-4"
          >
            <div className="h-5 animate-pulse rounded bg-neutral-soft" />
          </td>
        </tr>
      ))}
    </>
  );
}