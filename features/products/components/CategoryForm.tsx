"use client";

import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Save,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import type { Category } from "../types/product";
import type { CategoryRequest } from "../services/category-service";

interface CategoryFormProps {
  category: Category | null;
  onSave: (data: CategoryRequest) => Promise<void>;
  onCancel: () => void;
  onReset: () => void;
}

export function CategoryForm({
  category,
  onSave,
  onCancel,
  onReset,
}: CategoryFormProps) {
  const [nombre, setNombre] = useState(
    category?.nombre ?? "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = category !== null;
  const normalizedName = nombre.trim();

  const isInvalid =
    normalizedName.length === 0 ||
    normalizedName.length > 50 ||
    isSaving;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isInvalid) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await onSave({
        nombre: normalizedName,
      });
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError),
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setNombre(category?.nombre ?? "");
    setError(null);
    onReset();
  }

  function handleCancel() {
    setError(null);
    onCancel();
  }

  return (
    <div className="sticky top-6">
      <div className="rounded-xl border border-[#e5e7ef] bg-white">
        {/* Header */}
        <div className="border-b border-[#eef0f5] px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
                  <CheckCircle size={17} />
                </div>

                <h2 className="font-semibold">
                  {isEditing
                    ? "Editar Categoría"
                    : "Nueva Categoría"}
                </h2>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#737686]">
                {isEditing
                  ? "Actualiza el nombre de la categoría."
                  : "Crea una categoría para organizar los repuestos."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              title="Restablecer formulario"
              className="rounded-lg p-2 text-[#737686] transition hover:bg-[#eff4ff] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="category-name"
                className="text-xs font-semibold text-[#0b1c30]"
              >
                Nombre de la categoría
              </label>

              <span className="text-[11px] text-[#737686]">
                {nombre.length}/50
              </span>
            </div>

            <input
              id="category-name"
              type="text"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
                setError(null);
              }}
              placeholder="Ej. Sistema Eléctrico"
              maxLength={50}
              disabled={isSaving}
              autoComplete="off"
              className="h-10 w-full rounded-lg border border-[#dfe2ea] bg-white px-3 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#9a9dab] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 disabled:cursor-not-allowed disabled:bg-[#f3f4f7]"
            />

            <p className="mt-1.5 text-xs text-[#737686]">
              Usa un nombre claro y fácil de identificar.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-[#f2cccc] bg-[#fff7f7] px-3.5 py-3 text-xs text-[#ba1a1a]">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-10 flex-1 rounded-lg border border-[#dfe2ea] px-4 text-sm font-medium text-[#434655] transition hover:bg-[#f8f9ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={isInvalid}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEditing
                    ? "Actualizar categoría"
                    : "Guardar categoría"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getRequestErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No se pudo guardar la categoría. Inténtalo nuevamente.";
}

