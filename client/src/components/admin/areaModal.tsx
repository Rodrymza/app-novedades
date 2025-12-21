import { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaTimes, FaSave } from "react-icons/fa";
import type { AreaResponse, CreateArea } from "../../types/area.interface";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: CreateArea) => void;
  area: AreaResponse | null;
  loading?: boolean;
}

export const AreaModal = ({
  open,
  onClose,
  onConfirm,
  area,
  loading,
}: Props) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Cada vez que el modal se abre o el área seleccionada cambia, actualizamos los campos
  useEffect(() => {
    if (area) {
      setNombre(area.nombre);
      setDescripcion(area.descripcion || "");
    } else {
      // Limpiar campos si es una creación nueva
      setNombre("");
      setDescripcion("");
    }
  }, [area, open]);

  // Si el modal está cerrado, no renderizamos nada
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ nombre, descripcion });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header - Cambia de color según la acción para dar feedback visual */}
        <div
          className={`px-6 py-4 flex justify-between items-center text-white ${
            area ? "bg-indigo-600" : "bg-blue-600"
          }`}
        >
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaMapMarkedAlt />
            {area ? "Editar Área" : "Crear Nueva Área"}
          </h3>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre del Área
            </label>
            <input
              autoFocus
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Rayos X, Administración..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles sobre la ubicación o función..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-28 resize-none"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !nombre.trim()}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                area
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSave />
                  {area ? "Guardar Cambios" : "Crear Área"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
