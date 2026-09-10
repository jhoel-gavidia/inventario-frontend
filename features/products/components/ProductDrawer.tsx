"use client";

import { Package, Save, X } from "lucide-react";
import { useState } from "react";

import type { Product, ProductStatus } from "../types/product";

interface ProductDrawerProps {
  open: boolean;
  product: Product | null;
  categories: string[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

const createEmptyProduct = (categories: string[]): Product => ({
  id: 0,
  codigo: "",
  nombre: "",
  categoria: categories[0] ?? "",
  precioCompra: 0,
  precioVenta: 0,
  stockActual: 0,
  estado: "ACTIVO",
});

export function ProductDrawer({
  open,
  product,
  categories,
  onClose,
  onSave,
}: ProductDrawerProps) {
  const [form, setForm] = useState<Product>(
    () => product ?? createEmptyProduct(categories),
  );

  if (!open) {
    return null;
  }

  const margin = form.precioVenta - form.precioCompra;

  const marginPercentage =
    form.precioCompra > 0 ? (margin / form.precioCompra) * 100 : 0;

  function update<K extends keyof Product>(field: K, value: Product[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col overflow-hidden bg-surface-container-lowest shadow-2xl">
        <div className="flex h-20 items-center justify-between bg-surface-container-low px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <Package size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-on-surface">
                {product ? "Editar Repuesto" : "Nuevo Repuesto"}
              </h2>

              <span className="text-xs text-secondary">
                {product
                  ? "Formulario de actualización"
                  : "Formulario de registro de catálogo"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-secondary hover:bg-surface-container-high hover:text-on-surface"
          >
            <X size={22} />
          </button>
        </div>

        <form
          id="productForm"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
                Código SKU *
              </label>

              <input
                required
                value={form.codigo}
                onChange={(event) => update("codigo", event.target.value)}
                placeholder="ej. REP-MOT-045"
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-mono text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
                Estado Operativo
              </label>

              <select
                value={form.estado}
                onChange={(event) =>
                  update("estado", event.target.value as ProductStatus)
                }
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
              >
                <option value="ACTIVO">ACTIVO (Disponible)</option>
                <option value="INACTIVO">INACTIVO (Descontinuado)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Nombre del Repuesto / Descripción *
            </label>

            <input
              required
              value={form.nombre}
              onChange={(event) => update("nombre", event.target.value)}
              placeholder="ej. Kit Rodajes de Rueda Delantera"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Categoría de Repuesto *
            </label>

            <select
              required
              value={form.categoria}
              onChange={(event) => update("categoria", event.target.value)}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
                Precio de Compra (S/) *
              </label>

              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.precioCompra}
                onChange={(event) =>
                  update("precioCompra", Number(event.target.value))
                }
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-right font-mono text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
                Precio de Venta (S/) *
              </label>

              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.precioVenta}
                onChange={(event) =>
                  update("precioVenta", Number(event.target.value))
                }
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-right font-mono text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Stock Inicial (Unidades) *
            </label>

            <input
              required
              min="0"
              type="number"
              value={form.stockActual}
              onChange={(event) =>
                update("stockActual", Number(event.target.value))
              }
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-mono text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="rounded-xl bg-surface-container-low p-4">
            <span className="font-mono text-[11px] font-semibold uppercase text-secondary">
              Cálculo de Margen Estimado
            </span>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-on-surface">
                Margen Bruto Unitario:
              </span>

              <span className="font-mono text-xs font-bold text-primary">
                S/ {margin.toFixed(2)} ({marginPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 bg-surface-container-low p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-surface-container px-6 py-3 text-sm font-semibold hover:bg-surface-container-high"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="productForm"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-container"
          >
            <Save size={18} />
            Guardar Repuesto
          </button>
        </div>
      </aside>
    </>
  );
}
