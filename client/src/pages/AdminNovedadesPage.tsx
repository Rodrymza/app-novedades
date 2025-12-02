import { useEffect, useState } from "react";
import { FaSearch, FaList, FaCheckCircle, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import type { FiltroNovedad } from "../types/novedad.interface";
import { useNovedades } from "../hooks/useNovedades";
import { NovedadCard } from "../components/novedad/NovedadCard";
import { TextInputModal } from "../components/layout/TextInputModal";

// Definimos los tipos de pestañas disponibles
type TabType = "TODAS" | "ACTIVAS" | "ELIMINADAS";

const AdminNovedadesPage = () => {
  const { novedades, loading, filtrarNovedades, eliminarNovedad } =
    useNovedades();

  const [currentTab, setCurrentTab] = useState<TabType>("TODAS");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteInputModal, setDeleteInputModal] = useState<boolean>(false);
  const [selectedIdToDelete, setselectedIdToDelete] = useState<string>("");
  console.log(selectedIdToDelete);

  useEffect(() => {
    let filtro: FiltroNovedad = {};

    // Mapeamos la Pestaña -> Filtro Backend
    switch (currentTab) {
      case "ACTIVAS":
        filtro = { is_deleted: false };
        break;
      case "ELIMINADAS":
        filtro = { is_deleted: true };
        break;
      case "TODAS":
        filtro = {};
        break;
    }

    filtrarNovedades(filtro);
  }, [currentTab, filtrarNovedades]);

  // --- Filtrado Local por Texto (Opcional, para búsqueda rápida) ---
  const filteredList = novedades.filter(
    (n) =>
      n.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejador de Restauración (Conectado a tu lógica futura)
  const handleRestore = async (id: string) => {
    if (!confirm("¿Deseas restaurar esta novedad?")) return;
    try {
      // await restaurarNovedad(id);
      toast.success(`Novedad ${id} restaurada`);
      // Forzamos recarga simulando cambio de tab o llamando al effect
      const filtro = currentTab === "TODAS" ? {} : { is_deleted: true };
      await filtrarNovedades(filtro);
    } catch (err) {
      toast.error("Error al restaurar");
    }
  };

  const handleDelete = async (id: string) => {
    setselectedIdToDelete(id);
    setDeleteInputModal(true);
  };

  const handleDeleteConfirm = async (textoMotivo: string) => {
    await eliminarNovedad(selectedIdToDelete, textoMotivo);
    const filtro = currentTab === "TODAS" ? {} : { is_deleted: true };
    await filtrarNovedades(filtro);
    setDeleteInputModal(false);
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

          {/* --- SISTEMA DE PESTAÑAS (TABS) --- */}
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
                    // Si está borrada, le pasamos la función. Si no, undefined.
                    onRestore={nov.is_deleted ? handleRestore : undefined}
                    onDelete={nov.is_deleted ? undefined : handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TextInputModal
        title="Eliminar Novedad"
        message="Ingrese motivo para borrar la novedad"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setselectedIdToDelete("");
          setDeleteInputModal(false);
        }}
        placeholder="Ej. Error de tipado"
        open={deleteInputModal}
      />
    </>
  );
};

// Componente pequeño para el botón del Tab
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
