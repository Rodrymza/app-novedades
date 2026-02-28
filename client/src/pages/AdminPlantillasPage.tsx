import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlantillas } from "../hooks/usePlantillas";
import { ConfirmModal } from "../components/layout/ConfirmModal";

export const AdminPlantillasPage = () => {
  const navigate = useNavigate();
  const {
    plantillas,
    loadingPlantillas,
    traerPlantillas,
    eliminarPlantilla,
    restaurarPlantilla,
  } = usePlantillas();

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Estado para el modal de confirmación
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "eliminar" | "restaurar" | null;
    templateId: string | null;
    templateName: string;
  }>({
    isOpen: false,
    type: null,
    templateId: null,
    templateName: "",
  });

  // Cargar plantillas al montar
  useEffect(() => {
    traerPlantillas(true);
  }, [traerPlantillas]);

  // Filtrado en tiempo real (Optimizado con useMemo)
  const plantillasFiltradas = useMemo(() => {
    if (!plantillas) return [];

    return plantillas.filter((plantilla) => {
      const termino = searchTerm.toLowerCase();
      // 1. Busca en título o contenido
      const coincideTexto =
        plantilla.nombre.toLowerCase().includes(termino) ||
        (plantilla.contenido &&
          plantilla.contenido.toLowerCase().includes(termino));

      // 2. Busca en tags (si el usuario escribió algo en el input de tags)
      const busquedaTag = tagSearch.toLowerCase().trim();
      const coincideTags =
        busquedaTag === "" ||
        (plantilla.tags &&
          plantilla.tags.some((tag) =>
            tag.toLowerCase().includes(busquedaTag),
          ));

      return coincideTexto && coincideTags;
    });
  }, [plantillas, searchTerm, tagSearch]);

  // Manejadores del Modal
  const abrirModal = (
    id: string,
    nombre: string,
    tipo: "eliminar" | "restaurar",
  ) => {
    setModalConfig({
      isOpen: true,
      type: tipo,
      templateId: id,
      templateName: nombre,
    });
  };

  const confirmarAccion = async () => {
    if (!modalConfig.templateId) return;

    if (modalConfig.type === "eliminar") {
      await eliminarPlantilla(modalConfig.templateId);
    } else if (modalConfig.type === "restaurar") {
      await restaurarPlantilla(modalConfig.templateId);
    }

    setModalConfig({
      isOpen: false,
      type: null,
      templateId: null,
      templateName: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Plantillas
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los formatos rápidos para las novedades.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/plantillas/nueva")} // Ruta sugerida para crear
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-medium"
        >
          + Nueva Plantilla
        </button>
      </div>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar en título o contenido
          </label>
          <input
            type="text"
            placeholder="Ej: guardia, falla, paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Etiqueta (Tag)
          </label>
          <input
            type="text"
            placeholder="Ej: urgente, inventario..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* --- LISTA DE PLANTILLAS --- */}
      {loadingPlantillas ? (
        <div className="text-center py-10 text-gray-500">
          Cargando plantillas...
        </div>
      ) : plantillasFiltradas.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
          No se encontraron plantillas con esos criterios.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plantillasFiltradas.map((plantilla) => (
            <div
              key={plantilla.id}
              className={`rounded-xl shadow-sm border p-5 min-h-[400px] flex flex-col transition hover:shadow-md ${
                plantilla.is_deleted
                  ? "bg-red-50 border-red-200 opacity-90" // Estilo para borradas (rojo leve)
                  : "bg-white border-gray-200" // Estilo normal
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                  {plantilla.nombre}
                </h3>
                {plantilla.is_deleted && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                    Eliminada
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 flex-1 whitespace-pre-line line-clamp-4 mb-4 font-mono bg-gray-50 p-2 rounded border">
                {plantilla.contenido}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {plantilla.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2 pt-4 border-t mt-auto">
                <button
                  onClick={() =>
                    navigate(`/admin/plantillas/editar/${plantilla.id}`)
                  }
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition"
                  disabled={plantilla.is_deleted} // Opcional: Evitar editar si está eliminada
                >
                  Modificar
                </button>

                {plantilla.is_deleted ? (
                  <button
                    onClick={() =>
                      abrirModal(plantilla.id, plantilla.nombre, "restaurar")
                    }
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-sm font-medium transition"
                  >
                    Restaurar
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      abrirModal(plantilla.id, plantilla.nombre, "eliminar")
                    }
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm font-medium transition"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN --- */}
      <ConfirmModal
        open={modalConfig.isOpen}
        title={
          modalConfig.type === "eliminar"
            ? "Eliminar Plantilla"
            : "Restaurar Plantilla"
        }
        message={
          modalConfig.type === "eliminar"
            ? `¿Estás seguro que deseas eliminar la plantilla "${modalConfig.templateName}"? Ya no aparecerá como opción para los técnicos.`
            : `¿Deseas restaurar la plantilla "${modalConfig.templateName}" para que vuelva a estar disponible?`
        }
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmarAccion}
      />
    </div>
  );
};
