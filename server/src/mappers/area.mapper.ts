import { AreaResponse } from "../interfaces/area.interface";

export class AreaMapper {
  static toDTO(doc: any): AreaResponse {
    return {
      id: doc._id,
      nombre: doc.nombre,
      descripcion: doc.descripcion,
    };
  }
}
