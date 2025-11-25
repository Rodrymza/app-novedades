import { NovedadResponse } from "../interfaces/novedad.interface";

export class NovedadMapper {
  static toDto(doc: any): NovedadResponse {
    return {
      id: doc._id.toString(),
      contenido: doc.contenido,
      usuario: {
        id: doc.usuario?._id.toString() || "Sin ID",
        nombre: doc.usuario?.nombre || "Usuario",
        apellido: doc.usuario?.apellido || "Eliminado",
        username: doc.usuario?.username || "Desconocido",
      },
      area: {
        id: doc.area?._id.toString() || "Sin ID",
        nombre: doc?.area.nombre || "Area Eliminada",
      },
      etiquetas: doc.etiquetas,
      fecha: doc.createdAt.toISOString() || new Date().toISOString(),
    };
  }
}
