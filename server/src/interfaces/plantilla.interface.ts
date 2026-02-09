import { ErrorResponse } from "./error.interface";

export interface PlantillaResponse {
  id: string;
  nombre: string;
  tags: string[];
  contenido?: string;
  prioridad: string;
  is_deleted: boolean;
}

export type PlantillaResponseData = PlantillaResponse | ErrorResponse;
