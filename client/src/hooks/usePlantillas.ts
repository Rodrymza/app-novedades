import { useCallback, useState } from "react";
import type {
  CreatePlantilla,
  PlantillaResponse,
} from "../types/plantilla.interface";
import { PlantillaService } from "../services/plantilla.service";

export const usePlantillas = () => {
  // 1. Estados dentro del hook para independencia total
  const [plantillas, setPlantillas] = useState<PlantillaResponse[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsync = useCallback(
    async (action: () => Promise<any>, errorMsg?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await action();
        return result;
      } catch (err: any) {
        const msg = err.message || "Error desconocido";
        setError(`${errorMsg || "Error"}: ${msg}`);
        // aqui podriamos propagar el error si lo necesitamos
        // throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const traerPlantillas = useCallback(
    async (todas: boolean = false) => {
      const data = await handleAsync(
        () => PlantillaService.getAllPlantillas(todas),
        "Error al traer las plantillas",
      );
      if (data) setPlantillas(data);
    },
    [handleAsync],
  );

  const crearPlantilla = useCallback(
    async (nueva: CreatePlantilla) => {
      await handleAsync(
        () => PlantillaService.crearPlantilla(nueva),
        "Error al crear",
      );
      await traerPlantillas();
    },
    [handleAsync, traerPlantillas],
  );

  const modificarPlantilla = useCallback(
    async (id: string, datos: Partial<CreatePlantilla>) => {
      console.log("Datos nuevos:", datos);
      await handleAsync(
        () => PlantillaService.modificarPlantilla(id, datos),
        "Error al modificar",
      );
      await traerPlantillas();
    },
    [handleAsync, traerPlantillas],
  );

  const eliminarPlantilla = useCallback(
    async (id: string) => {
      await handleAsync(
        () => PlantillaService.borrarPlantilla(id),
        "Error al eliminar",
      );
      await traerPlantillas();
    },
    [handleAsync, traerPlantillas],
  );

  const restaurarPlantilla = useCallback(
    async (id: string) => {
      await handleAsync(
        () => PlantillaService.restaurarPlantilla(id),
        "Error al restaurar",
      );
      await traerPlantillas();
    },
    [handleAsync, traerPlantillas],
  );

  return {
    plantillas,
    loadingPlantillas: loading,
    errorPlantillas: error,
    traerPlantillas,
    crearPlantilla,
    modificarPlantilla,
    eliminarPlantilla,
    restaurarPlantilla,
  };
};
