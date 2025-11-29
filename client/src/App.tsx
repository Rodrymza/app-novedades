import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { ProtectedRoute } from "./components/protectedRoute"; // <-- Importamos el guardia
import LoginPage from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import { MainLayout } from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import { ProtectedAdminUser } from "./components/protectedAdminUser";
import CreateNovedadPage from "./pages/CreateNovedadPage";
import AdminAreasPage from "./pages/AdminAreasPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    // 1. AuthProvider envuelve TODO para que el 'useContext' funcione
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas (Cualquiera puede entrar) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas para login*/}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Aquí adentro pones todo lo que requiera login */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/perfil" element={<h1>Mi Perfil</h1>} />
              <Route path="/crear-novedad" element={<CreateNovedadPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Rutas para admin*/}
          <Route element={<ProtectedAdminUser />}>
            <Route element={<MainLayout />}>
              <Route
                path="/admin/registrar-usuario"
                element={<RegisterUserPage />}
              />
              <Route
                path="/admin/gestion-usuarios"
                element={<AdminUsersPage />}
              />
              <Route path="/admin/gestion-areas" element={<AdminAreasPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
