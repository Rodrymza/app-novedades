import { useEffect, useState } from "react";
// Importamos los iconos que usaremos para embellecer los campos
import { FaUserCircle, FaEnvelope, FaIdCard, FaBuilding } from "react-icons/fa";
// Asumo que tu useUsers devuelve el UserResponse que definimos antes
import { useUsers } from "../hooks/useUsers";
import ProfileField from "../components/ui/ProfileField";
import toast from "react-hot-toast";

function ProfilePage() {
  const { perfil, getPerfil, loading, error, actualizarContrasenia } =
    useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado nuevo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación de Frontend: ¿Coinciden las nuevas?
    if (passwords.new !== passwords.confirm) {
      toast.error("Las contraseñas nuevas no coinciden.");
      return;
    }

    // 2. Validación de longitud (ahorra petición al back)
    if (passwords.new.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setIsSubmitting(true);

      await actualizarContrasenia({
        passwordActual: passwords.current,
        passwordNuevo: passwords.new,
      });

      setIsModalOpen(false);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Falló la actualización en el componente");
    } finally {
      setIsSubmitting(false);
    }
  };

  // El hook se encargará de llamar a /auth/profile
  useEffect(() => {
    getPerfil();
  }, []);

  // Función auxiliar para determinar las clases del rol
  const getRoleBadgeClasses = (rol: string) => {
    switch (rol) {
      case "SUPERVISOR":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  // --- RENDERIZADO CONDICIONAL DE CARGA Y ERROR ---

  // Estado de Carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Cargando perfil...
        </p>
      </div>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow">
        <p className="font-bold">Error al cargar el perfil:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Si no hay perfil (ej: error 404), mostramos un mensaje
  if (!perfil) {
    return (
      <div className="text-center p-10 text-gray-500">
        No se encontró información del perfil.
      </div>
    );
  }

  // --- RENDERIZADO DEL PERFIL ---

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3 border-b pb-3">
        <FaIdCard className="text-blue-600" /> Mi Perfil
      </h1>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Encabezado del Perfil */}
        <div className="bg-blue-600 p-8 text-white flex items-center gap-5">
          <FaUserCircle className="w-12 h-12" />
          <div>
            <h2 className="text-xl font-bold">
              {perfil.nombre} {perfil.apellido}
            </h2>
            <p className="text-blue-200 text-sm">@{perfil.username}</p>
          </div>
        </div>

        {/* Detalles del Perfil (Grid de 2 columnas) */}
        <div className="p-8 space-y-6">
          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaUserCircle className="w-4 h-4 text-blue-500" /> Información
              Personal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Campo Nombre */}
              <ProfileField
                label="Nombre"
                value={perfil.nombre}
                icon={<FaUserCircle />}
              />
              {/* Campo Apellido */}
              <ProfileField
                label="Apellido"
                value={perfil.apellido}
                icon={<FaUserCircle />}
              />
              {/* Campo Username */}
              <ProfileField
                label="Nombre de usuario"
                value={perfil.username}
                icon={<FaIdCard />}
              />
              {/* Campo Email */}
              <ProfileField
                label="Email"
                value={perfil.email}
                icon={<FaEnvelope />}
              />
              {/* Campo Documento */}
              <ProfileField
                label="Documento"
                value={perfil.documento}
                icon={<FaEnvelope />}
              />
            </div>
          </div>

          {/* SECCIÓN 2: AJUSTES Y ACCESO */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <FaBuilding className="w-4 h-4 text-blue-500" /> Nivel de Acceso
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${getRoleBadgeClasses(
                  perfil.rol
                )}`}
              >
                {perfil.rol}
              </span>
            </div>

            <div className="flex sm:justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors shadow-md active:scale-95"
              >
                <span>Cambiar Contraseña</span>
                <span className="text-gray-400 text-xs">🔒</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* EL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full m-4">
            <h2 className="text-xl font-bold mb-4">Seguridad</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium">Contraseña Actual</label>
                <input
                  type="password"
                  className="w-full border p-2 rounded"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Nueva Contraseña</label>
                <input
                  type="password"
                  className="w-full border p-2 rounded"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Repetir Nueva</label>
                <input
                  type="password"
                  className="w-full border p-2 rounded"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPasswords({ current: "", new: "", confirm: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded text-white font-medium transition-colors flex items-center gap-2
    ${
      isSubmitting
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
