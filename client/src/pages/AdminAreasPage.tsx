import { useState, useEffect } from "react";
import {
  FaPlus,
  FaMapMarkedAlt,
  FaTrashAlt,
  FaUndo,
  FaEdit,
} from "react-icons/fa";
import type { AreaResponse, CreateArea } from "../types/area.interface"; // Asegúrate de importar Area
import { useAreas } from "../hooks/useAreas";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/layout/ConfirmModal";
import { AreaModal } from "../components/admin/areaModal";

type ActionType = "delete" | "restore" | null;

const AdminAreasPage = () => {
  const [verEliminadas, setVerEliminadas] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idSelected, setIdSelected] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);

  // --- HOOK ---
  const {
    areas,
    loading,
    error,
    traerAreas,
    crearArea,
    actualizarArea,
    eliminarArea,
    restaurarArea,
  } = useAreas();

  // --- EFFECT ---
  useEffect(() => {
    traerAreas(verEliminadas);
  }, [verEliminadas]);

  // --- HANDLERS MODAL ÁREA (CREAR / EDITAR) ---

  const handleOpenCreate = () => {
    setSelectedArea(null); // Null indica creación
    setShowAreaModal(true);
  };

  const handleOpenEdit = (area: AreaResponse) => {
    setSelectedArea(area); // Objeto indica edición
    setShowAreaModal(true);
  };

  const handleAreaModalConfirm = async (data: CreateArea) => {
    try {
      if (selectedArea) {
        // Modo EDICIÓN
        await actualizarArea(selectedArea.id, data);
        toast.success("Área actualizada correctamente");
      } else {
        // Modo CREACIÓN
        await crearArea(data);
        toast.success("Área creada correctamente");
      }

      setShowAreaModal(false);
      traerAreas(verEliminadas); // Recargamos lista
    } catch (err) {
      console.error(err);
      // El toast de error ya suele manejarse en el hook o servicio
    }
  };

  // --- HANDLERS MODAL CONFIRMACIÓN (BORRAR / RESTAURAR) ---

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
        toast.success("Área eliminada");
      } else {
        await restaurarArea(idSelected);
        toast.success("Área restaurada");
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

  // --- RENDER ---

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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaMapMarkedAlt className="text-blue-600" /> Gestión de Áreas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los sectores físicos de la institución.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Ver Eliminadas */}
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
                  verEliminadas ? "bg-gray-600" : "bg-gray-300"
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

          {/* Botón Crear */}
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm font-medium"
          >
            <FaPlus /> Nueva Área
          </button>
        </div>
      </div>

      {/* TABLA FULL WIDTH */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
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
                    <div className="flex justify-end gap-2">
                      {/* Botón EDITAR (Solo si no está eliminada) */}
                      {!area.is_deleted && (
                        <button
                          onClick={() => handleOpenEdit(area)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition"
                          title="Editar"
                        >
                          <FaEdit size={18} />
                        </button>
                      )}

                      {/* Botón ELIMINAR / RESTAURAR */}
                      {area.is_deleted ? (
                        <button
                          onClick={() => openConfirmModal(area.id, "restore")}
                          className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition"
                          title="Restaurar"
                        >
                          <FaUndo size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirmModal(area.id, "delete")}
                          className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition"
                          title="Eliminar"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      )}
                    </div>
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

      {/* --- MODALES --- */}

      <AreaModal
        open={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onConfirm={handleAreaModalConfirm}
        area={selectedArea}
        loading={loading}
      />

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title={actionType === "delete" ? "Eliminar Área" : "Restaurar Área"}
        message={
          actionType === "delete"
            ? `¿Estás seguro que deseas eliminar el área seleccionada?`
            : `¿Deseas restaurar esta área?`
        }
      />
    </>
  );
};

export default AdminAreasPage;
