import React, { useState, useEffect } from "react";
// 1. Importamos el Hook del contexto y el de navegación
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 2. Traemos las funciones y estados del Contexto
  // (Usamos 'signin' porque así lo llamamos en el AuthContext que creamos antes)
  const { signin, isAuthenticated, errors } = useAuth();
  const navigate = useNavigate();

  // 3. EFECTO DE REDIRECCIÓN
  // Si 'isAuthenticated' cambia a true (porque el login fue exitoso),
  // nos vamos automáticamente al dashboard.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 4. Usamos la función del contexto, NO el servicio directo.
    // El contexto llamará al servicio y actualizará el estado global.
    await signin({ username, password });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

        {/* 5. MOSTRAR ERRORES */}
        {/* Si el backend rechaza el login, mostramos el mensaje aquí */}
        {errors.map((error, i) => (
          <div
            key={i}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center"
          >
            {error}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="tuemail@email.com" // O tu usuario
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
