import { Types } from "mongoose";
import { ErrorResponse } from "./error.interface";

export interface CreateUserBody {
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  password: string;
  rol?: "OPERADOR" | "SUPERVISOR";
}

export interface UserResponse {
  id: Types.ObjectId;
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

export type UserResponseData = UserResponse | ErrorResponse;
