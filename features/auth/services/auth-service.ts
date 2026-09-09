import { api } from "@/lib/api/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    request
  );

  return data;
}