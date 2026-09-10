"use client";

import { Plus, Download, WalletCards, History } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductStats } from "@/features/products/components/ProductStats";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductDrawer } from "@/features/products/components/ProductDrawer";
import { MovementModal } from "@/features/products/components/MovementModal";

import {
  categories,
  categoryDistribution,
  productsMock,
} from "@/features/products/mocks/products.mock";

import type {
  MovementType,
  Product,
} from "@/features/products/types/product";

export default function ProductosPage() {
  const [products, setProducts] =
    useState<Product[]>(productsMock);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [movementOpen, setMovementOpen] = useState(false);
  const [movementProduct, setMovementProduct] =
    useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.codigo.toLowerCase().includes(normalizedSearch) ||
        product.nombre.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "ALL" ||
        product.categoria === category;

      const matchesStatus =
        status === "ALL" ||
        (status === "IN_STOCK" &&
          product.stockActual > 0) ||
        (status === "OUT_OF_STOCK" &&
          product.stockActual === 0) ||
        product.estado === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [products, search, category, status]);

  const totalProducts = products.length;

  const outOfStock = products.filter(
    (product) => product.stockActual === 0,
  ).length;

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      product.precioCompra * product.stockActual,
    0,
  );

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

  function handleSave(product: Product) {
    if (product.id === 0) {
      setProducts((current) => [
        {
          ...product,
          id: Date.now(),
        },
        ...current,
      ]);
    } else {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? product
            : item,
        ),
      );
    }

    setDrawerOpen(false);
  }

  function handleMovementConfirm(
    product: Product,
    type: MovementType,
    quantity: number,
  ) {
    setProducts((current) =>
      current.map((item) => {
        if (item.id !== product.id) {
          return item;
        }

        const newStock =
          type === "ENTRADA"
            ? item.stockActual + quantity
            : Math.max(
                0,
                item.stockActual - quantity,
              );

        return {
          ...item,
          stockActual: newStock,
        };
      }),
    );
  }

  return (
    <div className="w-full px-6 py-8 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* STATS */}

        <ProductStats
          totalProducts={totalProducts}
          totalCategories={categories.length}
          outOfStock={outOfStock}
          inventoryValue={inventoryValue}
        />

        {/* HEADER */}

        <section className="flex flex-col justify-between gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Catálogo de Repuestos
            </h1>

            <p className="mt-2 text-sm text-secondary">
              Gestión de inventario de repuestos para
              mototaxis y servicios de taller.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <Download size={18} />
              Exportar Lista
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container"
            >
              <Plus size={20} />
              Crear Producto
            </button>
          </div>
        </section>

        {/* FILTERS */}

        <ProductFilters
          search={search}
          category={category}
          status={status}
          totalResults={filteredProducts.length}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
        />

        {/* TABLE */}

        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onMovement={handleMovement}
        />

        {/* LOWER MODULES */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* DISTRIBUTION */}

          <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-semibold text-on-surface">
                Distribución por Categorías
              </h2>

              <span className="font-mono text-[11px] font-semibold text-primary">
                6 Categorías
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {categoryDistribution.map((item) => (
                <div
                  key={item.nombre}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span>{item.nombre}</span>

                    <span className="font-bold text-primary">
                      {item.unidades} u. ({item.porcentaje}%)
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{
                        width: `${item.porcentaje}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ECONOMIC */}

          <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  Resumen Económico
                </span>

                <h2 className="mt-1 font-semibold text-on-surface">
                  Valor en Inventario
                </h2>
              </div>

              <WalletCards
                size={20}
                className="text-primary"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                <span className="text-sm text-secondary">
                  Costo Total en Almacén:
                </span>

                <span className="font-mono text-xs font-bold">
                  S/ 18,450.00
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                <span className="text-sm text-secondary">
                  Proyección de Venta:
                </span>

                <span className="font-mono text-xs font-bold text-primary">
                  S/ 28,450.00
                </span>
              </div>
            </div>
          </section>

          {/* AUDIT */}

          <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  Auditoría Reciente
                </span>

                <h2 className="mt-1 font-semibold text-on-surface">
                  Últimos Cambios
                </h2>
              </div>

              <History
                size={20}
                className="text-secondary"
              />
            </div>

            <div className="mt-6 rounded-xl bg-surface-container-low p-4">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Hace 15 minutos
              </div>

              <p className="mt-2 text-sm font-medium text-on-surface">
                Actualización de stock en #REP-MOT-001
              </p>

              <span className="mt-1 block font-mono text-[11px] text-secondary">
                Jhoelito Admin • Taller Matriz
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* DRAWER */}

      <ProductDrawer
        open={drawerOpen}
        product={selectedProduct}
        categories={categories}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />

      {/* MOVEMENT MODAL */}

      <MovementModal
        open={movementOpen}
        product={movementProduct}
        onClose={() => setMovementOpen(false)}
        onConfirm={handleMovementConfirm}
      />
    </div>
  );
}