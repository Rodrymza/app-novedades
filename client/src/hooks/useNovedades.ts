import { useCallback, useState } from "react";
import type {
  CreateNovedad,
  FiltroNovedad,
  NovedadResponse,
} from "../types/novedad.interface";
import { NovedadService } from "../services/novedad.service";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useNovedades = () => {
  const [novedades, setNovedades] = useState<NovedadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traerNovedades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await NovedadService.getAllNovedades();
      if (data) {
        setNovedades(data);
      }
    } catch (error) {
      setError("No se pudieron cargar las novedades.");
    } finally {
      setLoading(false);
    }
  }, []);

  const crearNovedad = useCallback(
    async (nuevaNovedad: CreateNovedad) => {
      setLoading(true);
      setError(null);

      try {
        await toast.promise(NovedadService.crearNovedad(nuevaNovedad), {
          loading: "Creando novedad...",
          success: "Novedad creada satisfactoriamente!",
          error: (error: any) => {
            if (error.response?.data) {
              return (
                error.response.data.detail ||
                error.response.data.message ||
                "Error al crear la novedad."
              );
            }
            return "No se pudo conectar con el servidor.";
          },
        });

        await traerNovedades();
      } catch (error: any) {
        if (error.response?.data) {
          setError(error.response.data.detail || error.response.data.message);
        } else {
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    },
    [traerNovedades],
  );

  const filtrarNovedades = useCallback(async (filtro: FiltroNovedad) => {
    setLoading(true);
    setError(null);
    try {
      const novedadesFiltradas = await NovedadService.filtrarNovedades(filtro);
      setNovedades(novedadesFiltradas);
    } catch (error: any) {
      if (error.response?.data) {
        const { message, detail } = error.response.data;
        setError(detail || message || "Error al filtrar las novedades.");
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarNovedad = useCallback(async (id: string, motivo: string) => {
    try {
      const created = await toast.promise(
        NovedadService.borrarNovedad(id, motivo),
        {
          loading: "Eliminando novedad...",
          success: "Novedad eliminada correctamente",
          error: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
              return (
                err.response.data.detail ||
                err.response.data.message ||
                "Error al eliminar"
              );
            }
            return "Ocurrió un error inesperado";
          },
        },
      );
      if (created) await traerNovedades();
    } catch (error) {
      setError("No se pudo eliminar el usuario");
    } finally {
      setLoading(false);
    }
  }, []);

  const restaurarNovedad = useCallback(async (id: string) => {
    try {
      await toast.promise(NovedadService.restaurarNovedad(id), {
        loading: "Restaurando novedad...",
        success: "Novedad restaurada exitosamente",
        error: (err) => {
          if (err instanceof AxiosError && err.response?.data) {
            return (
              err.response.data.detail ||
              err.response.data.message ||
              "Error al eliminar"
            );
          }
          return "Ocurrió un error inesperado";
        },
      });
    } catch (error) {
      setError("No se pudo restaurar la novedad");
    }
  }, []);

  return {
    novedades,
    loading,
    error,
    traerNovedades,
    crearNovedad,
    filtrarNovedades,
    eliminarNovedad,
    restaurarNovedad,
  };
};
