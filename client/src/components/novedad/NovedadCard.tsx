import type { NovedadResponse } from "../../types/novedad.interface";

interface Props {
  novedad: NovedadResponse;
}

export const NovedadCard = ({ novedad }: Props) => {
  // Helper para formatear la fecha (Ej: 23 Nov, 14:30hs)
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(fecha);
  };

  // Helper para obtener iniciales (Ej: Juan Perez -> JP)
  const getIniciales = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 hover:shadow-md cursor-default transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* --- ENCABEZADO --- */}
      <div className="p-4 flex justify-between items-start bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar con iniciales */}
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {getIniciales(novedad.usuario.nombre, novedad.usuario.apellido)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              {novedad.usuario.apellido}, {novedad.usuario.nombre}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              @{novedad.usuario.username}
            </p>
          </div>
        </div>

        {/* Badge del Área */}
        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium border border-indigo-200">
          {novedad.area.nombre}
        </span>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="p-4 flex-grow">
        <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
          {novedad.contenido}
        </p>
      </div>

      {/* --- PIE (Tags y Fecha) --- */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        {/* Lista de Etiquetas */}
        <div className="flex flex-wrap gap-2">
          {novedad.etiquetas && novedad.etiquetas.length > 0 ? (
            novedad.etiquetas.map((tag: string, index: number) => (
              <span
                key={index}
                className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-400 italic">
              Sin etiquetas
            </span>
          )}
        </div>

        {/* Fecha alineada a la derecha */}
        <div className="text-xs p-1 text-white bg-indigo-400 rounded-md flex items-center gap-1 font-bold">
          {/* Si tienes react-icons: <FaCalendarAlt /> */}
          {formatearFecha(novedad.fecha)}
        </div>
      </div>
    </div>
  );
};
