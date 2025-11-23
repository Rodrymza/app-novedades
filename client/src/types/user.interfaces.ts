import type { ErrorResponse } from "./error.interface";

export interface CreateUserBody {
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  password: string;
  rol?: "OPERADOR" | "SUPERVISOR";
}

export interface UserResponse {
  id: string;
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  rol: "OPERADOR" | "SUPERVISOR";
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface UserList {
  id: string;
  nombre: string;
  apellido: string;
}
export type UserResponseData = UserResponse | ErrorResponse;
