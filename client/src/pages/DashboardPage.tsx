import { useEffect } from "react";
import { NovedadCard } from "../components/novedad/NovedadCard";
import { useNovedades } from "../hooks/useNovedades";
import { Link } from "react-router-dom";
import { NovedadFilters } from "../components/layout/NovedadFilters";
import type { FiltroNovedad } from "../types/novedad.interface";

const DashboardPage = () => {
  const { novedades, loading, error, traerNovedades, filtrarNovedades } =
    useNovedades();

  // funcion para filtrar
  const handleFilterSubmit = (filtrosRecibidos: FiltroNovedad) => {
    filtrarNovedades(filtrosRecibidos);
  };

  // al limpiar los filtros se traen todas las novedades de nuevo
  const handleFilterReset = () => {
    traerNovedades();
  };

  useEffect(() => {
    traerNovedades();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado del Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Novedades Recientes
            </h1>
            <p className="text-gray-500 text-sm">Últimos reportes del equipo</p>
          </div>

          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2"
            to="/crear-novedad"
          >
            <span>+</span> Nueva Novedad
          </Link>
        </div>

        <div className="w-full sm:w-auto">
          <NovedadFilters
            onFilterSubmit={handleFilterSubmit}
            onFilterReset={handleFilterReset}
            loading={loading}
          />
        </div>
        {/* Estado de Carga */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Estado de Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Estado Vacío (Solo si no carga y no hay error) */}
        {!loading && !error && novedades.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No hay novedades registradas aún.
            </p>
          </div>
        )}

        {/* Grilla de Novedades */}
        {!loading && novedades.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {novedades.map((novedad) => (
              // Asegúrate de pasar la prop correcta 'novedad={novedad}'
              <NovedadCard key={novedad.id} novedad={novedad} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
