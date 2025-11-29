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
  is_deleted: boolean;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface UserList {
  _id: string;
  nombre: string;
  apellido: string;
}
export interface IDeleteUser {
  motivo: string;
  id_usuario: string;
}
export type UserResponseData = UserResponse | ErrorResponse;
