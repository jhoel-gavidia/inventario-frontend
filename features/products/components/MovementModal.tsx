"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  X,
} from "lucide-react";
import { useState } from "react";

import type { MovementType, Product } from "../types/product";

interface MovementModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (
    product: Product,
    type: MovementType,
    quantity: number,
  ) => void;
}

export function MovementModal({
  open,
  product,
  onClose,
  onConfirm,
}: MovementModalProps) {
  const [type, setType] =
    useState<MovementType>("ENTRADA");

  const [quantity, setQuantity] = useState(1);

  if (!open || !product) {
    return null;
  }

  const currentProduct = product;

  function handleConfirm() {
    if (quantity < 1) {
      return;
    }

    onConfirm(currentProduct, type, quantity);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl">
        <div className="flex items-center justify-between bg-surface-container-low px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <ArrowLeftRight size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-on-surface">
                Registrar Movimiento de Kardex
              </h3>

              <span className="font-mono text-[11px] text-secondary">
                {product.codigo}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Tipo de Operación
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("ENTRADA")}
                className={`flex items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold ${
                  type === "ENTRADA"
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <ArrowUpCircle size={18} />
                Entrada (+ Stock)
              </button>

              <button
                type="button"
                onClick={() => setType("SALIDA")}
                className={`flex items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold ${
                  type === "SALIDA"
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <ArrowDownCircle size={18} />
                Salida (Taller)
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Cantidad
            </label>

            <input
              min={1}
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantity(Number(event.target.value))
              }
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Motivo
            </label>

            <select className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40">
              <option>Compra de Repuesto</option>
              <option>Reparación en Bahía 1</option>
              <option>Reparación en Bahía 2</option>
              <option>Ajuste por Merma/Rotura</option>
              <option>Venta Directa de Mostrador</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-secondary">
              Nota u Observación
            </label>

            <input
              type="text"
              placeholder="ej. Asignado a mototaxi..."
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 bg-surface-container-low px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-surface-container px-6 py-3 text-sm font-semibold hover:bg-surface-container-high"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-container"
          >
            Confirmar Movimiento
          </button>
        </div>
      </div>
    </div>
  );
}