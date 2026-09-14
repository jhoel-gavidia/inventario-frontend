import type { UserRole } from "@/features/users/types/user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SessionUser {
  username: string;
  rol: UserRole;
}