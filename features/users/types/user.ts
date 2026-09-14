export type UserRole = "ADMIN" | "USER";

export interface User {
  id: number;
  username: string;
  rol: UserRole;
  estado: boolean;
}

export interface UserRequest {
  username: string;
  password: string;
  rol: UserRole;
  estado: boolean;
}

export interface UserUpdateRequest {
  username: string;
  rol: UserRole;
  estado: boolean;
}