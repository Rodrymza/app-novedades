import { useState, useEffect } from "react";
import { FaPlus, FaMapMarkedAlt } from "react-icons/fa";
import type { AreaResponse, CreateArea } from "../types/area.interface";
import { useAreas } from "../hooks/useAreas";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/layout/ConfirmModal";
import { AreaModal } from "../components/admin/areaModal";
// IMPORTAMOS LOS NUEVOS COMPONENTES
import { AreaRow } from "../components/admin/AreaRow";
import { AreaCard } from "../components/admin/AreaCard";

type ActionType = "delete" | "restore" | null;

const AdminAreasPage = () => {
  const [verEliminadas, setVerEliminadas] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idSelected, setIdSelected] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);

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

  useEffect(() => {
    traerAreas(verEliminadas);
  }, [verEliminadas]);

  // --- HANDLERS MODAL ÁREA ---
  const handleOpenCreate = () => {
    setSelectedArea(null);
    setShowAreaModal(true);
  };

  const handleOpenEdit = (area: AreaResponse) => {
    setSelectedArea(area);
    setShowAreaModal(true);
  };

  const handleAreaModalConfirm = async (data: CreateArea) => {
    try {
      if (selectedArea) {
        await actualizarArea(selectedArea.id, data);
        toast.success("Área actualizada correctamente");
      } else {
        await crearArea(data);
        toast.success("Área creada correctamente");
      }
      setShowAreaModal(false);
      traerAreas(verEliminadas);
    } catch (err) {
      console.error(err);
    }
  };

  // --- HANDLERS CONFIRM ---
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

  if (loading && areas.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Cargando áreas...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-100 text-red-700 rounded">Error: {error}</div>
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

          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm font-medium"
          >
            <FaPlus /> Nueva Área
          </button>
        </div>
      </div>

      {/* --- VISTA DESKTOP (TABLA) --- */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
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
              {areas.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No hay áreas para mostrar.
                    {!verEliminadas && (
                      <p className="text-xs text-gray-400 mt-1">
                        Prueba activando "Ver Eliminadas".
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <AreaRow
                    key={area.id}
                    area={area}
                    onEdit={handleOpenEdit}
                    onDelete={(id) => openConfirmModal(id, "delete")}
                    onRestore={(id) => openConfirmModal(id, "restore")}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- VISTA MÓVIL (TARJETAS) --- */}
      <div className="md:hidden flex flex-col gap-4">
        {areas.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No hay áreas para mostrar.
          </div>
        ) : (
          areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onEdit={handleOpenEdit}
              onDelete={(id) => openConfirmModal(id, "delete")}
              onRestore={(id) => openConfirmModal(id, "restore")}
            />
          ))
        )}
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
