import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaTimes,
  FaSave,
  FaKey,
  FaIdCard, // Cambié FaPassport por FaIdCard que es más común para DNI
} from "react-icons/fa";
import type { IEditUser, UserResponse } from "../../types/user.interfaces";
// IMPORTANTE: Asegúrate de importar tu ConfirmModal
import { ConfirmModal } from "../layout/ConfirmModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: IEditUser) => void;
  restorePassword: (id: string) => void;
  user: UserResponse | null;
  loading?: boolean;
}

export const UserEditModal = ({
  open,
  onClose,
  onConfirm,
  restorePassword,
  user,
  loading,
}: Props) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    documento: "",
  });

  // Estado para controlar el Modal de Confirmación de Contraseña
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        documento: user.documento || "",
      });
    }
  }, [user, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  // 1. Al hacer click en el botón naranja, solo abrimos el modal
  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  // 2. Si el usuario dice "SÍ" en el modal, ejecutamos la acción
  const handleConfirmReset = () => {
    if (user && user.id) {
      restorePassword(user.id);
      setShowResetConfirm(false); // Cerramos el confirm
      // Opcional: Si quieres cerrar también el modal de edición, descomenta:
      // onClose();
    }
  };

  return (
    <>
      {/* --- MODAL PRINCIPAL DE EDICIÓN --- */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="px-6 py-4 bg-indigo-600 flex justify-between items-center text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FaUser /> Editar Usuario
            </h3>
            <button
              onClick={onClose}
              type="button"
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaIdCard className="text-gray-400 size-3" /> Documento
              </label>
              <input
                required
                type="text"
                value={formData.documento}
                onChange={(e) =>
                  setFormData({ ...formData, documento: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>

            {/* SECCIÓN RESET PASSWORD */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleResetClick} // <--- Abre el ConfirmModal
                disabled={loading}
                className="w-full px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition font-medium flex items-center justify-center gap-2"
              >
                <FaKey /> Restablecer Contraseña
              </button>
              <p className="text-xs text-center text-gray-400 mt-1">
                Se asignará el DNI como contraseña temporal.
              </p>
            </div>

            {/* BOTONES PRINCIPALES */}
            <div className="flex gap-3 pt-2">
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

      {/* --- MODAL DE CONFIRMACIÓN (ANIDADO VISUALMENTE) --- */}
      <ConfirmModal
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleConfirmReset}
        title="Restablecer Contraseña"
        message={`¿Estás seguro de que deseas restablecer la contraseña de ${formData.nombre} ${formData.apellido}? La nueva contraseña será su número de documento.`}
      />
    </>
  );
};
