import { api } from "@/lib/api/axios";
import {
  getAllPages,
  getPagina,
  type PaginaResponse,
} from "@/lib/api/paginated";
import type {
  Movement,
  MovementRequest,
  MovementResumen,
  MovementRow,
  MovementRowFilters,
} from "../types/movement";

export async function getAllMovements(): Promise<Movement[]> {
  return getAllPages<Movement>("/movimientos");
}

export async function getMovementRows(
  filters: MovementRowFilters,
  pagina: number,
  tamano: number,
): Promise<PaginaResponse<MovementRow>> {
  const params: Record<string, unknown> = { pagina, tamano };

  if (filters.tipo) {
    params.tipo = filters.tipo;
  }

  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim();
  }

  return getPagina<MovementRow>("/movimientos/detalles", params);
}

export async function getMovementResumen(): Promise<MovementResumen> {
  const { data } = await api.get<MovementResumen>("/movimientos/resumen");

  return data;
}

export async function createMovement(
  request: MovementRequest,
): Promise<Movement> {
  const { data } = await api.post<Movement>("/movimientos", request);

  return data;
}
