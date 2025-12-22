import React, { useState, useEffect } from "react";
import { AreaService } from "../../services/area.service";
import type { UserList } from "../../types/user.interfaces";
import { FaSearch, FaTimes } from "react-icons/fa";
import type { FiltroNovedad } from "../../types/novedad.interface";
import { UserService } from "../../services/user.service";

interface AreaOption {
  id: string;
  nombre: string;
}

interface Props {
  // Función que el padre (Dashboard) nos pasa para ejecutar la búsqueda
  onFilterSubmit: (filters: FiltroNovedad) => void;
  // Función para resetear la búsqueda
  onFilterReset: () => void;
  // Opcional: estado para deshabilitar el botón de búsqueda
  loading: boolean;
}

const initialFilterState = {
  usuario_id: "",
  area_id: "",
  tags: "",
  fechaInicio: "",
  fechaFin: "",
  textoBusqueda: "",
};

export const NovedadFilters = ({
  onFilterSubmit,
  onFilterReset,
  loading,
}: Props) => {
  const [filters, setFilters] = useState(initialFilterState);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [authors, setAuthors] = useState<UserList[]>([]);

  // --- EFECTO para cargar opciones de dropdowns (omitted for brevity) ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [areasData, usersData] = await Promise.all([
          AreaService.getAllAreas(false),
          UserService.getUserList(),
        ]);

        setAreas(areasData.map((a) => ({ id: a.id, nombre: a.nombre })));
        setAuthors(usersData);
      } catch (error) {
        console.error("Error al cargar opciones de filtro:", error);
      } finally {
      }
    };
    fetchOptions();
  }, []);

  // Manejador de cambios de input/select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Función que construye el objeto final para el backend
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = filters.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const filtersToSend: FiltroNovedad = {
      usuario_id: filters.usuario_id || undefined,
      area_id: filters.area_id || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      fechaInicio: filters.fechaInicio || undefined,
      fechaFin: filters.fechaFin || undefined,
      textoBusqueda: filters.textoBusqueda || undefined,
    };

    onFilterSubmit(filtersToSend);
  };

  // Función para limpiar todos los filtros y recargar la lista
  const handleReset = () => {
    setFilters(initialFilterState);
    onFilterReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">
        Filtros de Búsqueda
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-end gap-3">
          {/* Campo Texto */}
          <div className="flex flex-col w-60">
            <label className="text-xs text-gray-500">Texto</label>
            <input
              type="text"
              name="textoBusqueda"
              value={filters.textoBusqueda}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1"
            />
          </div>

          {/* Campo Área */}
          <div className="flex flex-col w-40">
            <label className="text-xs text-gray-500">Área</label>
            <select
              name="area_id"
              value={filters.area_id}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1 bg-white"
            >
              <option value="">Todas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Autor */}
          <div className="flex flex-col w-40">
            <label className="text-xs text-gray-500">Autor</label>
            <select
              name="usuario_id"
              value={filters.usuario_id}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1 bg-white"
            >
              <option value="">Todos</option>
              {authors.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.apellido}, {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Desde */}
          <div className="flex flex-col w-40">
            <label className="text-xs text-gray-500">Desde</label>
            <input
              type="date"
              name="fechaInicio"
              value={filters.fechaInicio}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1"
            />
          </div>

          {/* Campo Hasta */}
          <div className="flex flex-col w-40">
            <label className="text-xs text-gray-500">Hasta</label>
            <input
              type="date"
              name="fechaFin"
              value={filters.fechaFin}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1"
            />
          </div>

          <div className="flex flex-col w-60">
            <label className="text-xs text-gray-500">Etiquetas</label>
            <input
              type="text"
              name="tags"
              value={filters.tags}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1"
            />
          </div>

          {/*Botones de accion*/}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              title="Aplicar filtros"
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-1 disabled:opacity-50 h-8"
            >
              <FaSearch className="w-4 h-4" />
              Buscar
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              title="Limpiar y ver todo"
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-1 h-8"
            >
              <FaTimes className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
