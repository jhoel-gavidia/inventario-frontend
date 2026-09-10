import {
  ArrowLeftRight,
  Edit3,
} from "lucide-react";

import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onMovement: (product: Product) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
}

export function ProductTable({
  products,
  onEdit,
  onMovement,
}: ProductTableProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-mono text-[11px] uppercase tracking-wider text-secondary">
              <th className="px-6 py-4 font-semibold">Código SKU</th>
              <th className="px-6 py-4 font-semibold">
                Repuesto / Nombre
              </th>
              <th className="px-6 py-4 font-semibold">Categoría</th>
              <th className="px-6 py-4 text-right font-semibold">
                Costo Compra
              </th>
              <th className="px-6 py-4 text-right font-semibold">
                Precio Venta
              </th>
              <th className="px-6 py-4 text-center font-semibold">
                Stock
              </th>
              <th className="px-6 py-4 text-center font-semibold">
                Estado
              </th>
              <th className="px-6 py-4 text-right font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="text-sm text-on-surface">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`border-b border-surface-container-low transition-colors hover:bg-surface-container-low/60 ${
                  product.estado === "INACTIVO" ? "opacity-70" : ""
                }`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`rounded bg-surface-container px-2 py-1 font-mono text-[11px] font-bold ${
                      product.estado === "ACTIVO"
                        ? "text-primary"
                        : "text-secondary"
                    }`}
                  >
                    {product.codigo}
                  </span>
                </td>

                <td className="min-w-[280px] px-6 py-4">
                  <span className="font-semibold leading-tight">
                    {product.nombre}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded bg-surface-container px-3 py-1 text-xs font-medium">
                    {product.categoria.replace(
                      "Sistema de ",
                      "",
                    )}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-xs text-secondary">
                  {formatCurrency(product.precioCompra)}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-xs font-bold">
                  {formatCurrency(product.precioVenta)}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {product.stockActual === 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 font-mono text-[11px] font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      0 u. Agotado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 font-mono text-[11px] font-bold text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {product.stockActual} u.
                    </span>
                  )}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <span
                    className={`rounded px-3 py-1 font-mono text-[11px] font-semibold ${
                      product.estado === "ACTIVO"
                        ? "bg-surface-container-low text-on-surface"
                        : "bg-surface-container-high text-secondary"
                    }`}
                  >
                    {product.estado}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      title="Editar"
                      className="rounded-lg p-2 text-secondary transition-colors hover:bg-surface-container hover:text-primary"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onMovement(product)}
                      title="Kardex / Movimientos"
                      className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-2 py-1 font-mono text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      <ArrowLeftRight size={16} />
                      Movimientos
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-sm text-secondary"
                >
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 bg-surface-container-low px-6 py-4 sm:flex-row">
        <span className="font-mono text-[11px] text-secondary">
          Página <strong className="text-on-surface">1</strong> de{" "}
          <strong className="text-on-surface">29</strong> • 10
          repuestos por página
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="rounded-lg bg-white px-4 py-2 font-mono text-[11px] font-semibold text-secondary opacity-50 shadow-sm"
          >
            Anterior
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-[11px] font-bold text-white shadow-sm"
          >
            1
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-mono text-[11px] font-semibold text-on-surface shadow-sm hover:bg-surface-container"
          >
            2
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-mono text-[11px] font-semibold text-on-surface shadow-sm hover:bg-surface-container"
          >
            3
          </button>

          <span className="px-1 text-secondary">...</span>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-mono text-[11px] font-semibold text-on-surface shadow-sm hover:bg-surface-container"
          >
            29
          </button>

          <button
            type="button"
            className="rounded-lg bg-white px-4 py-2 font-mono text-[11px] font-semibold text-on-surface shadow-sm hover:bg-surface-container"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}