"use client";

import {
  ChevronDown,
  Download,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api/errors";

import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { CategoryStats } from "@/features/categories/components/CategoryStats";
import { CategoryTable } from "@/features/categories/components/CategoryTable";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/features/categories/services/category-service";

import type {
  Category,
  CategoryRequest,
} from "@/features/categories/types/category";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { useProducts } from "@/features/products/hooks/use-products";

import { downloadCategoriesCSV } from "@/features/categories/utils/category-export";

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

  const isLoading =
    categoriesLoading || productsLoading;

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
    return products.filter(
      (product) => product.estado,
    ).length;
  }, [products]);

  const highestCategory = useMemo(() => {
    if (categories.length === 0) {
      return null;
    }

    return categories.reduce<{
      name: string;
      count: number;
    } | null>((highest, category) => {
      const count =
        categoryProductCounts.get(category.id) ?? 0;

      if (!highest || count > highest.count) {
        return {
          name: category.nombre,
          count,
        };
      }

      return highest;
    }, null);
  }, [categories, categoryProductCounts]);

  function getProductCount(categoryId: number): number {
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

  async function handleSaveCategory(
    data: CategoryRequest,
  ) {
    if (selectedCategory) {
      await updateCategory(
        selectedCategory.id,
        data,
      );
    } else {
      await createCategory(data);
    }

    await refreshCategories();
    setSelectedCategory(null);
  }

  async function handleDeleteCategory(
    category: Category,
  ) {
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

  function handleExport(
    target: Category[],
    filename: string,
  ) {
    const rows = target.map((category) => ({
      category,
      productCount: getProductCount(category.id),
    }));

    downloadCategoriesCSV(rows, filename);
    setExportOpen(false);
  }

  function handleExportAll() {
    handleExport(categories, "categorias.csv");
  }

  function handleExportFiltered() {
    handleExport(
      filteredCategories,
      "categorias-filtradas.csv",
    );
  }

  function handleViewProducts(categoryId: number) {
    router.push(
      `/productos?categoria=${categoryId}`,
    );
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
              Familias y agrupaciones técnicas de repuestos
              del taller.
            </p>
          </div>

          {/* Export */}
          <div className="relative self-start">
            <button
              type="button"
              onClick={() =>
                setExportOpen((open) => !open)
              }
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
                    disabled={
                      filteredCategories.length === 0
                    }
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

        {/* Statistics */}
        <CategoryStats
          categoryCount={categories.length}
          productCount={totalProducts}
          highestCategory={highestCategory}
        />

        {/* Content */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <CategoryTable
            categories={filteredCategories}
            search={search}
            onSearchChange={setSearch}
            getProductCount={getProductCount}
            onViewProducts={handleViewProducts}
            onEdit={handleEditCategory}
            onDelete={(category) =>
              void handleDeleteCategory(category)
            }
            isLoading={isLoading}
            error={categoriesError}
            onRetry={() =>
              void refreshCategories()
            }
          />

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