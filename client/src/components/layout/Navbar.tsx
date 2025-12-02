import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaLock,
  FaSignOutAlt,
  FaUser,
  FaBook,
} from "react-icons/fa"; // Iconos
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const isSupervisor = user?.rol === "SUPERVISOR";

  if (!user) return null;

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* IZQUIERDA: LOGO y Home */}
        <div className="flex items-center gap-6">
          {/* Logo/Nombre de la App */}
          <span className="text-white text-xl font-extrabold tracking-tight select-none">
            Libro de Novedades
          </span>

          {/* Botón Home/Dashboard */}
          <Link
            to="/dashboard"
            className="p-2 rounded-full hover:bg-blue-700 transition duration-150 text-white flex gap-2"
            title="Dashboard Principal"
          >
            <FaHome className="w-5 h-5" /> Inicio
          </Link>
          <Link
            to="/profile"
            className="p-2 rounded-full hover:bg-blue-700 transition duration-150 text-white flex gap-2"
            title="Mi Perfil"
          >
            <FaUser className="w-5 h-5" /> Mi Perfil
          </Link>
        </div>

        {/* DERECHA: Navegación y Usuario */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          {/* --- ENLACES DE ADMINISTRACIÓN (Solo Supervisores) --- */}
          {isSupervisor && (
            <Link
              to="/admin/gestion-usuarios"
              className="text-blue-200 hover:text-white transition flex items-center gap-1"
            >
              <FaUsers className="w-4 h-4" /> Gestion de Usuarios
            </Link>
          )}

          {/* Gestionar áreas, otro enlace de administración */}
          {isSupervisor && (
            <Link
              to="/admin/gestion-areas"
              className="text-blue-200 hover:text-white transition flex items-center gap-1"
            >
              <FaLock className="w-4 h-4" /> Gestión de Áreas
            </Link>
          )}

          {/* Gestionar novedades, otro enlace de administración */}
          {isSupervisor && (
            <Link
              to="/admin/gestion-novedades"
              className="text-blue-200 hover:text-white transition flex items-center gap-1"
            >
              <FaBook className="w-4 h-4" /> Gestion de Novedades
            </Link>
          )}

          {/* Nombre y Rol */}
          <div className="text-sm text-blue-100 border-l border-blue-400 pl-4 py-1">
            <p className="font-semibold">{user.username}</p>
            <p className="text-xs italic">({user.rol})</p>
          </div>

          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition duration-150"
          >
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};
