import { useCallback, useState } from "react";
import type {
  CreateNovedad,
  FiltroNovedad,
  NovedadResponse,
} from "../types/novedad.interface";
import { NovedadService } from "../services/novedad.service";

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

  const crearNovedad = useCallback(async (nuevaNovedad: CreateNovedad) => {
    setLoading(true);
    setError(null);
    try {
      const createdNovedad = await NovedadService.crearNovedad(nuevaNovedad);
      if (createdNovedad) {
        traerNovedades();
      }
    } catch (error) {
      setError("No se pudo crear la novedad");
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarNovedades = useCallback(async (filtro: FiltroNovedad) => {
    setLoading(true);
    setError(null);
    try {
      const novedadesFiltradas = await NovedadService.filtrarNovedades(filtro);
      setNovedades(novedadesFiltradas);
    } catch (error) {
      setError("No se pudieron filtrar las novedades.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    novedades,
    loading,
    error,
    traerNovedades,
    crearNovedad,
    filtrarNovedades,
  };
};
