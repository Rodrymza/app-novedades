export interface PlantillaResponse {
  id: string;
  nombre: string;
  tags: string[];
  contenido?: string;
  prioridad: string;
  is_deleted: boolean;
}

export interface CreatePlantilla {
  nombre: string;
  contenido: string;
  tags: string[];
  prioridad: string;
}

export interface ModificarPlantilla {
  nombre?: string;
  contenido?: string;
  tags?: string[];
  prioridad?: string;
}
