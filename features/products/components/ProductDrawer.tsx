"use client";

import { AlertCircle, PackagePlus, Pencil, X } from "lucide-react";
import { useState } from "react";

import { getApiErrorMessage } from "@/lib/api/errors";
import type {
  Category,
  Product,
  ProductRequest,
} from "../types/product";

interface ProductDrawerProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: ProductRequest) => Promise<void>;
}

const inputClassName =
  "h-11 w-full rounded-lg border border-[#dfe2ea] bg-white px-3 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#9a9dab] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10";

function getInitialForm(product: Product | null): ProductRequest {
  if (!product) {
    return {
      codigo: "",
      nombre: "",
      categoriaId: 0,
      precioCompra: 0,
      precioVenta: 0,
      stockInicial: 0,
      estado: true,
    };
  }

  return {
    codigo: product.codigo,
    nombre: product.nombre,
    categoriaId: product.categoriaId,
    precioCompra: product.precioCompra,
    precioVenta: product.precioVenta,
    stockInicial: 0,
    estado: product.estado,
  };
}

export function ProductDrawer({
  open,
  product,
  categories,
  onClose,
  onSave,
}: ProductDrawerProps) {
  const isEditing = product !== null;

  const [form, setForm] = useState<ProductRequest>(() =>
    getInitialForm(product)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const margin = form.precioVenta - form.precioCompra;

  const marginPercentage =
    form.precioCompra > 0
      ? (margin / form.precioCompra) * 100
      : 0;

  const hasNegativeMargin = margin < 0;

  function updateField<K extends keyof ProductRequest>(
    field: K,
    value: ProductRequest[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      await onSave(form);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "No se pudo guardar el producto. Inténtalo nuevamente.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-[#e5e7ef] bg-[#f8f9ff]">
        <header className="flex items-center justify-between border-b border-[#eef0f5] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
              {isEditing ? (
                <Pencil size={18} />
              ) : (
                <PackagePlus size={18} />
              )}
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0b1c30]">
                {isEditing ? "Editar producto" : "Nuevo producto"}
              </h2>

              <p className="mt-0.5 text-xs text-[#737686]">
                {isEditing
                  ? "Actualiza la información del producto"
                  : "Registra un nuevo producto en el inventario"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#737686] transition hover:bg-[#eff4ff] hover:text-[#2563eb]"
          >
            <X size={18} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#0b1c30]">
                    Información general
                  </h3>

                  <p className="mt-1 text-xs text-[#737686]">
                    Datos básicos para identificar el producto.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#0b1c30]">
                      Código / SKU
                    </label>

                    <input
                      autoFocus
                      required
                      value={form.codigo}
                      onChange={(event) =>
                        updateField("codigo", event.target.value)
                      }
                      placeholder="Ej. MOT-001"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#0b1c30]">
                      Nombre
                    </label>

                    <input
                      required
                      value={form.nombre}
                      onChange={(event) =>
                        updateField("nombre", event.target.value)
                      }
                      placeholder="Ej. Pastillas de freno"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#0b1c30]">
                      Categoría
                    </label>

                    <select
                      required
                      value={
                        form.categoriaId === 0
                          ? ""
                          : form.categoriaId
                      }
                      onChange={(event) =>
                        updateField(
                          "categoriaId",
                          event.target.value
                            ? Number(event.target.value)
                            : 0
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#0b1c30]">
                      Estado
                    </label>

                    <select
                      value={String(form.estado)}
                      onChange={(event) =>
                        updateField(
                          "estado",
                          event.target.value === "true"
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#eef0f5] pt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#0b1c30]">
                    Información económica
                  </h3>

                  <p className="mt-1 text-xs text-[#737686]">
                    Define los precios de compra y venta.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#0b1c30]">
                      Precio de compra
                    </label>

                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      value={form.precioCompra}
                      onChange={(event) =>
                        updateField(
                          "precioCompra",
                          Number(event.target.value)
                        )
                      }
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#0b1c30]">
                      Precio de venta
                    </label>

                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      value={form.precioVenta}
                      onChange={(event) =>
                        updateField(
                          "precioVenta",
                          Number(event.target.value)
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div
                  className={`mt-4 rounded-lg border p-3 ${
                    hasNegativeMargin
                      ? "border-[#f2cccc] bg-[#fff7f7]"
                      : "border-[#eef0f5] bg-[#f8f9ff]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#737686]">
                      Margen por unidad
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        hasNegativeMargin
                          ? "text-[#ba1a1a]"
                          : "text-[#2563eb]"
                      }`}
                    >
                      S/ {margin.toFixed(2)}
                    </span>
                  </div>

                  <p
                    className={`mt-1 text-xs ${
                      hasNegativeMargin
                        ? "text-[#ba1a1a]"
                        : "text-[#737686]"
                    }`}
                  >
                    {hasNegativeMargin
                      ? `El precio de venta está ${Math.abs(
                          marginPercentage
                        ).toFixed(
                          1
                        )}% por debajo del precio de compra.`
                      : `Margen aproximado de ${marginPercentage.toFixed(
                          1
                        )}%.`}
                  </p>
                </div>
              </section>

              {!isEditing && (
                <section className="border-t border-[#eef0f5] pt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0b1c30]">
                      Stock inicial
                    </h3>

                    <p className="mt-1 text-xs text-[#737686]">
                      Cantidad disponible al registrar el producto.
                    </p>
                  </div>

                  <input
                    required
                    min="0"
                    step="1"
                    type="number"
                    value={form.stockInicial}
                    onChange={(event) =>
                      updateField(
                        "stockInicial",
                        Number(event.target.value)
                      )
                    }
                    className={inputClassName}
                  />
                </section>
              )}
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-[#f2cccc] bg-[#fff7f7] px-3.5 py-3 text-xs text-[#ba1a1a]">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />

                <p>{error}</p>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-end gap-3 border-t border-[#eef0f5] bg-[#f8f9ff] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-10 rounded-lg border border-[#dfe2ea] bg-white px-4 text-sm font-medium text-[#434655] transition hover:bg-[#f8f9ff] disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-lg bg-[#2563eb] px-5 text-sm font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
}