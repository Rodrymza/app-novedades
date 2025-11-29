import { FaEdit, FaTrash, FaCheckCircle, FaBan } from "react-icons/fa";
import type { UserResponse } from "../../types/user.interfaces";
import { MdRestore } from "react-icons/md";
import toast from "react-hot-toast";

interface Props {
  user: UserResponse;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onRecovery: (id: string) => void;
}

export const UserRow = ({ user, onDelete, onEdit, onRecovery }: Props) => {
  const rowClasses = user.is_deleted
    ? "bg-gray-100 opacity-70"
    : "hover:bg-gray-50 transition-colors";

  return (
    <tr className={rowClasses}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{user.username}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.nombre} {user.apellido}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{user.email}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.rol === "SUPERVISOR"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {user.rol}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        {user.is_deleted ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
            <FaBan className="w-3 h-3" /> Eliminado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
            <FaCheckCircle className="w-3 h-3" /> Activo
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() =>
            user.is_deleted
              ? toast.error("No puedes editar un usuario eliminado")
              : onEdit(user.id)
          }
          className="text-indigo-600 hover:text-indigo-900 mr-4 transition disabled:opacity-50"
          title="Editar"
        >
          <FaEdit className="w-5 h-5" />
        </button>

        {!user.is_deleted ? (
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:text-red-900 transition"
            title="Eliminar"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onRecovery(user.id)}
            className="text-orange-600 hover:text-red-900 transition"
            title="Restaurar"
          >
            <MdRestore className="w-5 h-5" />
          </button>
        )}
      </td>
    </tr>
  );
};
