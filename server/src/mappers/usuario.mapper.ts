import { Rol, UserResponse } from "../interfaces/user.interfaces";

export class UsuarioMapper {
  static toDto(doc: any): UserResponse {
    const userDto: UserResponse = {
      id: doc?._id || "Sin ID",
      apellido: doc?.apellido || "Usuario",
      nombre: doc?.nombre || "Eliminado",
      username: doc?.username || "Desconocido",
      email: doc?.email || "Desconocido",
      rol: (doc?.rol as Rol) || ("Operador" as Rol),
      is_deleted: doc?.is_deleted || false,
    };
    if (doc.is_deleted) {
      const usuarioDelete = doc.audit_delete?.usuario_id;
      userDto.audit_delete = {
        fecha:
          doc.audit_delete?.fecha.toISOString() || "Sin fecha de eliminacion",
        usuario: {
          id: usuarioDelete?._id.toString() || "Sin ID",
          nombre: usuarioDelete?.nombre || "Usuario",
          apellido: usuarioDelete?.apellido || "Eliminado",
        },
        motivo: doc.audit_delete?.motivo || "Sin motivo",
      };
    }
    return userDto;
  }
}
