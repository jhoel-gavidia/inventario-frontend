"use client";

import {
  ArrowUpRight,
  ChevronDown,
  Download,
  Package,
  Pencil,
  Search,
  Tag,
  Trash2,
  Wrench,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api/errors";
import { CategoryForm } from "@/features/products/components/CategoryForm";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryRequest,
} from "@/features/products/services/category-service";
import { useCategories } from "@/features/products/hooks/use-categories";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Category } from "@/features/products/types/product";

export default function CategoriasPage() {
  const router = useRouter();

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refreshCategories,
  } = useCategories();

  const {
    products,
    isLoading: productsLoading,
  } = useProducts();

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [search, setSearch] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const isLoading = categoriesLoading || productsLoading;

  const categoryProductCounts = useMemo(() => {
    const counts = new Map<number, number>();

    products.forEach((product) => {
      if (!product.estado) {
        return;
      }

      counts.set(
        product.categoriaId,
        (counts.get(product.categoriaId) ?? 0) + 1,
      );
    });

    return counts;
  }, [products]);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return categories;
    }

    return categories.filter((category) =>
      category.nombre.toLowerCase().includes(term),
    );
  }, [categories, search]);

  const totalProducts = useMemo(() => {
    return products.filter((product) => product.estado).length;
  }, [products]);

  const highestCategory = useMemo(() => {
    if (categories.length === 0) {
      return null;
    }

    return categories.reduce<{
      category: Category;
      count: number;
    } | null>((highest, category) => {
      const count = categoryProductCounts.get(category.id) ?? 0;

      if (!highest || count > highest.count) {
        return {
          category,
          count,
        };
      }

      return highest;
    }, null);
  }, [categories, categoryProductCounts]);

  function getProductCount(categoryId: number) {
    return categoryProductCounts.get(categoryId) ?? 0;
  }

  function handleNewCategory() {
    setSelectedCategory(null);
  }

  function handleEditCategory(category: Category) {
    setSelectedCategory(category);
  }

  function handleCancel() {
    setSelectedCategory(null);
  }

  async function handleSaveCategory(data: CategoryRequest) {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, data);
    } else {
      await createCategory(data);
    }

    await refreshCategories();
    setSelectedCategory(null);
  }

  async function handleDeleteCategory(category: Category) {
    const productCount = getProductCount(category.id);

    if (productCount > 0) {
      alert(
        `No se puede eliminar "${category.nombre}" porque tiene ${productCount} productos asociados.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${category.nombre}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(category.id);

      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
      }

      await refreshCategories();
    } catch (error) {
      alert(
        getApiErrorMessage(
          error,
          "No se pudo eliminar la categoría. Puede que tenga productos asociados.",
        ),
      );
    }
  }

  function buildCSV(target: Category[]): string {
    const headers = ["ID", "Nombre", "Repuestos Asociados"];

    const rows = target.map((category) => [
      category.id,
      category.nombre,
      getProductCount(category.id),
    ]);

    return [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`,
          )
          .join(","),
      ),
    ].join("\n");
  }

  function downloadCSV(target: Category[], filename: string) {
    const blob = new Blob([buildCSV(target)], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleExportAll() {
    downloadCSV(categories, "categorias.csv");
    setExportOpen(false);
  }

  function handleExportFiltered() {
    downloadCSV(filteredCategories, "categorias-filtradas.csv");
    setExportOpen(false);
  }

  return (
    <main className="min-h-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Gestión de Categorías
            </h1>

            <p className="mt-1 text-sm text-[#737686]">
              Familias y agrupaciones técnicas de repuestos del taller.
            </p>
          </div>

          <div className="relative self-start">
            <button
              type="button"
              onClick={() => setExportOpen((open) => !open)}
              disabled={categories.length === 0}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#dce9ff] px-4 text-sm font-medium text-[#0b1c30] transition hover:bg-[#d3e4fe] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />
              Exportar
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  exportOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setExportOpen(false)}
                />

                <div
                  role="menu"
                  className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-[#e5e7ef] bg-white p-1.5 shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleExportAll}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-[#f5f7ff]"
                  >
                    <span className="text-sm font-medium">
                      Exportar todo
                    </span>

                    <span className="rounded-full bg-[#eff4ff] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#2563eb]">
                      {categories.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleExportFiltered}
                    disabled={filteredCategories.length === 0}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-[#f5f7ff] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="text-sm font-medium">
                      Exportar resultados
                    </span>

                    <span className="rounded-full bg-[#eff4ff] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#2563eb]">
                      {filteredCategories.length}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* KPIs */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            icon={<Tag size={19} />}
            label="Categorías"
            value={categories.length}
            description="Familias registradas"
          />

          <MetricCard
            icon={<Package size={19} />}
            label="Repuestos asociados"
            value={totalProducts}
            description="En catálogo activo"
          />

          <article className="hidden rounded-xl border border-[#e5e7ef] bg-white p-5 xl:block">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#434655]">
                  Mayor existencia
                </p>

                <p className="mt-2 truncate text-lg font-semibold">
                  {highestCategory?.category.nombre ?? "Sin datos"}
                </p>

                <p className="mt-1 text-xs text-[#2563eb]">
                  {highestCategory
                    ? `${highestCategory.count} repuestos vinculados`
                    : "0 repuestos vinculados"}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
                <Wrench size={19} />
              </div>
            </div>
          </article>
        </section>

        {/* Content */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          {/* Table */}
          <section className="min-w-0 xl:col-span-8">
            <div className="rounded-xl border border-[#e5e7ef] bg-white">
              {/* Search */}
              <div className="border-b border-[#eef0f5] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-sm">
                    <Search
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Buscar categoría..."
                      className="h-10 w-full rounded-lg border border-[#dfe2ea] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#737686] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
                    />
                  </div>

                  <span className="text-xs text-[#737686]">
                    {filteredCategories.length}{" "}
                    {filteredCategories.length === 1
                      ? "categoría"
                      : "categorías"}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-162.5 text-left">
                  <thead>
                    <tr className="border-b border-[#eef0f5] text-xs uppercase tracking-wide text-[#737686]">
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

                  <tbody className="divide-y divide-[#f0f1f5]">
                    {isLoading ? (
                      <LoadingRows />
                    ) : categoriesError ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-14 text-center"
                        >
                          <p className="text-sm font-medium text-[#ba1a1a]">
                            No se pudieron cargar las categorías.
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              void refreshCategories()
                            }
                            className="mt-2 text-xs font-medium text-[#2563eb] hover:underline"
                          >
                            Reintentar
                          </button>
                        </td>
                      </tr>
                    ) : filteredCategories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-14 text-center"
                        >
                          <div className="mx-auto max-w-sm">
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f8] text-[#737686]">
                              <Tag size={18} />
                            </div>

                            <p className="text-sm font-medium">
                              No hay categorías
                            </p>

                            <p className="mt-1 text-xs text-[#737686]">
                              No se encontraron categorías con el
                              criterio de búsqueda.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => {
                        const count = getProductCount(
                          category.id,
                        );

                        return (
                          <tr
                            key={category.id}
                            className="transition hover:bg-[#fafbff]"
                          >
                            <td className="px-5 py-4 font-mono text-xs font-medium text-[#737686]">
                              #{category.id}
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-sm font-semibold text-[#0b1c30]">
                                {category.nombre}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/productos?categoria=${category.id}`,
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-full bg-[#eff4ff] px-2.5 py-1 font-mono text-xs font-semibold text-[#2563eb] transition hover:bg-[#2563eb] hover:text-white"
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
                                  onClick={() =>
                                    handleEditCategory(
                                      category,
                                    )
                                  }
                                  title="Editar categoría"
                                  aria-label={`Editar ${category.nombre}`}
                                  className="rounded-lg p-2 text-[#737686] transition hover:bg-[#eff4ff] hover:text-[#2563eb]"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleDeleteCategory(
                                      category,
                                    )
                                  }
                                  title="Eliminar categoría"
                                  aria-label={`Eliminar ${category.nombre}`}
                                  className="rounded-lg p-2 text-[#737686] transition hover:bg-[#fff1f1] hover:text-[#ba1a1a]"
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

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#eef0f5] px-5 py-4">
                <span className="text-xs text-[#737686]">
                  {filteredCategories.length}{" "}
                  {filteredCategories.length === 1
                    ? "categoría"
                    : "categorías"}{" "}
                  registradas
                </span>

                <span className="text-xs text-[#737686]">
                  Vista completa
                </span>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="min-w-0 xl:col-span-4">
            <CategoryForm
              key={selectedCategory?.id ?? "new"}
              category={selectedCategory}
              onSave={handleSaveCategory}
              onCancel={handleCancel}
              onReset={handleNewCategory}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-[#e5e7ef] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#434655]">
            {label}
          </p>

          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#737686]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
          {icon}
        </div>
      </div>
    </article>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          <td colSpan={4} className="px-5 py-4">
            <div className="h-5 animate-pulse rounded bg-[#f1f3f7]" />
          </td>
        </tr>
      ))}
    </>
  );
}

