"use client";

import {
  ArrowLeftRight,
  Edit3,
  PackageOpen,
} from "lucide-react";
import { useMemo } from "react";

import type { Category } from "../types/product";
import type { Product } from "../types/product";

import { ProductPagination } from "./ProductPagination";

interface ProductTableProps {
  products: Product[];
  categories: Category[];

  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onMovement: (product: Product) => void;
}

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function ProductTable({
  products,
  categories,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onEdit,
  onMovement,
}: ProductTableProps) {
  const categoryMap = useMemo(
    () =>
      new Map(
        categories.map((category) => [category.id, category.nombre])
      ),
    [categories]
  );

  return (
    <section className="overflow-hidden rounded-xl border border-surface-container-low bg-surface-container-lowest">
      <div className="overflow-x-auto">
        <table className="w-full min-w-230">
          <thead>
            <tr className="border-b border-surface-container-low bg-surface-container-low">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-secondary">
                SKU
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-secondary">
                Repuesto
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-secondary">
                Categoría
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-secondary">
                Compra
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-secondary">
                Venta
              </th>

              <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-secondary">
                Stock
              </th>

              <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-secondary">
                Estado
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-secondary">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low text-secondary">
                      <PackageOpen size={22} />
                    </div>

                    <h3 className="text-sm font-semibold text-on-surface">
                      No se encontraron productos
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-secondary">
                      No hay productos que coincidan con los filtros
                      seleccionados.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const categoryName =
                  categoryMap.get(product.categoriaId) ?? "Sin categoría";

                const isOutOfStock = product.stockActual === 0;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-surface-container-low transition-colors last:border-b-0 hover:bg-surface-container-low/50"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-medium text-secondary">
                        {product.codigo}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-on-surface">
                          {product.nombre}
                        </p>

                        <p className="mt-0.5 text-xs text-secondary">
                          ID #{product.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md border border-surface-container-low bg-surface-container-low px-2.5 py-1 text-xs font-medium text-secondary">
                        {categoryName}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-secondary">
                        {currencyFormatter.format(
                          product.precioCompra
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-on-surface">
                        {currencyFormatter.format(
                          product.precioVenta
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex min-w-12 justify-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                          isOutOfStock
                            ? "bg-red-50 text-red-600"
                            : "bg-surface-container-low text-on-surface"
                        }`}
                      >
                        {product.stockActual}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                          product.estado
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-surface-container-low text-secondary"
                        }`}
                      >
                        {product.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          title="Editar producto"
                          aria-label={`Editar ${product.nombre}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-container-low bg-white text-secondary transition hover:bg-surface-container-low hover:text-on-surface"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onMovement(product)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-surface-container-low bg-white px-3 text-xs font-medium text-secondary transition hover:bg-surface-container-low hover:text-on-surface"
                        >
                          <ArrowLeftRight size={15} />
                          Movimientos
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

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </section>
  );
}