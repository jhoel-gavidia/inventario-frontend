"use client";

import { PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductDrawer } from "@/features/products/components/ProductDrawer";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductStats } from "@/features/products/components/ProductStats";
import { ProductTable } from "@/features/products/components/ProductTable";
import { useProducts } from "@/features/products/hooks/use-products";
import { useSaveProduct } from "@/features/products/hooks/use-save-product";
import { useCategories } from "@/features/categories/hooks/use-categories";

import { MovementModal } from "@/features/products/components/MovementModal";
import type { Product, ProductRequest } from "@/features/products/types/product";

const PAGE_SIZE = 10;

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export default function ProductosPage() {
  const {
    products,
    isLoading: isLoadingProducts,
    error: productsError,
    refreshProducts,
  } = useProducts();
  const { saveProduct } = useSaveProduct();
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refreshCategories,
  } = useCategories();

  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = productsError ?? categoriesError;

  async function handleRetry() {
    await Promise.all([refreshProducts(), refreshCategories()]);
  }

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [stockStatus, setStockStatus] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [movementOpen, setMovementOpen] = useState(false);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch === "" ||
        product.nombre.toLowerCase().includes(normalizedSearch) ||
        product.codigo.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "ALL" || product.categoriaId === Number(category);

      const matchesStock =
        stockStatus === "ALL" ||
        (stockStatus === "IN_STOCK" && product.stockActual > 0) ||
        (stockStatus === "OUT_OF_STOCK" && product.stockActual === 0);

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && product.estado) ||
        (status === "INACTIVE" && !product.estado);

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });
  }, [products, search, category, stockStatus, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safeCurrentPage]);

  const activeProducts = useMemo(
    () => products.filter((product) => product.estado),
    [products],
  );

  const totalInventoryValue = useMemo(
    () =>
      activeProducts.reduce(
        (total, product) => total + product.precioCompra * product.stockActual,
        0,
      ),
    [activeProducts],
  );

  const projectedSalesValue = useMemo(
    () =>
      activeProducts.reduce(
        (total, product) => total + product.precioVenta * product.stockActual,
        0,
      ),
    [activeProducts],
  );

  const outOfStock = useMemo(
    () => products.filter((product) => product.stockActual === 0).length,
    [products],
  );

  const categoryDistribution = useMemo(() => {
    const stockByCategory = new Map<number, number>();
    let totalStock = 0;

    for (const product of products) {
      totalStock += product.stockActual;
      stockByCategory.set(
        product.categoriaId,
        (stockByCategory.get(product.categoriaId) ?? 0) +
          product.stockActual,
      );
    }

    return categories.map((category) => {
      const stock = stockByCategory.get(category.id) ?? 0;

      return {
        id: category.id,
        nombre: category.nombre,
        stock,
        percentage:
          totalStock > 0
            ? Math.round((stock / totalStock) * 100)
            : 0,
      };
    });
  }, [products, categories]);

  function handleCreate() {
    setSelectedProduct(null);
    setDrawerOpen(true);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }

  function handleMovement(product: Product) {
    setMovementProduct(product);
    setMovementOpen(true);
  }

  async function handleSaveProduct(data: ProductRequest) {
    await saveProduct({ product: selectedProduct, data });
    setDrawerOpen(false);
  }

  function handleClearFilters() {
    setSearch("");
    setCategory("ALL");
    setStockStatus("ALL");
    setStatus("ALL");
  }

  return (
    <main className="min-h-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Productos
            </h1>

            <p className="mt-1 text-sm text-[#737686]">
              Gestiona productos, precios y existencias del inventario.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#dce9ff] px-4 text-sm font-medium text-[#0b1c30] transition hover:bg-[#d3e4fe]"
          >
            <PackagePlus size={17} />
            Nuevo producto
          </button>
        </div>

        {/* KPIs */}
        <ProductStats
          totalProducts={products.length}
          totalCategories={categories.length}
          outOfStock={outOfStock}
          inventoryValue={totalInventoryValue}
        />

        {/* Filtros */}
        <div className="mt-6">
          <ProductFilters
            search={search}
            category={category}
            stockStatus={stockStatus}
            status={status}
            categories={categories}
            totalResults={filteredProducts.length}
            totalProducts={products.length}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onStockStatusChange={setStockStatus}
            onStatusChange={setStatus}
            onClear={handleClearFilters}
          />
        </div>

        {/* Tabla */}
        <div className="mt-6">
          {isLoading ? (
            <div className="rounded-xl border border-[#e5e7ef] bg-white p-10 text-center text-sm text-[#737686]">
              Cargando productos...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[#e5e7ef] bg-white p-6 text-center">
              <p className="text-sm font-medium text-[#ba1a1a]">{error}</p>

              <button
                type="button"
                onClick={() => void handleRetry()}
                className="mt-2 text-xs font-medium text-[#2563eb] hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <ProductTable
              products={paginatedProducts}
              categories={categories}
              totalItems={filteredProducts.length}
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onMovement={handleMovement}
            />
          )}
        </div>

        {/* Resumen inferior */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-[#e5e7ef] bg-white p-5">
            <div className="mb-5">
              <h2 className="font-semibold">
                Distribución por categoría
              </h2>

              <p className="mt-1 text-xs text-[#737686]">
                Stock actual agrupado por categoría
              </p>
            </div>

            <div className="space-y-4">
              {categoryDistribution.length === 0 ? (
                <p className="text-sm text-[#737686]">
                  No hay categorías registradas.
                </p>
              ) : (
                categoryDistribution.map((item) => (
                  <div key={item.id}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-[#0b1c30]">
                        {item.nombre}
                      </span>

                      <span className="text-xs text-[#737686]">
                        {item.stock} uds. · {item.percentage}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#eff4ff]">
                      <div
                        className="h-full rounded-full bg-[#2563eb]"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-xl border border-[#e5e7ef] bg-white p-5">
            <div className="mb-5">
              <h2 className="font-semibold">Resumen económico</h2>

              <p className="mt-1 text-xs text-[#737686]">
                Valor actual de las existencias
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#737686]">Valor de compra</span>

                <span className="text-sm font-semibold text-[#0b1c30]">
                  {currencyFormatter.format(totalInventoryValue)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#737686]">
                  Valor potencial de venta
                </span>

                <span className="text-sm font-semibold text-[#0b1c30]">
                  {currencyFormatter.format(projectedSalesValue)}
                </span>
              </div>

              <div className="border-t border-[#eef0f5] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#0b1c30]">
                    Margen potencial
                  </span>

                  <span className="text-sm font-semibold text-[#2563eb]">
                    {currencyFormatter.format(
                      projectedSalesValue - totalInventoryValue,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Auditoría */}
        <section className="mt-6 rounded-xl border border-[#e5e7ef] bg-white p-5">
          <div>
            <h2 className="font-semibold">Auditoría</h2>

            <p className="mt-1 text-xs text-[#737686]">
              Las operaciones de inventario se registran automáticamente.
            </p>
          </div>
        </section>
      </div>

      {drawerOpen && (
        <ProductDrawer
          product={selectedProduct}
          categories={categories}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {movementOpen && movementProduct && (
        <MovementModal
          product={movementProduct}
          onClose={() => setMovementOpen(false)}
        />
      )}
    </main>
  );
}