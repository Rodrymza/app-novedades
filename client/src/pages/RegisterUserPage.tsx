import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// Definimos el estado inicial para limpiar el formulario fácilmente después
const initialState = {
  nombre: "",
  apellido: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "", // Campo extra solo para el frontend
  rol: "OPERADOR" as "OPERADOR" | "SUPERVISOR", // Default
};

const RegisterUserPage = () => {
  const [formData, setFormData] = useState(initialState);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // Traemos la función de registro del contexto
  const { signup, errors: contextErrors, clearErrors } = useAuth();

  // Manejador genérico para todos los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiamos errores al escribir para mejorar la UX
    if (localError) setLocalError(null);
    if (contextErrors.length > 0) clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);

    // 1. Validación: Contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    // 2. Validación: Longitud mínima (opcional pero recomendada)
    if (formData.password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // 3. Preparamos los datos (excluimos confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;

      // 4. Llamamos al backend
      const usuarioRegistrado = await signup(dataToSend);

      // Opcional: Hacer scroll arriba si el form es muy largo
      if (usuarioRegistrado) {
        setTimeout(() => {
          setFormData(initialState);
          navigate("/admin/gestion-usuarios");
        }, 1500);
      }
    } catch (error) {
      // El AuthContext ya maneja los errores del backend (errors)
      console.error("Error al crear usuario", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-blue-600 px-8 py-4">
          <h2 className="text-xl font-bold text-white">
            Registrar Nuevo Usuario
          </h2>
          <p className="text-blue-100 text-sm">
            Complete los datos para dar de alta un operador o supervisor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* --- MENSAJES DE FEEDBACK --- */}
          {localError && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
              <p className="font-bold">Error</p>
              <p>{localError}</p>
            </div>
          )}

          {contextErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
              {contextErrors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
              <p className="font-bold">¡Éxito!</p>
              <p>{successMsg}</p>
            </div>
          )}

          {/* --- GRID DEL FORMULARIO --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ej: Juan"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ej: Perez"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ej: jperez"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="juan@empresa.com"
                required
              />
            </div>

            {/* Rol (Ocupa toda la fila en móvil, pero aquí lo dejamos en la grilla) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol del Usuario
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="OPERADOR">
                  OPERADOR (Puede crear y ver novedades)
                </option>
                <option value="SUPERVISOR">SUPERVISOR (Admin total)</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition ${
                  localError
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-semibold transition transform active:scale-95"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
