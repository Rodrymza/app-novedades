import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
// import { Navbar } from "../components/layout/Navbar"; // (La crearemos luego)

export const MainLayout = () => {
  return (
    // 1. min-h-screen: Ocupa al menos toda la altura de la ventana
    // 2. flex flex-col: Organiza los hijos en columna vertical
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Navbar /> Aquí irá tu barra superior */}
      <Navbar />

      {/* 3. flex-grow: Este div ocupará todo el espacio disponible empujando el footer */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Aquí se renderizarán Dashboard, Perfil, etc. */}
        <Outlet />
      </main>

      {/* El Footer siempre quedará al final gracias al flex-grow del main */}
      <Footer />
    </div>
  );
};
