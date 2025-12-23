import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNovedades } from "../hooks/useNovedades";
import { AreaService } from "../services/area.service";
import type { CreateNovedad } from "../types/novedad.interface";

// Definición de tipos locales para el formulario
interface Area {
  id: string;
  nombre: string;
}
interface FormState {
  contenido: string;
  area: string; // ID del área seleccionada
  etiquetasInput: string; // Input de texto simple para tags (separados por coma)
}

const initialState: FormState = {
  contenido: "",
  area: "",
  etiquetasInput: "",
};

const CreateNovedadPage = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [areas, setAreas] = useState<Area[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // Asumo que tu hook ya tiene la función para crear
  const { crearNovedad, error: hookError } = useNovedades();

  // --- EFECTO para cargar la lista de Áreas ---
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await AreaService.getAllAreas(false);
        setAreas(data);
        // Establecer un valor por defecto para el dropdown si existe
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, area: data[0].id }));
        }
      } catch (err) {
        setLocalError("No se pudieron cargar las áreas de gestión.");
      }
    };
    fetchAreas();
  }, []);

  // Manejador genérico de inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    // 1. Validación local (contenido y área son obligatorios)
    if (!formData.contenido || !formData.area) {
      setLocalError("El contenido de la novedad y el área son obligatorios.");
      return;
    }

    try {
      // 2. Preparamos el objeto para la API
      const etiquetasArray = formData.etiquetasInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const dataToSend: CreateNovedad = {
        contenido: formData.contenido,
        area_id: formData.area,
        etiquetas: etiquetasArray,
      };

      // 3. Llamada al Hook/Backend
      await crearNovedad(dataToSend);

      // 4. Éxito: Limpiamos el formulario y notificamos
      setSuccessMsg("¡Novedad registrada con éxito! Volviendo al dashboard...");
      setFormData(initialState);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      // El hook ya maneja errores internos, pero si hay un error no capturado:
      console.error("Error inesperado en el formulario:", error);
    }
  };

  const currentError = localError || hookError;

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Registrar Nueva Novedad
          </h2>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 transition font-medium"
          >
            &larr; Volver al Dashboard
          </Link>
        </div>

        {/* Mensajes de Feedback */}
        {currentError && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {currentError}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
            {successMsg}
          </div>
        )}

        {/* El Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área de Gestión *
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              required
              disabled={areas.length === 0}
            >
              {areas.length === 0 && (
                <option value="">Cargando áreas...</option>
              )}
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido de la Novedad *
            </label>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[150px]"
              placeholder="Describa la novedad, el incidente o la tarea realizada..."
              required
            />
          </div>

          {/* Campo Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              name="etiquetasInput"
              value={formData.etiquetasInput}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: urgente,mantenimiento,sector 3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se recomienda usar etiquetas para facilitar las búsquedas.
            </p>
          </div>

          {/* Botón Final */}
          <div className="pt-4 border-t mt-6">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 font-semibold transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !formData.area || !formData.contenido || areas.length === 0
              }
            >
              Registrar Novedad
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateNovedadPage;
