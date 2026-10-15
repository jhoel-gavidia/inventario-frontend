import { api } from "@/lib/api/axios";
import { getAllPages } from "@/lib/api/paginated";
import type { Movement, MovementRequest } from "../types/movement";

export async function getMovements(): Promise<Movement[]> {
  return getAllPages<Movement>("/movimientos");
}

export async function createMovement(
  request: MovementRequest,
): Promise<Movement> {
  const { data } = await api.post<Movement>("/movimientos", request);

  return data;
}