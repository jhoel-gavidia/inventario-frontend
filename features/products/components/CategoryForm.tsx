"use client";

import { RefreshCw, Save } from "lucide-react";
import { useState } from "react";
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
  const [nombre, setNombre] = useState(category?.nombre ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = category !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nombre.trim()) return;

    try {
      setIsSaving(true);

      await onSave({
        nombre: nombre.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setNombre(category?.nombre ?? "");
    onReset();
  }

  return (
    <div className="sticky top-[5.5rem] flex flex-col gap-4">
      <div className="relative flex flex-col gap-6 rounded-xl bg-white p-6 shadow-md">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold leading-7 text-[#0b1c30]">
              {isEditing ? "Editar Categoría" : "Nueva Categoría"}
            </h2>

            <p className="text-[13px] leading-[18px] text-[#434655]">
              Ingresa el nombre para catalogar repuestos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Limpiar formulario"
            className="rounded-lg p-1 text-[#737686] transition-colors hover:bg-[#e5eeff] hover:text-[#0b1c30]"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* NOMBRE */}
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="cat-name"
              className="flex items-center justify-between text-xs font-semibold leading-4 text-[#0b1c30]"
            >
              <span>Nombre de la Categoría *</span>

              <span className="text-[11px] font-normal text-[#737686]">
                Requerido
              </span>
            </label>

            <input
              id="cat-name"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. Sistema Eléctrico"
              maxLength={50}
              required
              className="w-full rounded-xl bg-[#eff4ff] px-3 py-1.5 text-sm leading-5 text-[#0b1c30] outline-none transition focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          {/* BOTONES */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl bg-[#e5eeff] px-3 py-2 text-center text-[13px] font-semibold leading-[18px] text-[#0b1c30] transition-colors hover:bg-[#dce9ff]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-3 py-2 text-center text-[13px] font-semibold leading-[18px] text-white shadow-md transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {isSaving
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Guardar Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}