import { api } from "@/lib/api/axios";
import type { Category } from "../types/product";

export interface CategoryRequest {
  nombre: string;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categorias");
  return data;
}

export async function createCategory(
  request: CategoryRequest
): Promise<Category> {
  const { data } = await api.post<Category>("/categorias", request);
  return data;
}

export async function updateCategory(
  id: number,
  request: CategoryRequest
): Promise<Category> {
  const { data } = await api.put<Category>(`/categorias/${id}`, request);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}