import {
  FaCalendarAlt,
  FaTrashRestore,
  FaInfoCircle,
  FaTrash,
} from "react-icons/fa";
import type { NovedadResponse } from "../../types/novedad.interface";
import { useAuth } from "../../context/AuthContext";

interface Props {
  novedad: NovedadResponse;
  // EL CAMBIO CLAVE: El signo '?' hace que no sea obligatorio pasarlas
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NovedadCard = ({ novedad, onRestore, onDelete }: Props) => {
  const { user } = useAuth();

  // Helpers
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(fecha);
  };
  const getIniciales = (nombre: string, apellido: string) =>
    `${nombre[0]}${apellido[0]}`.toUpperCase();

  // Lógica
  const isDeleted = novedad.is_deleted; // O is_deleted según tu interfaz
  const isSupervisor = user?.rol === "SUPERVISOR";

  const containerClasses = isDeleted
    ? "bg-red-50 border-red-300 opacity-90 shadow-none"
    : "bg-white border-gray-300 hover:shadow-md";

  return (
    <div
      className={`w-full rounded-xl border transition-all duration-300 overflow-hidden flex flex-col h-full ${containerClasses}`}
    >
      {/* --- ENCABEZADO --- */}
      <div
        className={`p-4 flex justify-between items-start border-b ${
          isDeleted
            ? "bg-red-100/50 border-red-200"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              isDeleted
                ? "bg-red-200 text-red-700"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {getIniciales(novedad.usuario.nombre, novedad.usuario.apellido)}
          </div>
          <div>
            <h3
              className={`text-base font-bold ${
                isDeleted ? "text-red-900" : "text-gray-800"
              }`}
            >
              {novedad.usuario.apellido}, {novedad.usuario.nombre}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              @{novedad.usuario.username}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-0.5 rounded-full font-medium border text-base ${
              isDeleted
                ? "bg-white border-red-300 text-red-700"
                : "bg-indigo-100 text-indigo-700 border-indigo-200"
            }`}
          >
            {novedad.area.nombre}
          </span>

          {/* BOTÓN VISUAL CON TEXTO */}
          {!isDeleted && isSupervisor && onDelete && (
            <button
              onClick={() => onDelete(novedad.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-red-600 border border-red-200 bg-red-50 rounded hover:bg-red-600 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm"
              title="Mover a papelera"
            >
              <FaTrash className="w-3 h-3" /> BORRAR
            </button>
          )}

          {isDeleted && (
            <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-red-200">
              <FaTrashRestore /> EN PAPELERA
            </span>
          )}
        </div>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="p-4 flex-grow">
        <p
          className={`text-sm whitespace-pre-wrap leading-relaxed ${
            isDeleted ? "text-gray-500 italic" : "text-gray-600"
          }`}
        >
          {novedad.contenido}
        </p>
      </div>

      {/* --- PIE --- */}
      <div
        className={`px-4 py-3 border-t flex justify-between items-center ${
          isDeleted ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {novedad.etiquetas?.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div
          className={`text-xs px-2 py-1 text-white rounded-md flex items-center gap-1 font-bold ${
            isDeleted ? "bg-red-400" : "bg-indigo-400"
          }`}
        >
          <FaCalendarAlt /> {formatearFecha(novedad.fecha)}
        </div>
      </div>

      {/* --- AUDITORÍA Y RESTAURAR --- */}
      {isDeleted && (
        <div className="px-4 py-3 bg-red-100 border-t border-red-200 text-xs text-red-800">
          <div className="flex items-start gap-2 mb-2">
            <FaInfoCircle className="mt-0.5" />
            <div>
              <p>
                <span className="font-bold">Baja por:</span>{" "}
                {novedad.audit_delete?.usuario?.nombre || "?"}
              </p>
              <p className="italic">"{novedad.audit_delete?.motivo}"</p>
              <p>
                <span className="font-bold">Fecha borrada:</span>{" "}
                {formatearFecha(novedad.audit_delete!.fecha) ||
                  "Fecha desconocida"}
              </p>
            </div>
          </div>

          {/* También verificamos si onRestore existe antes de mostrar el botón */}
          {onRestore && (
            <button
              onClick={() => onRestore(novedad.id)}
              className="w-full bg-white border border-red-300 text-red-700 hover:bg-red-600 hover:text-white py-1.5 rounded text-center font-bold transition flex items-center justify-center gap-2 shadow-sm mt-1"
            >
              <FaTrashRestore /> Restaurar Novedad
            </button>
          )}
        </div>
      )}
    </div>
  );
};
