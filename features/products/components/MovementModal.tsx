"use client";

import { ArrowDownToLine, ArrowUpFromLine, Minus, Plus, X } from "lucide-react";
import { useState } from "react";

import type { MovementType } from "@/features/movements/types/movement";
import type { Product } from "@/features/products/types/product";

interface MovementModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (
    product: Product,
    type: MovementType,
    quantity: number,
  ) => Promise<void>;
}

export function MovementModal({
  open,
  product,
  onClose,
  onConfirm,
}: MovementModalProps) {
  const [type, setType] = useState<MovementType>("ENTRADA");

  const [quantity, setQuantity] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !product) return null;

  const currentProduct = product;

  const isSalida = type === "SALIDA";

  const projectedStock = isSalida
    ? currentProduct.stockActual - quantity
    : currentProduct.stockActual + quantity;

  const insufficientStock = isSalida && quantity > currentProduct.stockActual;

  const invalidQuantity = quantity < 1;

  const canSubmit = !isSubmitting && !invalidQuantity && !insufficientStock;

  async function handleConfirm() {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);

      await onConfirm(currentProduct, type, quantity);

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#e5e7ef] bg-[#f8f9ff]">
        <header className="flex items-start justify-between border-b border-[#eef0f5] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">
              Movimiento
            </p>

            <h2 className="mt-1 text-base font-semibold text-[#0b1c30]">
              Registrar movimiento
            </h2>

            <p className="mt-1 text-xs text-[#737686]">
              Actualiza el stock de forma controlada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#737686] transition hover:bg-[#eff4ff] hover:text-[#2563eb] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <section className="rounded-lg border border-[#eef0f5] bg-[#eff4ff] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0b1c30]">
                  {currentProduct.nombre}
                </p>

                <p className="mt-1 font-mono text-xs text-[#737686]">
                  {currentProduct.codigo}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-[#737686]">Stock actual</p>

                <p className="mt-1 text-lg font-semibold text-[#0b1c30]">
                  {currentProduct.stockActual}
                </p>
              </div>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-xs font-medium text-[#0b1c30]">
              Tipo de movimiento
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("ENTRADA")}
                disabled={isSubmitting}
                className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  type === "ENTRADA"
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-[#dfe2ea] bg-white text-[#434655] hover:bg-[#eff4ff]"
                }`}
              >
                <ArrowDownToLine size={16} />
                Entrada
              </button>

              <button
                type="button"
                onClick={() => setType("SALIDA")}
                disabled={isSubmitting}
                className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  type === "SALIDA"
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-[#dfe2ea] bg-white text-[#434655] hover:bg-[#eff4ff]"
                }`}
              >
                <ArrowUpFromLine size={16} />
                Salida
              </button>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-xs font-medium text-[#0b1c30]">
              Cantidad
            </label>

            <div className="flex items-center rounded-lg border border-[#dfe2ea] bg-white">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={isSubmitting || quantity <= 1}
                className="flex h-11 w-11 items-center justify-center text-[#737686] transition hover:bg-[#eff4ff] disabled:opacity-40"
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                disabled={isSubmitting}
                className="h-11 min-w-0 flex-1 border-x border-[#eef0f5] bg-transparent text-center text-sm font-semibold text-[#0b1c30] outline-none"
              />

              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                disabled={isSubmitting}
                className="flex h-11 w-11 items-center justify-center text-[#737686] transition hover:bg-[#eff4ff]"
              >
                <Plus size={16} />
              </button>
            </div>

            {insufficientStock && (
              <p className="mt-2 text-xs font-medium text-[#ba1a1a]">
                No puedes retirar {quantity} unidades. El stock disponible es{" "}
                {currentProduct.stockActual}.
              </p>
            )}
          </section>

          <section
            className={`rounded-lg border p-4 ${
              insufficientStock
                ? "border-[#f2cccc] bg-[#fff7f7]"
                : "border-[#eef0f5] bg-[#f8f9ff]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#737686]">
                Stock después del movimiento
              </span>

              <span
                className={`text-lg font-semibold ${
                  insufficientStock ? "text-[#ba1a1a]" : "text-[#0b1c30]"
                }`}
              >
                {projectedStock}
              </span>
            </div>

            <p className="mt-1 text-xs text-[#737686]">
              {isSalida
                ? `${currentProduct.stockActual} - ${quantity}`
                : `${currentProduct.stockActual} + ${quantity}`}
            </p>
          </section>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-[#eef0f5] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 rounded-lg border border-[#dfe2ea] bg-white px-4 text-sm font-medium text-[#434655] transition hover:bg-[#f8f9ff] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="h-10 rounded-lg bg-[#2563eb] px-5 text-sm font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Registrar movimiento"}
          </button>
        </footer>
      </div>
    </div>
  );
}