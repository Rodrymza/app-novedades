import { useCallback, useState } from "react";
import type {
  CreatePlantilla,
  PlantillaResponse,
} from "../types/plantilla.interface";
import { PlantillaService } from "../services/plantilla.service";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/getErrorMessage";

export const usePlantillas = () => {
  // 1. Estados dentro del hook para independencia total
  const [plantillas, setPlantillas] = useState<PlantillaResponse[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleAsync = useCallback(
    async (
      action: () => Promise<any>, // Agregamos mensaje de éxito opcional
      errorMsg?: string,
      successMsg?: string,
    ) => {
      setLoading(true);

      try {
        const result = await action();

        // Si la acción fue exitosa y pasamos un mensaje, disparamos el toast
        if (successMsg) {
          toast.success(successMsg);
        }

        return result;
      } catch (err: any) {
        const msg = getErrorMessage(err);
        const finalError = `${errorMsg || "Error"}: ${msg}`;

        // Disparamos el toast de error
        toast.error(finalError);

        // Es buena práctica propagar el error si el componente
        // que llama necesita hacer algo específico tras el fallo
        throw err;
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
        "Plantilla creada satisfactoriamente",
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
        "Plantilla eliminada satisfactoriamente",
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
        "Plantilla restaurada satisfactoriamente",
      );
      await traerPlantillas();
    },
    [handleAsync, traerPlantillas],
  );

  return {
    plantillas,
    loadingPlantillas: loading,
    traerPlantillas,
    crearPlantilla,
    modificarPlantilla,
    eliminarPlantilla,
    restaurarPlantilla,
  };
};
