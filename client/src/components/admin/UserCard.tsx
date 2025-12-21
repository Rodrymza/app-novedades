import {
  FaEdit,
  FaTrashAlt,
  FaUndo,
  FaUserShield,
  FaUser,
} from "react-icons/fa";
import type { UserResponse } from "../../types/user.interfaces";

interface Props {
  user: UserResponse;
  esMismoUsuario: boolean;
  onEdit: (user: UserResponse) => void;
  onDelete: (id: string) => void;
  onRecovery: (id: string) => void;
}

export const UserCard = ({
  user,
  esMismoUsuario,
  onEdit,
  onDelete,
  onRecovery,
}: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-md">
      {/* --- Indicador de Estado (Borde Izquierdo) --- */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          user.is_deleted ? "bg-red-500" : "bg-green-500"
        }`}
      />

      {/* --- Encabezado: Username y Rol --- */}
      <div className="flex justify-between items-start pl-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            {user.username}
            {esMismoUsuario && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Tú
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            {user.rol === "SUPERVISOR" ? (
              <FaUserShield className="text-indigo-500" />
            ) : (
              <FaUser className="text-gray-400" />
            )}
            {user.rol}
          </p>
        </div>

        {/* Badge de Estado Visual */}
        {user.is_deleted && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded">
            Eliminado
          </span>
        )}
      </div>

      {/* --- Info Principal --- */}
      <div className="pl-2 space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Nombre:</span>{" "}
          {user.nombre} {user.apellido}
        </p>
        <p className="text-sm text-gray-600 truncate">
          <span className="font-medium text-gray-900">Email:</span> {user.email}
        </p>
        {user.documento && (
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">DNI:</span>{" "}
            {user.documento}
          </p>
        )}
      </div>

      {/* --- Botones de Acción --- */}
      <div className="border-t border-gray-100 pt-3 mt-1 flex justify-end gap-3">
        {/* Solo mostrar acciones si NO está eliminado (para editar) */}
        {!user.is_deleted && (
          <button
            onClick={() => onEdit(user)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
          >
            <FaEdit /> Editar
          </button>
        )}

        {/* Botón Borrar / Restaurar */}
        {user.is_deleted ? (
          <button
            onClick={() => onRecovery(user.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
          >
            <FaUndo /> Restaurar
          </button>
        ) : (
          <button
            onClick={() => onDelete(user.id)}
            disabled={esMismoUsuario} // No te puedes borrar a ti mismo
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              esMismoUsuario
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <FaTrashAlt /> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};
