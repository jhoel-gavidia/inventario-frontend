"use client";

import { X, PackagePlus, Wallet } from "lucide-react";
import { useState } from "react";
import type { Product, ProductRequest, Category } from "../types/product";

interface ProductDrawerProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: ProductRequest) => Promise<void>;
}

export function ProductDrawer({
  open,
  product,
  categories,
  onClose,
  onSave,
}: ProductDrawerProps) {
  const isEditing = product !== null;

  const [form, setForm] = useState<ProductRequest>({
    codigo: product?.codigo ?? "",
    nombre: product?.nombre ?? "",
    categoriaId: product?.categoriaId ?? 0,
    precioCompra: product?.precioCompra ?? 0,
    precioVenta: product?.precioVenta ?? 0,
    stockInicial: 0,
    estado: product?.estado ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  function updateField<K extends keyof ProductRequest>(
    field: K,
    value: ProductRequest[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const margen = form.precioVenta - form.precioCompra;
  const margenPct =
    form.precioCompra > 0
      ? ((margen / form.precioCompra) * 100).toFixed(1)
      : "0.0";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsSaving(true);
      await onSave(form);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col overflow-hidden bg-surface-container-lowest shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-surface-container-low px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-highest text-primary">
              <PackagePlus size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-on-surface">
                {isEditing ? "Editar Repuesto" : "Nuevo Repuesto"}
              </h2>
              <span className="text-sm text-on-surface-variant">
                {isEditing
                  ? `Modificando: ${form.codigo}`
                  : "Formulario de registro"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form body */}
        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-5 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Código SKU *
              </label>
              <input
                required
                value={form.codigo}
                onChange={(e) => updateField("codigo", e.target.value)}
                className="rounded-xl bg-surface-container-low px-4 py-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="ej. REP-MOT-045"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Estado Operativo
              </label>
              <select
                value={form.estado ? "ACTIVO" : "INACTIVO"}
                onChange={(e) =>
                  updateField("estado", e.target.value === "ACTIVO")
                }
                className="rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="ACTIVO">ACTIVO (Disponible)</option>
                <option value="INACTIVO">INACTIVO (Descontinuado)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Nombre del Repuesto *
            </label>
            <input
              required
              value={form.nombre}
              onChange={(e) => updateField("nombre", e.target.value)}
              className="rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="ej. Kit Rodajes de Rueda Delantera"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Categoría *
            </label>
            <select
              required
              value={form.categoriaId}
              onChange={(e) =>
                updateField("categoriaId", Number(e.target.value))
              }
              className="rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value={0}>Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Precio de Compra (S/) *
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.precioCompra}
                onChange={(e) =>
                  updateField("precioCompra", Number(e.target.value))
                }
                className="rounded-xl bg-surface-container-low px-4 py-3 text-right font-mono text-xs outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Precio de Venta (S/) *
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.precioVenta}
                onChange={(e) =>
                  updateField("precioVenta", Number(e.target.value))
                }
                className="rounded-xl bg-surface-container-low px-4 py-3 text-right font-mono text-xs outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Stock Inicial *
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.stockInicial}
                onChange={(e) =>
                  updateField("stockInicial", Number(e.target.value))
                }
                className="rounded-xl bg-surface-container-low px-4 py-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}

          <div className="mt-2 flex flex-col gap-2 rounded-xl bg-surface-container-low p-4">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase text-secondary">
              <Wallet size={14} /> Margen Bruto Estimado
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface">
                Margen unitario:
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                S/ {margen.toFixed(2)} (+{margenPct}%)
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 bg-surface-container-low px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl bg-surface-container px-6 py-3 text-sm font-semibold hover:bg-surface-container-high"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSaving}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-container disabled:opacity-60"
          >
            {isSaving
              ? "Guardando..."
              : isEditing
                ? "Actualizar"
                : "Guardar Repuesto"}
          </button>
        </div>
      </aside>
    </>
  );
}