import { Types } from "mongoose";
import { ErrorResponse } from "./error.interface";

export interface CreateNovedad {
  contenido: string;
  usuario_id: Types.ObjectId;
  area_id: Types.ObjectId;
  etiquetas: string[];
}

export interface NovedadResponse {
  id: string;
  contenido: string;
  usuario: {
    id: string;
    apellido: string;
    nombre: string;
    username: string;
  };
  area: {
    id: string;
    nombre: string;
  };
  etiquetas?: string[];
  fecha: string;
}

export interface FiltroNovedad {
  usuario_id: string;
  area_id: string;
  tags: string[];
  fechaInicio: string;
  fechaFin: string;
  textoBusqueda: string;
}

export type NovedadResponseData = NovedadResponse | ErrorResponse;
