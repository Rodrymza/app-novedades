import { useEffect, useState } from "react";
import {
  FaSearch,
  FaList,
  FaCheckCircle,
  FaTrash,
  FaFilter,
  FaTimes,
} from "react-icons/fa"; // Agregamos FaFilter y FaTimes
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

  // --- NUEVO ESTADO: Visibilidad de filtros en móvil ---
  const [showFilters, setShowFilters] = useState(false);

  // Modales y Selección
  const [deleteInputModal, setDeleteInputModal] = useState<boolean>(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
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

  // --- HANDLERS ACCIONES ---
  const handleRestoreClick = (id: string) => {
    setNovedadSelected(id);
    setShowConfirmRestore(true);
  };

  const handleRestoreConfirm = async () => {
    if (!novedadSelected) return;
    await restaurarNovedad(novedadSelected);
    const filtro = obtenerFiltroPorTab(currentTab);
    await filtrarNovedades(filtro);
    setShowConfirmRestore(false);
    setNovedadSelected("");
  };

  const handleDeleteClick = (id: string) => {
    setNovedadSelected(id);
    setDeleteInputModal(true);
  };

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
    setShowFilters(false); // Cerramos el filtro al aplicar (UX)
  };

  const handleFilterReset = () => {
    filtrarNovedades({});
    setShowFilters(false);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* --- HEADER SUPERIOR --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaList className="text-blue-600" /> Gestión de Novedades
              </h1>
              <p className="text-sm text-gray-500">
                Auditoría y control histórico.
              </p>
            </div>

            {/* Agrupamos Buscador y Botón de Filtro para que se vean bien en móvil */}
            <div className="flex w-full md:w-auto gap-2">
              {/* BOTÓN TOGGLE FILTROS (Solo visible en móvil 'md:hidden') */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`md:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors font-medium whitespace-nowrap ${
                  showFilters
                    ? "bg-gray-200 text-gray-800 border-gray-300"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {showFilters ? <FaTimes /> : <FaFilter />}
                {showFilters ? "Ocultar" : "Filtrar"}
              </button>

              {/* BUSCADOR */}
              <div className="relative flex-1 md:flex-none">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --- AREA DE FILTROS AVANZADOS (Plegable) --- */}
          {/* Logica: Oculto en móvil (hidden) salvo que showFilters sea true. Siempre visible en desktop (md:block) */}
          <div
            className={`w-full sm:w-auto mb-4 transition-all duration-300 ${
              showFilters ? "block" : "hidden"
            } md:block`}
          >
            {/* Opcional: Agregar un fondo gris en móvil para destacar que es un área de herramientas */}
            <div className="md:bg-transparent bg-white md:p-0 p-4 rounded-xl md:shadow-none shadow-sm border md:border-none border-gray-100">
              <NovedadFilters
                onFilterSubmit={handleFilterSubmit}
                onFilterReset={handleFilterReset}
                loading={loading}
              />
            </div>
          </div>

          {/* --- TABS --- */}
          <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 mb-4 w-fit shadow-sm overflow-x-auto max-w-full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 p-4">
                {filteredList.map((nov) => (
                  <NovedadCard
                    key={nov.id}
                    novedad={nov}
                    onRestore={nov.is_deleted ? handleRestoreClick : undefined}
                    onDelete={nov.is_deleted ? undefined : handleDeleteClick}
                  />
                ))}

                {filteredList.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    No se encontraron novedades con los filtros actuales.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}
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
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
