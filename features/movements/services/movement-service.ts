import { api } from "@/lib/api/axios";
import type { Movement, MovementRequest } from "../types/movement";

export async function getMovements(): Promise<Movement[]> {
  const { data } = await api.get<Movement[]>("/movimientos");

  return data;
}

export async function getMovementById(id: number): Promise<Movement> {
  const { data } = await api.get<Movement>(`/movimientos/${id}`);

  return data;
}

export async function createMovement(
  request: MovementRequest,
): Promise<Movement> {
  const { data } = await api.post<Movement>("/movimientos", request);

  return data;
}