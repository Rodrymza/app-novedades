import { NovedadResponse } from "../interfaces/novedad.interface";
import { Rol } from "../interfaces/user.interfaces";

export class NovedadMapper {
  static toDto(doc: any, rol: Rol): NovedadResponse {
    const novedadDto: NovedadResponse = {
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
      is_deleted: doc.is_deleted,
    };
    if (rol === Rol.SUPERVISOR && doc.is_deleted) {
      const usuarioDelete = doc.audit_delete?.usuario_id;
      novedadDto.audit_delete = {
        fecha: doc.audit_delete?.fecha.toISOString() || "No se encontro fecha",
        usuario: {
          id: usuarioDelete?._id.toString() || "Sin ID",
          nombre: usuarioDelete?.nombre || "Sin nombre",
          apellido: usuarioDelete?.apellido || "Sin apellido",
          username: usuarioDelete?.username || "Sin username",
        },
        motivo: doc.audit_delete?.motivo || "No se encontro motivo",
      };
    }
    return novedadDto;
  }
}
