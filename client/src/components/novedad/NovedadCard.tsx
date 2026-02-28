import {
  FaCalendarAlt,
  FaTrashRestore,
  FaInfoCircle,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTools,
  FaBuilding,
} from "react-icons/fa";
import type { NovedadResponse } from "../../types/novedad.interface";
import { useAuth } from "../../context/AuthContext";
import { getIniciales } from "../../utils/utils";

interface Props {
  novedad: NovedadResponse;
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
  isVertical?: boolean;
}

const PRIORIDAD_CONFIG = {
  URGENTE: {
    color: "bg-red-600 text-white",
    icon: <FaExclamationTriangle className="w-3 h-3" />,
    label: "URGENTE",
    border: "border-red-600",
    lightBg: "bg-red-50",
    avatarRing: "border-red-200 text-red-700 bg-red-100",
  },
  PENDIENTE: {
    color: "bg-yellow-500 text-white",
    icon: <FaClock className="w-3 h-3" />,
    label: "PENDIENTE",
    border: "border-yellow-500",
    lightBg: "bg-yellow-50",
    avatarRing: "border-yellow-200 text-yellow-700 bg-yellow-100",
  },
  MANTENIMIENTO: {
    color: "bg-orange-500 text-white",
    icon: <FaTools className="w-3 h-3" />,
    label: "MANTENIMIENTO",
    border: "border-orange-500",
    lightBg: "bg-orange-50",
    avatarRing: "border-orange-200 text-orange-700 bg-orange-100",
  },
  RUTINA: {
    color: "bg-green-600 text-white",
    icon: <FaCheckCircle className="w-3 h-3" />,
    label: "RUTINA",
    border: "border-green-600",
    lightBg: "bg-green-50",
    avatarRing: "border-green-200 text-green-700 bg-green-100",
  },
  INFORMATIVA: {
    color: "bg-blue-600 text-white",
    icon: <FaInfoCircle className="w-3 h-3" />,
    label: "INFO",
    border: "border-blue-600",
    lightBg: "bg-blue-50",
    avatarRing: "border-blue-200 text-blue-700 bg-blue-100",
  },
};

const formatearFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "long",
  }).format(fecha);
};

