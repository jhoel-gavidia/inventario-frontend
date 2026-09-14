import { api } from "@/lib/api/axios";
import type { LoginRequest, SessionUser } from "../types/auth";

export async function login(
  request: LoginRequest
): Promise<void> {
  await api.post("/auth/login", request);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getCurrentUser(): Promise<SessionUser> {
  const { data } = await api.get<SessionUser>("/auth/me");

  return data;
}