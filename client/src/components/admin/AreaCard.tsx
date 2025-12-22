import { FaEdit, FaTrashAlt, FaUndo, FaMapMarkedAlt } from "react-icons/fa";
import type { AreaResponse } from "../../types/area.interface";

interface Props {
  area: AreaResponse;
  onEdit: (area: AreaResponse) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const AreaCard = ({ area, onEdit, onDelete, onRestore }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-md">
      {/* Indicador visual lateral */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          area.is_deleted ? "bg-red-500" : "bg-blue-500"
        }`}
      />

      {/* Encabezado */}
      <div className="flex justify-between items-start pl-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <FaMapMarkedAlt
              className={area.is_deleted ? "text-gray-400" : "text-blue-500"}
              size={16}
            />
            <span
              className={area.is_deleted ? "line-through text-gray-500" : ""}
            >
              {area.nombre}
            </span>
          </h3>
        </div>

        {area.is_deleted && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded">
            Eliminada
          </span>
        )}
      </div>

      {/* Descripción */}
      <div className="pl-2">
        <p className="text-sm text-gray-600">
          {area.descripcion ? (
            area.descripcion
          ) : (
            <span className="italic text-gray-400">Sin descripción</span>
          )}
        </p>
      </div>

      {/* Botones de Acción */}
      <div className="border-t border-gray-100 pt-3 mt-1 flex gap-3">
        {!area.is_deleted && (
          <button
            onClick={() => onEdit(area)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
          >
            <FaEdit /> Editar
          </button>
        )}

        {area.is_deleted ? (
          <button
            onClick={() => onRestore(area.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
          >
            <FaUndo /> Restaurar
          </button>
        ) : (
          <button
            onClick={() => onDelete(area.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            <FaTrashAlt /> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};
