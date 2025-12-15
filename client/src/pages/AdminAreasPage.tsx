import React, { useState, useEffect } from "react";
import { FaPlus, FaMapMarkedAlt, FaTrashAlt, FaUndo } from "react-icons/fa";
import type { CreateArea } from "../types/area.interface";
import { useAreas } from "../hooks/useAreas";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/layout/ConfirmModal";

const initialFormState: CreateArea = {
  nombre: "",
  descripcion: "",
};

type ActionType = "delete" | "restore" | null;

const AdminAreasPage = () => {
  // --- ESTADOS ---
  const [formData, setFormData] = useState<CreateArea>(initialFormState);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idSelected, setIdSelected] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [verEliminadas, setVerEliminadas] = useState(false);

  // --- HOOK ---
  const {
    areas,
    loading,
    error,
    traerAreas,
    crearArea,
    eliminarArea,
    restaurarArea,
  } = useAreas();

  // --- EFFECT ---
  // Ahora depende de 'verEliminadas'. Se ejecuta al cargar y al cambiar el toggle.
  useEffect(() => {
    traerAreas(verEliminadas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verEliminadas]); // Quitamos traerAreas del array para evitar loops si no está memorizada, aunque en tu hook usaste useCallback asi que estaría bien incluirla.

  // --- HANDLERS ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return;

    try {
      await crearArea(formData);
      setFormData(initialFormState);
      traerAreas(verEliminadas);
    } catch (err) {
      console.error(err);
    }
  };

  const openConfirmModal = (id: string, action: ActionType) => {
    setIdSelected(id);
    setActionType(action);
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (!idSelected || !actionType) return;

    try {
      if (actionType === "delete") {
        await eliminarArea(idSelected);
      } else {
        await restaurarArea(idSelected);
      }
      traerAreas(verEliminadas);
    } catch (error) {
      toast.error("No se pudo completar la acción");
    } finally {
      setIdSelected(null);
      setActionType(null);
      setShowConfirm(false);
    }
  };

  // --- RENDER ESTADOS DE CARGA / ERROR ---
  if (loading && areas.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Cargando áreas...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-100 text-red-700 rounded border border-red-200">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      {/* HEADER CON TITULO Y TOGGLE */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Áreas</h1>

        <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors select-none">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={verEliminadas}
              onChange={(e) => setVerEliminadas(e.target.checked)}
            />
            <div
              className={`block w-10 h-6 rounded-full transition-colors ${
                verEliminadas ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                verEliminadas ? "transform translate-x-4" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            Ver Eliminadas
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO DE CREACIÓN */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaPlus className="text-blue-500" /> Crear Área
            </h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Rayos X"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Breve descripción del sector..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Guardar Área"}
              </button>
            </form>
          </div>
        </div>

        {/* TABLA DE ÁREAS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                <FaMapMarkedAlt className="text-blue-500" /> Listado de Áreas
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({areas.length})
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {areas.map((area) => (
                    <tr
                      key={area.id}
                      className={`transition-colors duration-150 ${
                        area.is_deleted ? "bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`font-medium ${
                              area.is_deleted
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
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
                        {area.is_deleted ? (
                          <button
                            onClick={() => openConfirmModal(area.id, "restore")}
                            className="text-green-600 hover:text-green-900 transition-colors p-2 rounded hover:bg-green-50"
                            title="Restaurar"
                          >
                            <FaUndo size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => openConfirmModal(area.id, "delete")}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {areas.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay áreas para mostrar.</p>
                  {!verEliminadas && (
                    <p className="text-xs text-gray-400 mt-1">
                      Prueba activando "Ver Eliminadas" si buscas una antigua.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title={actionType === "delete" ? "Eliminar Área" : "Restaurar Área"}
        message={
          actionType === "delete"
            ? `¿Estás seguro que deseas eliminar el área seleccionada? Dejará de estar visible para los usuarios.`
            : `¿Deseas restaurar esta área? Volverá a estar activa inmediatamente.`
        }
      />
    </>
  );
};

export default AdminAreasPage;
