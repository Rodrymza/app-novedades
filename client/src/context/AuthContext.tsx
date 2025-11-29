import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { AxiosError } from "axios";
import type {
  CreateUserBody,
  LoginUser,
  UserResponse,
} from "../types/user.interfaces";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import toast from "react-hot-toast";

// Definimos qué datos y funciones tendrá nuestro contexto
interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  errors: string[]; // Array de mensajes de error para mostrar en las alertas
  loading: boolean; // Vital para saber si estamos comprobando la sesión
  signin: (user: LoginUser) => Promise<void>;
  signup: (user: CreateUserBody) => Promise<boolean | null>;
  logout: () => Promise<void>;
  getUsers: () => Promise<UserResponse[] | void>;
  clearErrors: () => void; // Para limpiar las alertas manualmente si es necesario
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar el contexto más fácil (ej: const { user } = useAuth();)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// El Proveedor que envolverá la App
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Función de Registro (Solo para Supervisores, pero la lógica va aquí) ---
  const signup = async (user: CreateUserBody) => {
    try {
      await toast.promise(AuthService.register(user), {
        loading: "Creando Usuario...",
        success: `Usuario ${user.username} Registrado!`,
        error: (err) => {
          if (err instanceof AxiosError && err.response?.data) {
            return err.response.data.detail || "Erro al registrar el usuario";
          }
          return "Ocurrio un error inesperado";
        },
      });
      return true;
      // Opcional: Podríamos loguearlo automáticamente o solo notificar éxito
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // --- Función de Login ---
  const signin = async (user: LoginUser) => {
    try {
      const res = await AuthService.login(user);
      setUser(res);
      setIsAuthenticated(true);
      setErrors([]); // Limpiamos errores viejos
    } catch (error) {
      handleError(error);
    }
  };

  // --- Función de Logout ---
  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const usuarios = await UserService.getUsers();
      return usuarios;
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      // mostrar mensajes de error
      const errorMsg =
        error.response?.data.detail ||
        error.response?.data.message ||
        "Error desconocido";

      setErrors([errorMsg]);
    } else {
      setErrors(["Ocurrió un error de conexión"]);
    }
  };

  const clearErrors = () => setErrors([]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await AuthService.getProfile();
        setUser(res);
        setIsAuthenticated(true);
      } catch (error) {
        // Si falla, es que no hay sesión válida
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  // --- Temporizador para limpiar errores automáticos (Opcional UX) ---
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000); // Los errores desaparecen a los 5 segundos
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        signin,
        signup,
        logout,
        clearErrors,
        getUsers,
        user,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
