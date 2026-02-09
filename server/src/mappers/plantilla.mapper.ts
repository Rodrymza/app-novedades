import { PlantillaResponse } from "../interfaces/plantilla.interface";

export class PlantillaMapper {
  static toDTO(doc: any): PlantillaResponse {
    return {
      id: doc._id,
      nombre: doc.nombre,
      tags: doc.tags || [],
      contenido: doc.contenido,
      prioridad: doc.prioridad,
      is_deleted: doc.is_deleted,
    };
  }
}
