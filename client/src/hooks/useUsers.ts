import { useCallback, useState } from "react";
import type { UserResponse } from "../types/user.interfaces";
import { UserService } from "../services/user.service";

export const useUsers = () => {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  return {
    error,
    traerUsuarios,
    usuarios,
    loading,
  };
};
