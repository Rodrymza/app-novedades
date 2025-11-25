import React, { useState, useEffect } from "react";
import { FaPlus, FaMapMarkedAlt, FaTrashAlt } from "react-icons/fa";
import type { CreateArea } from "../types/area.interface";
import { useAreas } from "../hooks/useAreas";

// Estado inicial del formulario de creación
const initialFormState: CreateArea = {
  nombre: "",
  descripcion: "",
};

const AdminAreasPage = () => {
  // --- ESTADOS Y HOOKS ---
  const [formData, setFormData] = useState<CreateArea>(initialFormState);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { areas, loading, error, traerAreas, crearArea } = useAreas();

  // 1. Cargar las áreas al montar el componente (useEffect)
  useEffect(() => {
    traerAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El hook trae las áreas solo al principio

  // Manejador de cambios de input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setSuccessMsg(null); // Limpiar éxito al escribir
  };

  // Manejador del Formulario de Creación
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return;

    try {
      // Llamada al hook: el hook maneja la llamada a la API y el refresh de la lista
      await crearArea(formData);
      setSuccessMsg(`Área "${formData.nombre}" creada con éxito.`);
      setFormData(initialFormState); // Limpiar formulario
    } catch (err) {
      // El hook ya maneja el error de Axios (lo guarda en el estado 'error')
      console.error("Error en submit:", err);
    }
  };

  // Opcional: Función para borrar (Necesitas implementarla en el servicio y hook)
  const handleDelete = (id: string) => {
    if (window.confirm("¿Seguro que quieres borrar esta área?")) {
      // Lógica para borrar (PENDIENTE: crear función en useAreas)
      console.log(`Borrando área: ${id}`);
    }
  };

  // --- Renderizado Condicional de Carga y Error ---
  if (loading && areas.length === 0) {
    return (
      <div className="p-8 text-center text-lg">
        Cargando áreas existentes...
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 bg-red-100 text-red-700 rounded">Error: {error}</div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Gestión de Áreas
      </h1>

      {/* --- LAYOUT PRINCIPAL: Formulario (1/3) y Tabla (2/3) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA 1: FORMULARIO DE CREACIÓN --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <FaPlus /> Crear Nueva Área
            </h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                {successMsg}
              </div>
            )}
            {/* Si el hook tiene un error (ej: ya existe), lo mostramos */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                Error: {error}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Área *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500"
                  placeholder="Ej: Quirófano, Logística"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 min-h-[80px]"
                  placeholder="Detalles sobre las funciones del área"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.nombre}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? "Guardando..." : "Guardar Área"}
              </button>
            </form>
          </div>
        </div>

        {/* --- COLUMNA 2: TABLA DE ÁREAS EXISTENTES --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaMapMarkedAlt /> Áreas Existentes ({areas.length})
            </h2>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {areas.map((area) => (
                  <tr key={area.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {area.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {area.descripcion || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(area.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrashAlt className="w-4 h-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {areas.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-10">
                No hay áreas de gestión creadas.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAreasPage;
