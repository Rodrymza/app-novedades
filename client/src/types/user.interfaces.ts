import type { ErrorResponse } from "./error.interface";

export interface CreateUserBody {
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  documento: string;
  password: string;
  rol?: "OPERADOR" | "SUPERVISOR";
}

export interface UserResponse {
  id: string;
  apellido: string;
  nombre: string;
  username: string;
  documento: string;
  email: string;
  rol: "OPERADOR" | "SUPERVISOR";
  is_deleted: boolean;
  audit_delete?: {
    fecha: string;
    usuario: {
      id: string;
      nombre: string;
      apellido: string;
    };
    motivo: string;
  };
}

export type Rol = "SUPERVISOR" | "OPERADOR";

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

export interface IEditUser {
  apellido: string;
  nombre: string;
  email: string;
  documento: string;
}
export type UserResponseData = UserResponse | ErrorResponse;
