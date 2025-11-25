import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedAdminUser = () => {
  const { user, loading } = useAuth();

  if (loading) return <h1>Cargando sistema...</h1>;

  if (!user || user.rol != "SUPERVISOR") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
