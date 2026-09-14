"use client";

import { ArrowLeftRight, Edit3, PackageOpen } from "lucide-react";
import { useMemo } from "react";
import type { Category } from "@/features/categories/types/category";
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
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-230 text-left">
          <thead>
            <tr className="border-b border-line-soft text-xs uppercase tracking-wide text-outline">
              <th className="px-5 py-3 font-medium">SKU</th>

              <th className="px-5 py-3 font-medium">Repuesto</th>

              <th className="px-5 py-3 font-medium">Categoría</th>

              <th className="px-5 py-3 text-right font-medium">
                Compra
              </th>

              <th className="px-5 py-3 text-right font-medium">
                Venta
              </th>

              <th className="px-5 py-3 text-center font-medium">
                Stock
              </th>

              <th className="px-5 py-3 text-center font-medium">
                Estado
              </th>

              <th className="px-5 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line-faint">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-soft text-outline">
                      <PackageOpen size={18} />
                    </div>

                    <p className="text-sm font-medium">
                      No se encontraron productos
                    </p>

                    <p className="mt-1 text-xs text-outline">
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
                    className="transition hover:bg-surface-hover"
                  >
                    <td className="px-5 py-4 font-mono text-xs font-medium text-outline">
                      {product.codigo}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {product.nombre}
                        </p>

                        <p className="mt-0.5 text-xs text-outline">
                          ID #{product.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-medium text-primary-container">
                        {categoryName}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-outline">
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
                        className={`inline-flex min-w-12 justify-center rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${
                          isOutOfStock
                            ? "bg-error-soft text-error"
                            : "bg-surface-container-low text-primary-container"
                        }`}
                      >
                        {product.stockActual}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.estado
                            ? "bg-success-container text-success"
                            : "bg-neutral-soft text-outline"
                        }`}
                      >
                        {product.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          title="Editar producto"
                          aria-label={`Editar ${product.nombre}`}
                          className="rounded-lg p-2 text-outline transition hover:bg-surface-container-low hover:text-primary-container"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onMovement(product)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-primary-container transition hover:bg-primary-container hover:text-white"
                        >
                          <ArrowLeftRight size={14} />
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