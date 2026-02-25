import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNovedades } from "../hooks/useNovedades";
import { usePlantillas } from "../hooks/usePlantillas"; // <-- IMPORTAMOS EL HOOK
import { AreaService } from "../services/area.service";
import {
  PRIORIDADES_NOVEDAD,
  type CreateNovedad,
  type PrioridadNovedad,
} from "../types/novedad.interface";
import { ConfirmModal } from "../components/layout/ConfirmModal";

interface Area {
  id: string;
  nombre: string;
}

interface FormState {
  contenido: string;
  area: string;
  etiquetasInput: string;
  prioridad: PrioridadNovedad;
}

const initialState: FormState = {
  contenido: "",
  area: "",
  etiquetasInput: "",
  prioridad: "RUTINA",
};

const CreateNovedadPage = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [areas, setAreas] = useState<Area[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null,
  );

  const { crearNovedad, error: hookError } = useNovedades();

  // --- HOOK DE PLANTILLAS ---
  const { plantillas, traerPlantillas, loadingPlantillas } = usePlantillas();

  const aplicarPlantilla = (templateId: string) => {
    const plantillaSeleccionada = plantillas?.find((p) => p.id === templateId);

    if (plantillaSeleccionada) {
      const etiquetasActuales = formData.etiquetasInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const etiquetasPlantilla = plantillaSeleccionada.tags || [];
      const etiquetasFusionadas = Array.from(
        new Set([...etiquetasActuales, ...etiquetasPlantilla]),
      ).join(", ");

      setFormData((prev) => ({
        ...prev,
        contenido: plantillaSeleccionada.contenido || "",
        etiquetasInput: etiquetasFusionadas,
      }));
    }
    setPendingTemplateId(null); // Limpiamos la selección pendiente
  };
  // --- EFECTOS ---
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await AreaService.getAllAreas(false);
        setAreas(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, area: data[0].id }));
        }
      } catch (err) {
        setLocalError("No se pudieron cargar las áreas de gestión.");
      }
    };

    fetchAreas();
    traerPlantillas(); // Cargamos las plantillas al montar el componente
  }, [traerPlantillas]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  // --- MANEJADOR DE INYECCIÓN DE PLANTILLA ---
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) return;

    if (formData.contenido.trim() !== "") {
      // Si hay texto, guardamos el ID y abrimos el modal
      setPendingTemplateId(templateId);
      setIsModalOpen(true);
    } else {
      // Si está vacío, la aplicamos directamente
      aplicarPlantilla(templateId);
    }

    // Reseteamos el select para que pueda volver a usarse
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contenido || !formData.area) {
      setLocalError("El contenido de la novedad y el área son obligatorios.");
      return;
    }

    try {
      const etiquetasArray = formData.etiquetasInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const dataToSend: CreateNovedad = {
        contenido: formData.contenido,
        area_id: formData.area,
        etiquetas: etiquetasArray,
        prioridad: formData.prioridad,
      };

      await crearNovedad(dataToSend);

      setFormData(initialState);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error inesperado en el formulario:", error);
    }
  };

  const currentError = localError || hookError;

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
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

        {currentError && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {currentError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Área */}
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

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad *
              </label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                required
              >
                {PRIORIDADES_NOVEDAD.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad.charAt(0) + prioridad.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usar Plantilla
            </label>
            <select
              onChange={handleTemplateSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none text-sm text-gray-600"
              disabled={
                loadingPlantillas || !plantillas || plantillas.length === 0
              }
            >
              <option value="">
                {loadingPlantillas
                  ? "Cargando plantillas..."
                  : "-- Seleccione una plantilla (Opcional) --"}
              </option>
              {plantillas?.map((plantilla) => (
                <option key={plantilla.id} value={plantilla.id}>
                  ⚡ {plantilla.nombre}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Seleccionar una plantilla autocompletará el área de texto con un
              formato predefinido.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido de la Novedad *
            </label>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[400px] font-mono text-sm"
              placeholder="Describa la novedad, el incidente o la tarea realizada..."
              required
            />
          </div>

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
      <ConfirmModal
        open={isModalOpen}
        title="Reemplazar contenido"
        message="Ya has escrito texto en la novedad. Si aplicas esta plantilla, se borrará lo que escribiste. ¿Deseas continuar?"
        onClose={() => {
          setIsModalOpen(false);
          setPendingTemplateId(null);
        }}
        onConfirm={() => {
          if (pendingTemplateId) {
            aplicarPlantilla(pendingTemplateId);
          }
        }}
      />
    </>
  );
};

export default CreateNovedadPage;