export const NovedadCard = ({
  novedad,
  onRestore,
  onDelete,
  isVertical = true,
}: Props) => {
  const { user } = useAuth();
  const isDeleted = novedad.is_deleted;
  const isSupervisor = user?.rol === "SUPERVISOR";
  const pConfig =
    PRIORIDAD_CONFIG[novedad.prioridad as keyof typeof PRIORIDAD_CONFIG] ||
    PRIORIDAD_CONFIG.RUTINA;

  // Clases dinámicas del contenedor principal
  const containerClasses = isDeleted
    ? "border-slate-300 opacity-90 shadow-none"
    : `${pConfig.border} hover:shadow-xl hover:-translate-y-0.5`;

  return (
    <div
      className={`w-full max-w-6xl mx-auto rounded-xl border-2 transition-all duration-300 overflow-hidden flex flex-col  ${containerClasses} cursor-default`}
    >
      {/* 1. CINTA DE PRIORIDAD (TECHO) */}
      <div
        className={`w-full px-4 py-2 text-base font-black tracking-widest uppercase flex justify-center items-center gap-2 ${
          isDeleted ? "bg-slate-700 text-white" : pConfig.color
        }`}
      >
        {isDeleted ? <FaTrash size={14} /> : pConfig.icon}
        {isDeleted ? "ELIMINADA" : pConfig.label}
      </div>

      {/* 2. CONTENEDOR CENTRAL DE COLUMNAS (EL RELLENO DEL SÁNDWICH) */}
      <div
        className={`flex ${isVertical ? "flex-col md:flex-row" : "flex-col"} flex-grow`}
      >
        {/* --- COLUMNA IZQUIERDA: Contexto --- */}
        <div
          className={`${isVertical ? "md:w-72 md:border-r" : "w-full"} flex-shrink-0 flex flex-col border-b ${
            isDeleted
              ? "bg-slate-100 border-slate-200"
              : `${pConfig.lightBg} border-gray-200`
          }`}
        >
          {/* Info del Usuario */}
          <div
            className={`flex items-center justify-center text-center flex-grow gap-4 flex-col ${
              isVertical ? "p-6" : "p-2 lg:flex-row"
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl border-2 shadow-sm ${
                isDeleted
                  ? "bg-slate-200 text-slate-400 border-slate-300"
                  : pConfig.avatarRing
              }`}
            >
              {getIniciales(novedad.usuario.nombre, novedad.usuario.apellido)}
            </div>

            <h3
              className={`text-lg font-bold leading-tight ${isDeleted ? "text-slate-600" : "text-gray-900"}`}
            >
              {novedad.usuario.apellido}, {novedad.usuario.nombre}
              <span className="block text-sm font-semibold text-indigo-600 mt-1 tracking-wider">
                @{novedad.usuario.username}
              </span>
            </h3>

            {/* Badge de Área */}
            <div
              className={`px-4 py-1.5 rounded-lg border-l-4 font-black text-sm uppercase flex items-center gap-2 shadow-sm ${
                isDeleted
                  ? "bg-slate-200 border-slate-400 text-slate-500"
                  : "bg-white border-indigo-500 text-indigo-700"
              }`}
            >
              <FaBuilding className="opacity-50" /> {novedad.area.nombre}
            </div>

            {/* Botón Borrar reubicado */}
            {!isDeleted && isSupervisor && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(novedad.id);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border-2 border-red-100 bg-white"
              >
                <FaTrash size={14} /> BORRAR
              </button>
            )}
          </div>
        </div>

        {/* --- COLUMNA DERECHA: Contenido --- */}
        <div
          className={`flex-grow flex flex-col min-w-0 ${
            isDeleted ? "bg-slate-50" : pConfig.lightBg
          }`}
        >
          <div className="py-6 px-6 lg:px-20 flex-grow bg-transparent">
            <p
              className={`text-base whitespace-pre-wrap leading-relaxed font-mono ${
                isDeleted
                  ? "text-slate-400 italic"
                  : "text-gray-800 font-medium"
              }`}
            >
              {novedad.contenido}
            </p>
          </div>
        </div>
      </div>

      {/* 3. FOOTER UNIFICADO */}
      <div
        className={`px-6 md:px-8 py-4 border-t flex flex-wrap items-center justify-between gap-4 ${isDeleted ? "bg-slate-100/50 border-slate-200" : "bg-white/60 border-gray-200"}`}
      >
        {/* Lado izquierdo del footer: Tags */}
        <div className="flex flex-wrap gap-2">
          {novedad.etiquetas?.length ? (
            novedad.etiquetas.map((tag, i) => (
              <span
                key={i}
                className={`text-xs border px-3 py-1 rounded-full font-bold shadow-sm ${
                  isDeleted
                    ? "bg-slate-200 border-slate-300 text-slate-500"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic font-medium">
              Sin etiquetas
            </span>
          )}
        </div>

        {/* Lado derecho del footer: Fecha unificada */}
        <div
          className={`text-base font-bold flex items-center gap-1.5 ${isDeleted ? "text-slate-500" : "text-gray-600"}`}
        >
          <FaCalendarAlt className="text-base opacity-70" />{" "}
          {formatearFecha(novedad.fecha)}
        </div>
      </div>

      {/* 4. PANEL DE AUDITORÍA (Opcional, ancho completo en la base) */}
      {isDeleted && novedad.audit_delete && (
        <div className="px-6 md:px-8 py-5 bg-slate-200/50 border-t-2 border-slate-300 text-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <FaInfoCircle className="mt-1 text-slate-400 text-lg" />
              <div>
                <p className="text-slate-600">
                  <span className="font-bold text-slate-900 uppercase text-xs tracking-tighter">
                    Baja por:
                  </span>{" "}
                  {novedad.audit_delete.usuario?.username}
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="italic font-bold text-slate-700">
                    "{novedad.audit_delete.motivo}"
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 font-black mt-1 uppercase">
                  Eliminado el {formatearFecha(novedad.audit_delete.fecha)}
                </p>
              </div>
            </div>
            {onRestore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(novedad.id);
                }}
                className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2"
              >
                <FaTrashRestore /> RESTAURAR REGISTRO
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
