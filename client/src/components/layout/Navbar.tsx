import { useState } from "react"; // 1. Importamos useState
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaLock,
  FaSignOutAlt,
  FaUser,
  FaBook,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  const isSupervisor = user?.rol === "SUPERVISOR";

  if (!user) return null;

  // Función auxiliar para cerrar el menú al hacer click en un enlace
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- SECCIÓN IZQUIERDA: LOGO + ENLACES DESKTOP --- */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <span className="text-white text-xl font-extrabold tracking-tight select-none">
              Libro de Novedades
            </span>

            {/* ENLACES COMUNES (Solo Desktop - hidden en móvil) */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/dashboard"
                className="p-2 rounded-full hover:bg-blue-700 transition text-white flex gap-2 items-center"
                title="Dashboard"
              >
                <FaHome /> Inicio
              </Link>
              <Link
                to="/profile"
                className="p-2 rounded-full hover:bg-blue-700 transition text-white flex gap-2 items-center"
                title="Perfil"
              >
                <FaUser /> Mi Perfil
              </Link>
            </div>
          </div>

          {/* --- SECCIÓN DERECHA: ADMIN + USER (Solo Desktop) --- */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            {isSupervisor && (
              <>
                <Link
                  to="/admin/gestion-usuarios"
                  className="text-blue-200 hover:text-white transition flex items-center gap-1"
                >
                  <FaUsers /> Usuarios
                </Link>
                <Link
                  to="/admin/gestion-areas"
                  className="text-blue-200 hover:text-white transition flex items-center gap-1"
                >
                  <FaLock /> Áreas
                </Link>
                <Link
                  to="/admin/gestion-novedades"
                  className="text-blue-200 hover:text-white transition flex items-center gap-1"
                >
                  <FaBook /> Novedades
                </Link>
              </>
            )}

            {/* Info Usuario */}
            <div className="text-sm text-blue-100 border-l border-blue-400 pl-4 py-1 text-right">
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs italic opacity-80">{user.rol}</p>
            </div>

            <button
              onClick={logout}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
            >
              <FaSignOutAlt size={20} />
            </button>
          </nav>

          {/* --- BOTÓN HAMBURGUESA (Solo Móvil - md:hidden) --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-blue-700 p-2 rounded-md focus:outline-none transition"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
      {/* Se muestra solo si isOpen es true y estamos en móvil (md:hidden por seguridad) */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-2 pt-2 pb-3 space-y-1 shadow-inner animate-fade-in-down">
          {/* Bloque 1: Enlaces Comunes */}
          <MobileLink to="/dashboard" icon={<FaHome />} onClick={closeMenu}>
            Inicio
          </MobileLink>
          <MobileLink to="/profile" icon={<FaUser />} onClick={closeMenu}>
            Mi Perfil
          </MobileLink>

          {/* Bloque 2: Separador Admin */}
          {isSupervisor && (
            <div className="border-t border-blue-500 my-2 pt-2">
              <p className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
                Administración
              </p>
              <MobileLink
                to="/admin/gestion-usuarios"
                icon={<FaUsers />}
                onClick={closeMenu}
              >
                Usuarios
              </MobileLink>
              <MobileLink
                to="/admin/gestion-areas"
                icon={<FaLock />}
                onClick={closeMenu}
              >
                Áreas
              </MobileLink>
              <MobileLink
                to="/admin/gestion-novedades"
                icon={<FaBook />}
                onClick={closeMenu}
              >
                Novedades
              </MobileLink>
            </div>
          )}

          {/* Bloque 3: Usuario y Logout */}
          <div className="border-t border-blue-500 mt-2 pt-3 pb-1">
            <div className="flex items-center px-3 mb-3">
              <div className="ml-2">
                <div className="text-base font-medium text-white leading-none mb-1">
                  {user.username}
                </div>
                <div className="text-sm font-medium text-blue-300 leading-none">
                  {user.rol}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 hover:text-white transition"
            >
              <FaSignOutAlt /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Componente auxiliar para evitar repetir clases en los links móviles
const MobileLink = ({ to, children, icon, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-white hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 transition-colors"
  >
    {icon} {children}
  </Link>
);
