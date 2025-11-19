import { UserResponse } from "../interfaces/user.interfaces";

export class UsuarioMapper {
  static toDto(doc: any): UserResponse {
    return {
      id: doc?._id || "Sin ID",
      apellido: doc?.apellido || "Usuario",
      nombre: doc?.nombre || "Eliminado",
      username: doc?.username || "Desconocido",
      email: doc?.email || "Desconocido",
      rol: doc?.rol || "OPERADOR",
    };
  }
}
