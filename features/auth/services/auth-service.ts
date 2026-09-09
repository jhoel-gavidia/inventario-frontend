import { api } from "@/lib/api/axios";
import type { LoginRequest } from "../types/auth";

export async function login(
  request: LoginRequest
): Promise<void> {
  await api.post("/auth/login", request);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<void> {
  await api.get("/auth/me");
}