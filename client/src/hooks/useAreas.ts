import { useCallback, useState } from "react";
import type { AreaResponse, CreateArea } from "../types/area.interface";
import { AreaService } from "../services/area.service";

export const useAreas = () => {
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traerAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await AreaService.getAllAreas();
      if (data) {
        setAreas(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  const crearArea = useCallback(
    async (datosArea: CreateArea) => {
      setLoading(true);
      setError(null);
      try {
        const data = await AreaService.crearArea(datosArea);
        traerAreas();
        return data;
      } catch (error) {
        setError("No se pudo crear el área.");
      } finally {
        setLoading(false);
      }
    },
    [traerAreas]
  );

  return {
    error,
    traerAreas,
    crearArea,
    areas,
    loading,
  };
};
