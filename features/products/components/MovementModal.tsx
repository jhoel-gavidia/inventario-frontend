"use client";

import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

import { getApiErrorMessage } from "@/lib/api/errors";
import { useCreateMovement } from "@/features/movements/hooks/use-create-movement";
import type { MovementType } from "@/features/movements/types/movement";
import type { Product } from "@/features/products/types/product";

interface MovementModalProps {
  product: Product;
  onClose: () => void;
}

export function MovementModal({
  product,
  onClose,
}: MovementModalProps) {
  const { createMovement, isPending } = useCreateMovement();
  const isSubmitting = isPending;

  const [type, setType] = useState<MovementType>("ENTRADA");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const currentProduct = product;

  const isSalida = type === "SALIDA";

  const projectedStock = isSalida
    ? currentProduct.stockActual - quantity
    : currentProduct.stockActual + quantity;

  const insufficientStock =
    isSalida && quantity > currentProduct.stockActual;

  const invalidQuantity = quantity < 1;

  const canSubmit =
    !isSubmitting && !invalidQuantity && !insufficientStock;

  function clearError() {
    setError(null);
  }

  async function handleConfirm() {
    if (!canSubmit) return;

    try {
      setError(null);

      await createMovement({
        tipo: type,
        detalles: [
          {
            productoId: currentProduct.id,
            cantidad: quantity,
          },
        ],
      });

      onClose();
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "No se pudo registrar el movimiento. Inténtalo nuevamente.",
        ),
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-line bg-background">
        <header className="flex items-start justify-between border-b border-line-soft px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-container">
              Movimiento
            </p>

            <h2 className="mt-1 text-base font-semibold text-on-surface">
              Registrar movimiento
            </h2>

            <p className="mt-1 text-xs text-outline">
              Actualiza el stock de forma controlada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-outline transition hover:bg-surface-container-low hover:text-primary-container disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <section className="rounded-lg border border-line-soft bg-surface-container-low p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-on-surface">
                  {currentProduct.nombre}
                </p>

                <p className="mt-1 font-mono text-xs text-outline">
                  {currentProduct.codigo}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-outline">Stock actual</p>

                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {currentProduct.stockActual}
                </p>
              </div>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-xs font-medium text-on-surface">
              Tipo de movimiento
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType("ENTRADA");
                  clearError();
                }}
                disabled={isSubmitting}
                className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  type === "ENTRADA"
                    ? "border-primary-container bg-primary-container text-white"
                    : "border-line-strong bg-white text-ink-muted hover:bg-surface-container-low"
                }`}
              >
                <ArrowDownToLine size={16} />
                Entrada
              </button>

              <button
                type="button"
                onClick={() => {
                  setType("SALIDA");
                  clearError();
                }}
                disabled={isSubmitting}
                className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  type === "SALIDA"
                    ? "border-primary-container bg-primary-container text-white"
                    : "border-line-strong bg-white text-ink-muted hover:bg-surface-container-low"
                }`}
              >
                <ArrowUpFromLine size={16} />
                Salida
              </button>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-xs font-medium text-on-surface">
              Cantidad
            </label>

            <div className="flex items-center rounded-lg border border-line-strong bg-white">
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.max(1, value - 1));
                  clearError();
                }}
                disabled={isSubmitting || quantity <= 1}
                aria-label="Disminuir cantidad"
                className="flex h-11 w-11 items-center justify-center text-outline transition hover:bg-surface-container-low disabled:opacity-40"
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(Number(event.target.value));
                  clearError();
                }}
                disabled={isSubmitting}
                aria-label="Cantidad"
                className="h-11 min-w-0 flex-1 border-x border-line-soft bg-transparent text-center text-sm font-semibold text-on-surface outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => value + 1);
                  clearError();
                }}
                disabled={isSubmitting}
                aria-label="Aumentar cantidad"
                className="flex h-11 w-11 items-center justify-center text-outline transition hover:bg-surface-container-low"
              >
                <Plus size={16} />
              </button>
            </div>

            {insufficientStock && (
              <p className="mt-2 text-xs font-medium text-error">
                No puedes retirar {quantity} unidades. El stock
                disponible es {currentProduct.stockActual}.
              </p>
            )}
          </section>

          <section
            className={`rounded-lg border p-4 ${
              insufficientStock
                ? "border-line-error bg-error-container"
                : "border-line-soft bg-background"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-outline">
                Stock después del movimiento
              </span>

              <span
                className={`text-lg font-semibold ${
                  insufficientStock
                    ? "text-error"
                    : "text-on-surface"
                }`}
              >
                {projectedStock}
              </span>
            </div>

            <p className="mt-1 text-xs text-outline">
              {isSalida
                ? `${currentProduct.stockActual} - ${quantity}`
                : `${currentProduct.stockActual} + ${quantity}`}
            </p>
          </section>

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-line-error bg-error-container px-3.5 py-3 text-xs text-error">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />

              <p>{error}</p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-line-soft px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 rounded-lg border border-line-strong bg-white px-4 text-sm font-medium text-ink-muted transition hover:bg-background disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!canSubmit}
            className="h-10 rounded-lg bg-primary-container px-5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Registrar movimiento"}
          </button>
        </footer>
      </div>
    </div>
  );
}