import { useCallback, useState } from "react";
import type { AreaResponse, CreateArea } from "../types/area.interface";
import { AreaService } from "../services/area.service";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useAreas = () => {
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. ESTADO DE MEMORIA: Guardamos el último filtro aplicado
  const [filtroActual, setFiltroActual] = useState(false);

  // 2. MODIFICAMOS TRAER AREAS
  const traerAreas = useCallback(async (todas: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Guardamos la preferencia actual para usarla después
      setFiltroActual(todas);

      const data = await AreaService.getAllAreas(todas);
      if (data) {
        setAreas(data);
      }
    } catch (error) {
      setError("No se pudieron cargar las áreas.");
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
        // 3. USAMOS LA MEMORIA: Refrescamos usando el estado guardado
        traerAreas(filtroActual);
        return resultado;
      } catch (error) {
        console.log(getErrorMessage(error));
      }
    },
    [traerAreas, filtroActual] // Agregamos filtroActual a dependencias
  );

  const eliminarArea = useCallback(
    async (id: string) => {
      try {
        await toast.promise(AreaService.borrarArea(id), {
          loading: "Eliminando area",
          success: "Area eliminada correctamente",
          error: (err) => getErrorMessage(err),
        });
        // 3. USAMOS LA MEMORIA
        traerAreas(filtroActual);
      } catch (error) {
        console.log(getErrorMessage(error));
      }
    },
    [traerAreas, filtroActual]
  );

  const restaurarArea = useCallback(
    async (id: string) => {
      try {
        await toast.promise(AreaService.restaurarArea(id), {
          loading: "Restaurando area",
          success: "Area restaurada correctamente",
          error: (err) => getErrorMessage(err),
        });
        // 3. USAMOS LA MEMORIA
        traerAreas(filtroActual);
      } catch (error) {
        console.log(getErrorMessage(error));
      }
    },
    [traerAreas, filtroActual]
  );

  return {
    error,
    traerAreas,
    crearArea,
    eliminarArea,
    restaurarArea,
    areas,
    loading,
  };
};
