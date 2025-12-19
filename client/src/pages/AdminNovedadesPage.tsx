import { useEffect, useState } from "react";
import { FaSearch, FaList, FaCheckCircle, FaTrash } from "react-icons/fa";
import type { FiltroNovedad } from "../types/novedad.interface";
import { useNovedades } from "../hooks/useNovedades";
import { NovedadCard } from "../components/novedad/NovedadCard";
import { TextInputModal } from "../components/layout/TextInputModal";
import { NovedadFilters } from "../components/novedad/NovedadFilters";
import { ConfirmModal } from "../components/layout/ConfirmModal";

// Definimos los tipos de pestañas disponibles
type TabType = "TODAS" | "ACTIVAS" | "ELIMINADAS";

const AdminNovedadesPage = () => {
  const {
    novedades,
    loading,
    filtrarNovedades,
    eliminarNovedad,
    restaurarNovedad,
  } = useNovedades();

  const [currentTab, setCurrentTab] = useState<TabType>("TODAS");
  const [searchTerm, setSearchTerm] = useState("");

  // Modales y Selección
  const [deleteInputModal, setDeleteInputModal] = useState<boolean>(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false); // Modal de restauración
  const [novedadSelected, setNovedadSelected] = useState<string>("");

  // --- LÓGICA DE FILTROS ---
  const obtenerFiltroPorTab = (tab: TabType): FiltroNovedad => {
    switch (tab) {
      case "ACTIVAS":
        return { is_deleted: false };
      case "ELIMINADAS":
        return { is_deleted: true };
      case "TODAS":
      default:
        return {};
    }
  };

  useEffect(() => {
    const filtro = obtenerFiltroPorTab(currentTab);
    filtrarNovedades(filtro);
  }, [currentTab, filtrarNovedades]);

  const filteredList = novedades.filter(
    (n) =>
      n.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLERS PARA RESTAURAR (ConfirmModal) ---

  // 1. Al hacer click en el botón "Restaurar" de la tarjeta
  const handleRestoreClick = (id: string) => {
    setNovedadSelected(id); // Guardamos ID
    setShowConfirmRestore(true); // Abrimos modal
  };

  // 2. Al confirmar en el Modal
  const handleRestoreConfirm = async () => {
    if (!novedadSelected) return;

    await restaurarNovedad(novedadSelected);

    // Recargamos lista
    const filtro = obtenerFiltroPorTab(currentTab);
    await filtrarNovedades(filtro);

    setShowConfirmRestore(false); // Cerramos modal
    setNovedadSelected(""); // Limpiamos selección
  };

  // --- HANDLERS PARA ELIMINAR (TextInputModal) ---

  // 1. Al hacer click en el botón "Eliminar" de la tarjeta
  const handleDeleteClick = (id: string) => {
    setNovedadSelected(id);
    setDeleteInputModal(true);
  };

  // 2. Al confirmar con texto
  const handleDeleteConfirm = async (textoMotivo: string) => {
    await eliminarNovedad(novedadSelected, textoMotivo);
    const filtro = obtenerFiltroPorTab(currentTab);
    await filtrarNovedades(filtro);
    setDeleteInputModal(false);
    setNovedadSelected("");
  };

  // --- FILTROS UI ---
  const handleFilterSubmit = (filtrosRecibidos: FiltroNovedad) => {
    filtrarNovedades(filtrosRecibidos);
  };

  const handleFilterReset = () => {
    filtrarNovedades({});
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header y Buscador */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaList className="text-blue-600" /> Gestión de Novedades
              </h1>
              <p className="text-sm text-gray-500">
                Auditoría y control histórico.
              </p>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar en lista..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full sm:w-auto mb-4">
            <NovedadFilters
              onFilterSubmit={handleFilterSubmit}
              onFilterReset={handleFilterReset}
              loading={loading}
            />
          </div>

          {/* --- TABS --- */}
          <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 mb-4 w-fit shadow-sm">
            <TabButton
              active={currentTab === "TODAS"}
              onClick={() => setCurrentTab("TODAS")}
              icon={<FaList />}
              label="Todas"
            />
            <TabButton
              active={currentTab === "ACTIVAS"}
              onClick={() => setCurrentTab("ACTIVAS")}
              icon={<FaCheckCircle className="text-green-500" />}
              label="Activas"
            />
            <TabButton
              active={currentTab === "ELIMINADAS"}
              onClick={() => setCurrentTab("ELIMINADAS")}
              icon={<FaTrash className="text-red-500" />}
              label="Eliminadas"
            />
          </div>

          {/* Tabla de Resultados */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Cargando registros...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredList.map((nov) => (
                  <NovedadCard
                    key={nov.id}
                    novedad={nov}
                    // IMPORTANTE: Pasamos los handlers de Click, no los de Confirm
                    onRestore={nov.is_deleted ? handleRestoreClick : undefined}
                    onDelete={nov.is_deleted ? undefined : handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA ELIMINAR (Con Input) */}
      <TextInputModal
        title="Eliminar Novedad"
        message="Ingrese motivo para borrar la novedad"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setNovedadSelected("");
          setDeleteInputModal(false);
        }}
        placeholder="Ej. Error de tipado"
        open={deleteInputModal}
      />

      {/* MODAL PARA RESTAURAR (Simple) */}
      <ConfirmModal
        open={showConfirmRestore}
        onClose={() => {
          setShowConfirmRestore(false);
          setNovedadSelected("");
        }}
        onConfirm={handleRestoreConfirm}
        title="Restaurar Novedad"
        message="¿Deseas restaurar esta novedad? Volverá a estar visible en el listado activo inmediatamente."
      />
    </>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-100 text-blue-700 shadow-sm"
        : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AdminNovedadesPage;
