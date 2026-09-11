"use client";

import { PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductDrawer } from "@/features/products/components/ProductDrawer";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductStats } from "@/features/products/components/ProductStats";
import { ProductTable } from "@/features/products/components/ProductTable";
import { useProducts } from "@/features/products/hooks/use-products";

import { MovementModal } from "@/features/products/components/MovementModal";
import type { MovementType } from "@/features/movements/types/movement";
import type { Product } from "@/features/products/types/product";

const PAGE_SIZE = 10;

export default function ProductosPage() {
  const { products, categories, isLoading, error, refreshProducts } =
    useProducts();

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

  const totalInventoryValue = useMemo(
    () =>
      products.reduce(
        (total, product) => total + product.precioCompra * product.stockActual,
        0,
      ),
    [products],
  );

  const projectedSalesValue = useMemo(
    () =>
      products.reduce(
        (total, product) => total + product.precioVenta * product.stockActual,
        0,
      ),
    [products],
  );

  const outOfStock = useMemo(
    () => products.filter((product) => product.stockActual === 0).length,
    [products],
  );

  const categoryDistribution = useMemo(() => {
    const stockByCategory = new Map<number, number>();

    for (const product of products) {
      const categoryId = product.categoriaId;

      stockByCategory.set(
        categoryId,
        (stockByCategory.get(categoryId) ?? 0) + product.stockActual,
      );
    }

    const totalStock = products.reduce(
      (total, product) => total + product.stockActual,
      0,
    );

    return categories.map((category) => {
      const stock = stockByCategory.get(category.id) ?? 0;

      return {
        id: category.id,
        nombre: category.nombre,
        stock,
        percentage: totalStock > 0 ? Math.round((stock / totalStock) * 100) : 0,
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

  async function handleSaveProduct() {
    await refreshProducts();
    setDrawerOpen(false);
  }

  async function handleMovementConfirm(
    product: Product,
    type: MovementType,
    quantity: number,
  ) {
    // TODO: conectar con POST /api/movimientos
    console.log({
      productoId: product.id,
      tipo: type,
      cantidad: quantity,
    });

    await refreshProducts();
  }

  function handleClearFilters() {
    setSearch("");
    setCategory("ALL");
    setStockStatus("ALL");
    setStatus("ALL");
  }

  return (
    <main className="min-h-screen bg-surface-container-low">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Inventario
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-on-surface">
              Productos
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-secondary">
              Gestiona productos, precios y existencias del inventario.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            <PackagePlus size={17} />
            Nuevo producto
          </button>
        </header>

        {/* Stats */}
        <ProductStats
          totalProducts={products.length}
          totalCategories={categories.length}
          outOfStock={outOfStock}
          inventoryValue={totalInventoryValue}
        />

        {/* Filters */}
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

        {/* Table */}
        {isLoading ? (
          <div className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-10 text-center text-sm text-secondary">
            Cargando productos...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <ProductTable
            products={paginatedProducts}
            categories={categories}
            totalItems={filteredProducts.length}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onMovement={handleMovement}
          />
        )}

        {/* Resumen inferior */}
        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-on-surface">
                Distribución por categoría
              </h2>

              <p className="mt-1 text-xs text-secondary">
                Stock actual agrupado por categoría
              </p>
            </div>

            <div className="space-y-4">
              {categoryDistribution.length === 0 ? (
                <p className="text-sm text-secondary">
                  No hay categorías registradas.
                </p>
              ) : (
                categoryDistribution.map((item) => (
                  <div key={item.id}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-on-surface">
                        {item.nombre}
                      </span>

                      <span className="text-xs text-secondary">
                        {item.stock} uds. · {item.percentage}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-low">
                      <div
                        className="h-full rounded-full bg-primary"
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

          <article className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-on-surface">
                Resumen económico
              </h2>

              <p className="mt-1 text-xs text-secondary">
                Valor actual de las existencias
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Valor de compra</span>

                <span className="text-sm font-semibold text-on-surface">
                  {new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(totalInventoryValue)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">
                  Valor potencial de venta
                </span>

                <span className="text-sm font-semibold text-on-surface">
                  {new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(projectedSalesValue)}
                </span>
              </div>

              <div className="border-t border-surface-container-low pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">
                    Margen potencial
                  </span>

                  <span className="text-sm font-semibold text-primary">
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(projectedSalesValue - totalInventoryValue)}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Auditoría */}
        <section className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-5">
          <div>
            <h2 className="text-sm font-semibold text-on-surface">Auditoría</h2>

            <p className="mt-1 text-xs text-secondary">
              Las operaciones de inventario se registran automáticamente.
            </p>
          </div>
        </section>
      </div>

      <ProductDrawer
        open={drawerOpen}
        product={selectedProduct}
        categories={categories}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveProduct}
      />

      <MovementModal
        open={movementOpen}
        product={movementProduct}
        onClose={() => setMovementOpen(false)}
        onConfirm={handleMovementConfirm}
      />
    </main>
  );
}
