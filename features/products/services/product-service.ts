import { api } from "@/lib/api/axios";
import type {
  Product,
  ProductRequest,
} from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/productos");

  return data;
}

export async function getProductById(
  id: number
): Promise<Product> {
  const { data } = await api.get<Product>(
    `/productos/${id}`
  );

  return data;
}

export async function createProduct(
  request: ProductRequest
): Promise<Product> {
  const { data } = await api.post<Product>(
    "/productos",
    request
  );

  return data;
}

export async function updateProduct(
  id: number,
  request: ProductRequest
): Promise<Product> {
  const { data } = await api.put<Product>(
    `/productos/${id}`,
    request
  );

  return data;
}

export async function deleteProduct(
  id: number
): Promise<void> {
  await api.delete(`/productos/${id}`);
}