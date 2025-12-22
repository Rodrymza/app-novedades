import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Asegúrate de importar tu instancia configurada, no el axios por defecto
// Si no tienes instancia, usa axios normal pero recuerda la URL completa si es necesario
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ESTADOS NUEVOS PARA LA ESPERA
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const { signin, isAuthenticated, errors } = useAuth();
  const navigate = useNavigate();

  // 3. EFECTO DE DESPERTAR (Lo dejamos igual, es muy útil)
  useEffect(() => {
    const despertarBackend = async () => {
      try {
        // Asegúrate que axios tenga la baseURL configurada o usa la URL completa
        await axios.get(`${import.meta.env.VITE_API_URL}/health`);
        console.log("📡 Ping al servidor enviado");
      } catch (error) {
        console.log("Despertando servidor...");
      }
    };
    despertarBackend();
  }, []);

  // 4. REDIRECCIÓN
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setIsWakingUp(false);

    const timeoutId = setTimeout(() => {
      setIsWakingUp(true);
    }, 3000);

    try {
      await signin({ username, password });
      // Si entra, el useEffect de redirección hará el resto
    } catch (error) {
      // Si falla rápido (credenciales mal), limpiamos el loading
      console.error(error);
    } finally {
      // 3. Limpieza final (importante si hubo error)
      clearTimeout(timeoutId);
      setIsLoading(false);
      setIsWakingUp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm transition-all duration-300"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar sesión
        </h2>

        {/* MENSAJE DE SERVIDOR DURMIENDO (Solo aparece si tarda > 3seg) */}
        {isWakingUp && (
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-xl">🚀</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">
                  El servidor se está despertando...
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Esto puede tomar unos 30 segundos. Gracias por tu paciencia.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ERRORES DEL BACKEND */}
        {errors.map((error, i) => (
          <div
            key={i}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm"
          >
            {error}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario o Email"
            disabled={isLoading} // Bloquear input mientras carga
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading} // Bloquear input mientras carga
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 
            ${
              isLoading
                ? "bg-blue-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              {/* Spinner simple con SVG */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isWakingUp ? "Conectando..." : "Entrando..."}
            </div>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
