import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePlantillas } from "../hooks/usePlantillas";
import type { CreatePlantilla } from "../types/plantilla.interface";
import { PRIORIDADES_NOVEDAD } from "../types/novedad.interface";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export const FormularioPlantillaPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { plantillas, traerPlantillas, crearPlantilla, modificarPlantilla } =
    usePlantillas();

  const [formData, setFormData] = useState({
    nombre: "",
    contenido: "",
    prioridad: "",
    tagsInput: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!plantillas) {
      traerPlantillas();
      return;
    }

    if (isEditMode && id) {
      const plantillaAEditar = plantillas.find((p) => p.id === id);
      if (plantillaAEditar) {
        setFormData({
          nombre: plantillaAEditar.nombre,
          contenido: plantillaAEditar.contenido || "",
          prioridad: plantillaAEditar.prioridad || "RUTINA",
          tagsInput: plantillaAEditar.tags
            ? plantillaAEditar.tags.join(", ")
            : "",
        });
      } else {
        toast.error("No se encontró la plantilla solicitada.");
      }
    }
  }, [id, isEditMode, plantillas, traerPlantillas]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.contenido.trim()) {
      toast.error("El nombre y el contenido son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = formData.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<CreatePlantilla> = {
        nombre: formData.nombre,
        contenido: formData.contenido,
        prioridad: formData.prioridad,
        tags: tagsArray,
      };
      let mensaje = "";
      if (isEditMode && id) {
        await modificarPlantilla(id, payload);
        mensaje = "modificada";
      } else {
        await crearPlantilla(payload as CreatePlantilla);
        mensaje = "creada";
      }

      toast.success(`Plantilla ${mensaje} exitosamente`);
      navigate("/admin/plantillas");
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al guardar la plantilla.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? "Modificar Plantilla" : "Crear Nueva Plantilla"}
          </h1>
          <p className="text-gray-600 mt-1">
            Diseña el formato rápido para las novedades.
          </p>
        </div>
        <Link
          to="/admin/plantillas"
          className="text-blue-600 hover:text-blue-800 font-medium transition"
        >
          &larr; Volver
        </Link>
      </div>

      {/* FORMULARIO ÚNICO */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Plantilla *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Falla en Tomógrafo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <FaCheckCircle className="text-blue-500" />
              Prioridad Predeterminada *
            </label>

            <div className="relative group">
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                required
              >
                {PRIORIDADES_NOVEDAD.map((prioridad) => (
                  <option
                    key={prioridad}
                    value={prioridad}
                    className="bg-white text-slate-800 font-medium"
                  >
                    {prioridad}
                  </option>
                ))}
              </select>

              {/* Icono de flecha personalizado para el select */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500 italic">
              Esta prioridad se seleccionará automáticamente al usar esta
              plantilla.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              name="tagsInput"
              value={formData.tagsInput}
              onChange={handleChange}
              placeholder="Ej: urgente, mantenimiento, rayos"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido / Esqueleto *
            </label>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              placeholder="Escribe aquí el texto base..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm min-h-[300px]"
              required
            />
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditMode
                  ? "Guardar Cambios"
                  : "Crear Plantilla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
