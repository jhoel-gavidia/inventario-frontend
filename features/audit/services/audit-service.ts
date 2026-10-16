import { api } from "@/lib/api/axios";
import { getPagina, type PaginaResponse } from "@/lib/api/paginated";
import type { Audit, AuditFilters, AuditResumen } from "../types/audit";

const EXPORT_PAGE_SIZE = 100;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function computeDesde(fecha: string): string | null {
  if (fecha === "today") {
    return toISODate(new Date());
  }

  if (fecha === "7days") {
    const date = new Date();

    date.setDate(date.getDate() - 7);

    return toISODate(date);
  }

  if (fecha === "month") {
    const now = new Date();

    return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  return null;
}

function buildParams(filters: AuditFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.search.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.entidad) {
    params.entidad = filters.entidad;
  }

  if (filters.accion) {
    params.accion = filters.accion;
  }

  const desde = computeDesde(filters.fecha);

  if (desde) {
    params.desde = desde;
  }

  return params;
}

export async function getAuditsPagina(
  filters: AuditFilters,
  pagina: number,
  tamano: number,
): Promise<PaginaResponse<Audit>> {
  return getPagina<Audit>("/auditorias", {
    ...buildParams(filters),
    pagina,
    tamano,
  });
}

export async function getAuditResumen(): Promise<AuditResumen> {
  const { data } = await api.get<AuditResumen>("/auditorias/resumen");

  return data;
}

export async function getAllAuditsFiltered(
  filters: AuditFilters,
): Promise<Audit[]> {
  const params = buildParams(filters);

  const first = await getPagina<Audit>("/auditorias", {
    ...params,
    pagina: 0,
    tamano: EXPORT_PAGE_SIZE,
  });

  const items = [...first.contenido];

  for (let pagina = 1; pagina < first.totalPaginas; pagina += 1) {
    const next = await getPagina<Audit>("/auditorias", {
      ...params,
      pagina,
      tamano: EXPORT_PAGE_SIZE,
    });

    items.push(...next.contenido);
  }

  return items;
}
