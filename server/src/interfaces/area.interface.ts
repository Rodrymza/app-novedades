import { ErrorResponse } from "./error.interface";

export interface ICreateArea {
  nombre: string;
  descripcion?: string;
}

export interface AreaResponse {
  id: string;
  nombre: string;
  descripcion: string;
  is_deleted: boolean;
}

export type AreaResponseData = AreaResponse | ErrorResponse;
