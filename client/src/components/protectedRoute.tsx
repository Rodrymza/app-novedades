import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  // 1. Usamos el Hook (Teletransportador) para leer el estado global
  const { isAuthenticated, loading } = useAuth();

  // 2. CASO: CARGANDO
  // Si 'useEffect' todavía está preguntando al backend si hay cookie...
  // mostramos un texto o spinner. Si no hacemos esto, te expulsará por error.
  if (loading) return <h1>Cargando sistema...</h1>;

  // 3. CASO: NO AUTORIZADO
  // Si ya terminó de cargar y NO estás autenticado...
  // Te mandamos al login (replace evita que vuelvas atrás con las flechas)
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 4. CASO: AUTORIZADO
  // Si pasaste los filtros, 'Outlet' renderiza la página que querías ver (ej: Dashboard)
  return <Outlet />;
};
