import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaBan,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { MdRestore } from "react-icons/md";
import type { UserResponse } from "../../types/user.interfaces";

interface Props {
  user: UserResponse;
  esMismoUsuario: boolean;
  onDelete: (id: string) => void;
  onEdit: (user: UserResponse) => void;
  onRecovery: (id: string) => void;
}

export const UserRow = ({
  user,
  esMismoUsuario,
  onDelete,
  onEdit,
  onRecovery,
}: Props) => {
  // 1. ESTADO LOCAL PARA EXPANDIR
  const [expanded, setExpanded] = useState(false);

  // Formateo simple de fecha
  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRowClasses = () => {
    if (user.is_deleted) return "bg-gray-50"; // Eliminado: fondo gris base
    if (esMismoUsuario) return "bg-blue-50 border-blue-100";
    return "bg-white hover:bg-gray-50 transition-colors";
  };

  return (
    <>
      {/* --- FILA PRINCIPAL --- */}
      <tr className={`border-b border-gray-200 ${getRowClasses()}`}>
        {/* COLUMNA 1: USERNAME + TOGGLE */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            {/* Botón Toggle (Solo aparece si está eliminado y tiene audit) */}
            {user.is_deleted && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-blue-600 transition focus:outline-none"
                title="Ver detalles de eliminación"
              >
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}

            <div className="flex flex-col">
              <span
                className={`text-sm font-medium ${
                  user.is_deleted
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {user.username}
              </span>
              {esMismoUsuario && (
                <span className="text-[10px] font-bold text-blue-600">TÚ</span>
              )}
            </div>
          </div>
        </td>

        {/* ... Resto de columnas (Nombre, Email, Rol) iguales a antes ... */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {user.nombre} {user.apellido}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.email}
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 text-xs font-semibold rounded-full ${
              user.rol === "SUPERVISOR"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.rol}
          </span>
        </td>

        {/* COLUMNA ESTADO */}
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

        {/* COLUMNA ACCIONES */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {/* ... Tus botones de Editar / Eliminar / Restaurar ... */}
          {user.is_deleted ? (
            <button
              onClick={() => onRecovery(user.id)}
              className="text-orange-600 hover:text-orange-800 transition"
              title={`Restaurar usuario ${user.username}`}
            >
              <MdRestore className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onEdit(user)}
                className={`ml-4 text-indigo-600 hover:text-indigo-800 transition-colors"
                }`}
                title={`Editar usuario ${user.username}`}
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(user.id)}
                disabled={esMismoUsuario}
                title={`Eliminar usuario ${user.username}`}
                className={`ml-4 ${
                  esMismoUsuario
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-600 hover:text-red-800"
                }`}
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </>
          )}
          {/* Nota: He simplificado los botones para enfocarme en el expandible */}
        </td>
      </tr>

      {/* --- FILA DE DETALLES (EXPANDIBLE) --- */}
      {/* Solo se renderiza si está expandido Y el usuario está eliminado */}
      {expanded && user.is_deleted && user.audit_delete && (
        <tr className="bg-red-50/50 animate-fade-in">
          <td colSpan={6} className="px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-6 text-sm border-l-4 border-red-300 pl-4 ml-2">
              {/* 1. QUIÉN LO BORRÓ */}
              <div className="flex items-start gap-2">
                <FaUser className="mt-1 text-red-400" />
                <div>
                  <span className="block font-bold text-gray-700">
                    Responsable:
                  </span>
                  <span className="text-gray-600">
                    {/* Ajusta según tu populate: si es objeto usa .nombre, si es ID usa el string */}
                    {`${user.audit_delete.usuario.nombre} ${user.audit_delete.usuario.apellido}`}
                  </span>
                </div>
              </div>

              {/* 2. FECHA */}
              <div className="flex items-start gap-2">
                <FaCalendarAlt className="mt-1 text-red-400" />
                <div>
                  <span className="block font-bold text-gray-700">
                    Fecha de Baja:
                  </span>
                  <span className="text-gray-600">
                    {formatDate(user.audit_delete.fecha)}
                  </span>
                </div>
              </div>

              {/* 3. MOTIVO (El más importante) */}
              <div className="flex items-start gap-2 flex-1">
                <FaInfoCircle className="mt-1 text-red-400" />
                <div className="w-full">
                  <span className="block font-bold text-gray-700">Motivo:</span>
                  <p className="text-gray-800 italic bg-white/50 p-2 rounded border border-red-100 mt-1">
                    "{user.audit_delete.motivo}"
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
