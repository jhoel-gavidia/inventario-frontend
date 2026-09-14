"use client";

import {
  AlertCircle,
  CheckCircle,
  CircleMinus,
  CirclePlus,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { getApiErrorMessage } from "@/lib/api/errors";
import type { Product } from "@/features/products/types/product";

import { useCreateMovement } from "../hooks/use-create-movement";
import type {
  MovementRequest,
  MovementType,
} from "../types/movement";

interface MovementFormProps {
  products: Product[];
  initialType?: MovementType;
}

interface MovementRow {
  id: string;
  productoId: number | null;
  cantidad: number;
}

function createRow(): MovementRow {
  return {
    id: crypto.randomUUID(),
    productoId: null,
    cantidad: 1,
  };
}

export function MovementForm({
  products,
  initialType,
}: MovementFormProps) {
  const { createMovement, isPending } = useCreateMovement();
  const isSubmitting = isPending;
  const [tipo, setTipo] = useState<MovementType>(
    initialType ?? "ENTRADA",
  );
  const [rows, setRows] = useState<MovementRow[]>([createRow()]);
  const [error, setError] = useState<string | null>(null);

  const activeProducts = useMemo(
    () => products.filter((product) => product.estado),
    [products],
  );

  const selectedProductIds = useMemo(
    () =>
      new Set(
        rows
          .map((row) => row.productoId)
          .filter((id): id is number => id !== null),
      ),
    [rows],
  );

  const totalQuantity = useMemo(
    () => rows.reduce((total, row) => total + (row.cantidad || 0), 0),
    [rows],
  );

  const hasDuplicateProducts =
    selectedProductIds.size !==
    rows.filter((row) => row.productoId !== null).length;

  const hasEmptyProduct = rows.some(
    (row) => row.productoId === null,
  );

  const hasInvalidQuantity = rows.some(
    (row) => !Number.isInteger(row.cantidad) || row.cantidad <= 0,
  );

  const hasInsufficientStock =
    tipo === "SALIDA" &&
    rows.some((row) => {
      if (row.productoId === null) {
        return false;
      }

      const product = products.find(
        (item) => item.id === row.productoId,
      );

      return product
        ? row.cantidad > product.stockActual
        : false;
    });

  const isInvalid =
    rows.length === 0 ||
    hasEmptyProduct ||
    hasDuplicateProducts ||
    hasInvalidQuantity ||
    hasInsufficientStock ||
    activeProducts.length === 0 ||
    isSubmitting;

  function updateRow(
    rowId: string,
    field: keyof Omit<MovementRow, "id">,
    value: number | null,
  ) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );

    setError(null);
  }

  function addRow() {
    setRows((currentRows) => [...currentRows, createRow()]);
    setError(null);
  }

  function removeRow(rowId: string) {
    setRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows;
      }

      return currentRows.filter((row) => row.id !== rowId);
    });

    setError(null);
  }

  function resetForm() {
    setTipo("ENTRADA");
    setRows([createRow()]);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isInvalid) {
      return;
    }

    const request: MovementRequest = {
      tipo,
      detalles: rows.map((row) => ({
        productoId: row.productoId as number,
        cantidad: row.cantidad,
      })),
    };

    try {
      setError(null);

      await createMovement(request);

      resetForm();
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
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="rounded-xl border border-[#e5e7ef] bg-white"
    >
      <div className="border-b border-[#eef0f5] px-5 py-5">
        <h2 className="font-semibold">Nuevo Movimiento</h2>

        <p className="mt-1 text-xs text-[#737686]">
          Actualiza el stock registrando una entrada o salida.
        </p>
      </div>

      <div className="space-y-6 p-5">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#737686]">
            Tipo de movimiento
          </p>

          <div className="grid grid-cols-2 rounded-lg border border-[#e5e7ef] bg-[#f8f9ff] p-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setTipo("ENTRADA");
                setError(null);
              }}
              className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition ${
                tipo === "ENTRADA"
                  ? "bg-white text-[#16823b] shadow-sm"
                  : "text-[#737686] hover:text-[#434655]"
              }`}
            >
              <CirclePlus size={17} />
              Entrada
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setTipo("SALIDA");
                setError(null);
              }}
              className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition ${
                tipo === "SALIDA"
                  ? "bg-white text-[#ba1a1a] shadow-sm"
                  : "text-[#737686] hover:text-[#434655]"
              }`}
            >
              <CircleMinus size={17} />
              Salida
            </button>
          </div>

          <div
            className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs ${
              tipo === "ENTRADA"
                ? "bg-[#ecfdf3] text-[#16823b]"
                : "bg-[#fff1f1] text-[#ba1a1a]"
            }`}
          >
            {tipo === "ENTRADA" ? (
              <CirclePlus size={15} />
            ) : (
              <CircleMinus size={15} />
            )}

            <span>
              {tipo === "ENTRADA"
                ? "El stock de los productos aumentará."
                : "El stock de los productos disminuirá."}
            </span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Repuestos</p>
              <p className="mt-0.5 text-xs text-[#737686]">
                Selecciona los productos y cantidades.
              </p>
            </div>

            <span className="rounded-full bg-[#f1f3f8] px-2.5 py-1 text-xs font-medium text-[#434655]">
              {rows.length}{" "}
              {rows.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          {activeProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#dfe2ea] bg-[#fafbff] px-4 py-6 text-center">
              <p className="text-sm font-medium text-[#434655]">
                No hay productos activos
              </p>

              <p className="mt-1 text-xs text-[#737686]">
                Debes tener al menos un producto activo para registrar
                movimientos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => {
                const selectedProduct =
                  row.productoId !== null
                    ? products.find(
                        (product) => product.id === row.productoId,
                      )
                    : undefined;

                return (
                  <div
                    key={row.id}
                    className="rounded-lg border border-[#e5e7ef] bg-[#fafbff] p-3"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_88px_36px]">
                      <div className="min-w-0">
                        <label
                          htmlFor={`producto-${row.id}`}
                          className="mb-1.5 block text-xs font-medium text-[#434655]"
                        >
                          Repuesto
                        </label>

                        <select
                          id={`producto-${row.id}`}
                          value={row.productoId ?? ""}
                          disabled={isSubmitting}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "productoId",
                              event.target.value
                                ? Number(event.target.value)
                                : null,
                            )
                          }
                          className="h-10 w-full rounded-lg border border-[#dfe2ea] bg-white px-3 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 disabled:cursor-not-allowed disabled:bg-[#f3f4f7]"
                        >
                          <option value="">
                            Seleccionar repuesto...
                          </option>

                          {activeProducts.map((product) => {
                            const alreadySelected =
                              selectedProductIds.has(product.id) &&
                              product.id !== row.productoId;

                            return (
                              <option
                                key={product.id}
                                value={product.id}
                                disabled={alreadySelected}
                              >
                                {product.codigo} — {product.nombre}
                              </option>
                            );
                          })}
                        </select>

                        {selectedProduct && (
                          <p className="mt-1.5 text-xs text-[#737686]">
                            Stock actual:{" "}
                            <span className="font-mono font-medium text-[#434655]">
                              {selectedProduct.stockActual}
                            </span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`cantidad-${row.id}`}
                          className="mb-1.5 block text-xs font-medium text-[#434655]"
                        >
                          Cantidad
                        </label>

                        <input
                          id={`cantidad-${row.id}`}
                          type="number"
                          min={1}
                          step={1}
                          value={row.cantidad}
                          disabled={isSubmitting}
                          onChange={(event) => {
                            const value = Number(event.target.value);

                            updateRow(
                              row.id,
                              "cantidad",
                              Number.isNaN(value) ? 0 : value,
                            );
                          }}
                          className={`h-10 w-full rounded-lg border bg-white px-3 text-center font-mono text-sm outline-none transition focus:ring-2 focus:ring-[#2563eb]/10 disabled:cursor-not-allowed disabled:bg-[#f3f4f7] ${
                            tipo === "SALIDA" &&
                            selectedProduct &&
                            row.cantidad >
                              selectedProduct.stockActual
                              ? "border-[#ba1a1a] focus:border-[#ba1a1a]"
                              : "border-[#dfe2ea] focus:border-[#2563eb]"
                          }`}
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={
                            isSubmitting || rows.length === 1
                          }
                          onClick={() => removeRow(row.id)}
                          aria-label="Eliminar repuesto"
                          className="flex h-10 w-9 items-center justify-center rounded-lg border border-[#e5e7ef] text-[#737686] transition hover:border-[#f0caca] hover:bg-[#fff7f7] hover:text-[#ba1a1a] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {tipo === "SALIDA" &&
                      selectedProduct &&
                      row.cantidad >
                        selectedProduct.stockActual && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#ba1a1a]">
                          <AlertCircle size={14} />
                          Stock insuficiente. Disponible:{" "}
                          {selectedProduct.stockActual}.
                        </p>
                      )}
                  </div>
                );
              })}
            </div>
          )}

          {activeProducts.length > 0 && (
            <button
              type="button"
              disabled={
                isSubmitting ||
                rows.length >= activeProducts.length
              }
              onClick={addRow}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#cbd2df] py-2.5 text-xs font-medium text-[#434655] transition hover:border-[#2563eb] hover:bg-[#f8faff] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={15} />
              Agregar otro repuesto
            </button>
          )}
        </div>

        <div className="rounded-lg border border-[#e5e7ef] bg-[#f8f9ff] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#434655]">
              Total de unidades
            </span>

            <span className="font-mono text-lg font-semibold text-[#0b1c30]">
              {totalQuantity}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-[#737686]">
            <span>Tipo</span>

            <span
              className={`font-medium ${
                tipo === "ENTRADA"
                  ? "text-[#16823b]"
                  : "text-[#ba1a1a]"
              }`}
            >
              {tipo === "ENTRADA" ? "Entrada" : "Salida"}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[#f2cccc] bg-[#fff7f7] px-3.5 py-3 text-xs text-[#ba1a1a]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {hasDuplicateProducts && (
          <ValidationMessage>
            No puedes seleccionar el mismo repuesto más de una vez.
          </ValidationMessage>
        )}

        {hasEmptyProduct && (
          <ValidationMessage>
            Debes seleccionar un repuesto en cada fila.
          </ValidationMessage>
        )}

        {hasInvalidQuantity && (
          <ValidationMessage>
            Todas las cantidades deben ser números enteros mayores a cero.
          </ValidationMessage>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={resetForm}
            className="h-10 rounded-lg border border-[#dfe2ea] px-4 text-sm font-medium text-[#434655] transition hover:bg-[#f8f9ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpiar
          </button>

          <button
            type="submit"
            disabled={isInvalid}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-5 text-sm font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Registrando...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Registrar movimiento
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function ValidationMessage({
  children,
}: {
  children: string;
}) {
  return (
    <p className="-mt-3 flex items-center gap-1.5 text-xs text-[#ba1a1a]">
      <AlertCircle size={14} />
      {children}
    </p>
  );
}

