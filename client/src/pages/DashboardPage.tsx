import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaPlus, FaTimes } from "react-icons/fa"; // Importamos iconos
import { NovedadCard } from "../components/novedad/NovedadCard";
import { useNovedades } from "../hooks/useNovedades";
import { NovedadFilters } from "../components/novedad/NovedadFilters";
import type { FiltroNovedad } from "../types/novedad.interface";

const DashboardPage = () => {
  const { novedades, loading, error, traerNovedades, filtrarNovedades } =
    useNovedades();

  // Estado para controlar la visibilidad de los filtros EN MÓVIL
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterSubmit = (filtrosRecibidos: FiltroNovedad) => {
    filtrarNovedades(filtrosRecibidos);
    // Opcional: Cerrar los filtros en móvil automáticamente al buscar
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    traerNovedades();
    setShowFilters(false);
  };

  useEffect(() => {
    traerNovedades();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* --- ENCABEZADO Y ACCIONES --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Títulos */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Novedades Recientes
            </h1>
            <p className="text-gray-500 text-sm">Últimos reportes del equipo</p>
          </div>

          {/* Botonera de Acciones (Nueva + Filtro Móvil) */}
          <div className="flex gap-3 w-full md:w-auto">
            {/* BOTÓN TOGGLE FILTROS (Solo visible en móvil 'md:hidden') */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors font-medium ${
                showFilters
                  ? "bg-gray-200 text-gray-800 border-gray-300" // Estilo activo
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50" // Estilo inactivo
              }`}
            >
              {showFilters ? <FaTimes /> : <FaFilter />}
              {showFilters ? "Ocultar" : "Filtrar"}
            </button>

            {/* BOTÓN NUEVA NOVEDAD */}
            <Link
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium flex items-center justify-center gap-2"
              to="/crear-novedad"
            >
              <FaPlus /> <span className="hidden sm:inline">Nueva Novedad</span>
              <span className="sm:hidden">Nueva</span>
            </Link>
          </div>
        </div>

        {/* --- SECCIÓN DE FILTROS --- */}
        {/* Lógica de Clases:
            1. 'hidden': Oculto por defecto (mobile first).
            2. 'md:block': En pantallas medianas siempre visible (bloque).
            3. Si showFilters es true, forzamos 'block' en móvil.
        */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showFilters ? "block" : "hidden"
          } md:block`}
        >
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <NovedadFilters
              onFilterSubmit={handleFilterSubmit}
              onFilterReset={handleFilterReset}
              loading={loading}
            />
          </div>
        </div>

        {/* --- ESTADOS DE CARGA / ERROR / VACÍO --- */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && novedades.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">
              No hay novedades registradas aún.
            </p>
          </div>
        )}

        {/* --- LISTA DE NOVEDADES --- */}
        {!loading && novedades.length > 0 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            {novedades.map((novedad) => (
              <NovedadCard key={novedad.id} novedad={novedad} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
