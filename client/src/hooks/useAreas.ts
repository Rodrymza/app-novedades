import { useCallback, useState } from "react";
import type { AreaResponse, CreateArea } from "../types/area.interface";
import { AreaService } from "../services/area.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { getErrorMessage } from "../utils/getErrorMessage";

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
      try {
        const resultado = await toast.promise(
          AreaService.crearArea(datosArea),
          {
            loading: "Creando área...",
            success: "Área creada correctamente",
            error: (err) => getErrorMessage(err),
          }
        );
        traerAreas();
        return resultado;
      } catch (error) {
        console.log(getErrorMessage(error));
      }
    },
    [traerAreas]
  );

  const eliminarArea = useCallback(
    async (id: string) => {
      try {
        await toast.promise(AreaService.borrarArea(id), {
          loading: "Eliminando area",
          success: "Area eliminada correctamente",
          error: (err) => getErrorMessage(err),
        });
        traerAreas();
      } catch (error) {
        console.log(getErrorMessage(error));
      }
    },
    [traerAreas]
  );

  return {
    error,
    traerAreas,
    crearArea,
    eliminarArea,
    areas,
    loading,
  };
};
