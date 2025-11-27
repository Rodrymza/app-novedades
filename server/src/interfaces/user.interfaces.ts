import { Types } from "mongoose";
import { ErrorResponse } from "./error.interface";

export enum Rol {
  OPERADOR = "OPERADOR",
  SUPERVISOR = "SUPERVISOR",
}

export interface CreateUserBody {
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  password: string;
  rol?: Rol;
}

export interface UserResponse {
  id: Types.ObjectId;
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  rol: Rol;
}

export interface LoginUser {
  username: string;
  password: string;
}

export type UserResponseData = UserResponse | ErrorResponse;
