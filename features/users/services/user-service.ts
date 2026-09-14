import { api } from "@/lib/api/axios";
import type {
  User,
  UserRequest,
  UserUpdateRequest,
} from "../types/user";

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/usuarios");
  return data;
}

export async function createUser(
  request: UserRequest
): Promise<User> {
  const { data } = await api.post<User>("/usuarios", request);
  return data;
}

export async function updateUser(
  id: number,
  request: UserUpdateRequest
): Promise<User> {
  const { data } = await api.put<User>(
    `/usuarios/${id}`,
    request
  );

  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}