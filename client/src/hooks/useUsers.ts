import { useCallback, useState } from "react";
import type {
  IDeleteUser,
  IEditUser,
  UserResponse,
} from "../types/user.interfaces";
import { UserService } from "../services/user.service";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useUsers = () => {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<UserResponse | null>(null);

  const traerUsuarios = useCallback(async (background = false) => {
    try {
      // Solo mostramos el spinner si NO es una carga en segundo plano
      if (!background) {
        setLoading(true);
      }
      setError(null);

      const data = await UserService.getUsers();
      if (data) {
        setUsuarios(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      // Solo apagamos el spinner si lo habíamos encendido
      if (!background) {
        setLoading(false);
      }
    }
  }, []);

  const borrarUsuario = useCallback(async (reqEliminar: IDeleteUser) => {
    try {
      await toast.promise(UserService.deleteUser(reqEliminar), {
        loading: "Eliminando usuario...",
        success: "Usuario eliminado correctamente",
        error: (err) => getErrorMessage(err),
      });

      // Si salió bien, recargamos la lista
      await traerUsuarios(true);
    } catch (error) {
      setError("No se pudo eliminar el usuario");
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

  const restaurarUsuario = useCallback(async (id: string) => {
    setError(null);
    try {
      await toast.promise(UserService.restoreUser(id), {
        loading: "Restaurando Usuario...",
        success: "Usuario restaurado correctamente",
        error: (err) => getErrorMessage(err),
      });
      traerUsuarios(true);
    } catch (error) {
      setError(`Error al restaurar el usuario: ${error}`);
    }
  }, []);

  const modificarUsuario = useCallback(
    async (id: string, editDataUser: IEditUser): Promise<boolean> => {
      setError(null);
      try {
        await toast.promise(UserService.editUser(id, editDataUser), {
          loading: "Editando informacion del usuario...",
          success: "Informacion de usuario editada satisfactoriamente",
          error: (err) => getErrorMessage(err),
        });
        traerUsuarios(true);
        return true;
      } catch (error) {
        setError(`Error al editar el usuario ${error}`);
        return false;
      }
    },
    []
  );

  return {
    error,
    traerUsuarios,
    borrarUsuario,
    usuarios,
    loading,
    getPerfil,
    restaurarUsuario,
    modificarUsuario,
    perfil,
  };
};
