import type { ErrorResponse } from "./error.interface";

export interface CreateNovedad {
  contenido: string;
  area_id: string;
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
  usuario_id: string | undefined;
  area_id: string | undefined;
  tags: string[] | undefined;
  fechaInicio: string | undefined;
  fechaFin: string | undefined;
  textoBusqueda: string | undefined;
}

export type NovedadResponseData = NovedadResponse | ErrorResponse;
