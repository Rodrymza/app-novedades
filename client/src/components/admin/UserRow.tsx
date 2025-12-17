import { FaEdit, FaTrash, FaCheckCircle, FaBan } from "react-icons/fa";
import type { UserResponse } from "../../types/user.interfaces";
import { MdRestore } from "react-icons/md";
import toast from "react-hot-toast";

interface Props {
  user: UserResponse;
  esMismoUsuario: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onRecovery: (id: string) => void;
}

export const UserRow = ({
  user,
  esMismoUsuario, // <--- Importante: Ahora lo desestructuramos
  onDelete,
  onEdit,
  onRecovery,
}: Props) => {
  // --- LÓGICA DE ESTILOS ---
  const getRowClasses = () => {
    // 1. Prioridad: Eliminado (Gris y opaco)
    if (user.is_deleted) return "bg-gray-100 opacity-70";
    // 2. Prioridad: Es el usuario logueado (Azul suave)
    if (esMismoUsuario) return "bg-blue-50 border-blue-100";
    // 3. Prioridad: Normal (Blanco con hover gris)
    return "bg-white hover:bg-gray-50 transition-colors";
  };

  return (
    <tr className={`border-b ${getRowClasses()}`}>
      {/* 1. USERNAME + BADGE TÚ */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-900">
            {user.username}
          </div>
          {esMismoUsuario && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Tú
            </span>
          )}
        </div>
      </td>

      {/* 2. NOMBRE COMPLETO */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.nombre} {user.apellido}
        </div>
      </td>

      {/* 3. EMAIL */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{user.email}</div>
      </td>

      {/* 4. ROL */}
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

      {/* 5. ESTADO (ACTIVO / ELIMINADO) */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {user.is_deleted ? (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 cursor-help"
            title={`Motivo eliminación: ${
              user.audit_delete?.motivo || "No especificado"
            }`}
          >
            <FaBan className="w-3 h-3" /> Eliminado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
            <FaCheckCircle className="w-3 h-3" /> Activo
          </span>
        )}
      </td>

      {/* 6. ACCIONES */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* BOTÓN EDITAR */}
        <button
          onClick={() =>
            user.is_deleted
              ? toast.error("No puedes editar un usuario eliminado")
              : onEdit(user.id)
          }
          // Agregué opacidad visual si está eliminado para indicar que no es clickeable
          className={`mr-4 transition ${
            user.is_deleted
              ? "text-indigo-300 cursor-not-allowed"
              : "text-indigo-600 hover:text-indigo-900"
          }`}
          title="Editar"
        >
          <FaEdit className="w-5 h-5" />
        </button>

        {/* LÓGICA ELIMINAR VS RESTAURAR */}
        {!user.is_deleted ? (
          <button
            onClick={() => onDelete(user.id)}
            disabled={esMismoUsuario} // Bloqueo funcional
            className={`transition ${
              esMismoUsuario
                ? "text-gray-300 cursor-not-allowed" // Bloqueo visual
                : "text-red-600 hover:text-red-900"
            }`}
            title={
              esMismoUsuario
                ? "No puedes eliminar tu propia cuenta"
                : "Eliminar"
            }
          >
            <FaTrash className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onRecovery(user.id)}
            className="text-orange-600 hover:text-orange-800 transition"
            title="Restaurar"
          >
            <MdRestore className="w-6 h-6" />{" "}
            {/* Aumenté un poco el tamaño para destacar */}
          </button>
        )}
      </td>
    </tr>
  );
};
