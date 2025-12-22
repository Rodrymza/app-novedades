import { useEffect } from "react";
// Importamos los iconos que usaremos para embellecer los campos
import { FaUserCircle, FaEnvelope, FaIdCard, FaBuilding } from "react-icons/fa";
// Asumo que tu useUsers devuelve el UserResponse que definimos antes
import { useUsers } from "../hooks/useUsers";
import ProfileField from "../components/ui/ProfileField";

function ProfilePage() {
  const { perfil, getPerfil, loading, error } = useUsers();

  // useEffect para cargar el perfil una sola vez al montar
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

          {/* SECCIÓN 2: ROL DEL SISTEMA */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <FaBuilding className="w-4 h-4 text-blue-500" /> Nivel de Acceso
            </h3>
            <span
              className={`inline-block px-4 py-2 text-sm font-semibold rounded-full border ${getRoleBadgeClasses(
                perfil.rol
              )}`}
            >
              {perfil.rol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
