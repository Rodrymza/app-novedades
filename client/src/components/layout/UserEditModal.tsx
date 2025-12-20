import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaTimes, FaSave } from "react-icons/fa";
import type { IEditUser, UserResponse } from "../../types/user.interfaces";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: IEditUser) => void;
  user: UserResponse | null; // Usuario a editar
  loading?: boolean;
}

export const UserEditModal = ({
  open,
  onClose,
  onConfirm,
  user,
  loading,
}: Props) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  // Al abrir el modal o cambiar de usuario, cargamos los datos en el estado local
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      });
    }
  }, [user, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaUser /> Editar Usuario
          </h3>
          <button
            onClick={onClose}
            className="hover:text-indigo-200 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              required
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none transition"
              placeholder="Nombre del usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              required
              type="text"
              value={formData.apellido}
              onChange={(e) =>
                setFormData({ ...formData, apellido: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none transition"
              placeholder="Apellido del usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <FaEnvelope className="text-gray-400 size-3" /> Email
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none transition"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Footer / Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <FaSave /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
