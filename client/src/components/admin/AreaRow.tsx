import { FaEdit, FaTrashAlt, FaUndo } from "react-icons/fa";
import type { AreaResponse } from "../../types/area.interface";

interface Props {
  area: AreaResponse;
  onEdit: (area: AreaResponse) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const AreaRow = ({ area, onEdit, onDelete, onRestore }: Props) => {
  return (
    <tr
      className={`transition-colors duration-150 ${
        area.is_deleted ? "bg-red-50" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span
            className={`font-medium ${
              area.is_deleted ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {area.nombre}
          </span>
          {area.is_deleted && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              Eliminada
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className={`text-sm ${
            area.is_deleted ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {area.descripcion || "—"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          {/* Botón EDITAR (Solo si no está eliminada) */}
          {!area.is_deleted && (
            <button
              onClick={() => onEdit(area)}
              className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition"
              title="Editar"
            >
              <FaEdit size={18} />
            </button>
          )}

          {/* Botón ELIMINAR / RESTAURAR */}
          {area.is_deleted ? (
            <button
              onClick={() => onRestore(area.id)}
              className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition"
              title="Restaurar"
            >
              <FaUndo size={16} />
            </button>
          ) : (
            <button
              onClick={() => onDelete(area.id)}
              className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition"
              title="Eliminar"
            >
              <FaTrashAlt size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
