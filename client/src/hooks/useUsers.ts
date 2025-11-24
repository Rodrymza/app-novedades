import { useCallback, useState } from "react";
import type { UserResponse } from "../types/user.interfaces";
import { UserService } from "../services/user.service";

export const useUsers = () => {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<UserResponse | null>(null);

  const traerUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await UserService.getUsers();
      if (data) {
        setUsuarios(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getPerfil = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const perfil = await UserService.getProfile();
      if (perfil) {
        setPerfil(perfil);
      }
    } catch (error) {
      setError("No se pudo cargar el perfil de usuario");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    error,
    traerUsuarios,
    usuarios,
    loading,
    getPerfil,
    perfil,
  };
};
