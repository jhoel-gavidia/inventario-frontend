import { Search, X } from "lucide-react";
import type { AuditFilters } from "../types/audit";

interface AuditFiltersProps {
  filters: AuditFilters;
  onChange: (filters: AuditFilters) => void;
}

const inputClassName =
  "h-10 w-full rounded-lg border border-line-strong bg-white px-3 text-sm text-on-surface outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-container/10";

export function AuditFilters({
  filters,
  onChange,
}: AuditFiltersProps) {
  const updateFilter = (
    key: keyof AuditFilters,
    value: string
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onChange({
      search: "",
      entidad: "",
      accion: "",
      fecha: "all",
    });
  };

  const hasFilters =
    filters.search.trim() !== "" ||
    filters.entidad !== "" ||
    filters.accion !== "" ||
    filters.fecha !== "all";

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
        <div className="relative md:col-span-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />

          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder="Buscar por ID, usuario o entidad..."
            aria-label="Buscar por ID, usuario o entidad"
            className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
          />
        </div>

        <select
          value={filters.entidad}
          onChange={(event) =>
            updateFilter("entidad", event.target.value)
          }
          aria-label="Filtrar por entidad"
          className={inputClassName}
        >
          <option value="">Todas las entidades</option>
          <option value="PRODUCTO">Producto</option>
          <option value="CATEGORIA">Categoría</option>
          <option value="MOVIMIENTO">Movimiento</option>
          <option value="USUARIO">Usuario</option>
        </select>

        <select
          value={filters.accion}
          onChange={(event) =>
            updateFilter("accion", event.target.value)
          }
          aria-label="Filtrar por acción"
          className={inputClassName}
        >
          <option value="">Todas las acciones</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>

        <select
          value={filters.fecha}
          onChange={(event) =>
            updateFilter("fecha", event.target.value)
          }
          aria-label="Filtrar por fecha"
          className={inputClassName}
        >
          <option value="all">Todo el historial</option>
          <option value="today">Hoy</option>
          <option value="7days">Últimos 7 días</option>
          <option value="month">Este mes</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-line-strong bg-white px-3 text-xs font-semibold text-ink-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={14} />

          Limpiar
        </button>
      </div>
    </div>
  );
}