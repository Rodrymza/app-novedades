import { axiosClient } from "../api/axios";
import type {
  CreatePlantilla,
  ModificarPlantilla,
  PlantillaResponse,
} from "../types/plantilla.interface";

export const PlantillaService = {
  getAllPlantillas: async (todas: boolean = false) => {
    const ruta = todas ? "/plantillas?estado=todas" : "/plantillas";
    const res = await axiosClient.get<PlantillaResponse[]>(ruta);
    return res.data;
  },

  crearPlantilla: async (nuevaPlantilla: CreatePlantilla) => {
    const res = await axiosClient.post("/plantillas", nuevaPlantilla);
    return res.data;
  },

  borrarPlantilla: async (idPlantilla: string) => {
    const res = await axiosClient.patch(`plantillas/${idPlantilla}/eliminar`);
    return res.data;
  },

  restaurarPlantilla: async (idPlantilla: string) => {
    const res = await axiosClient.patch(`plantillas/${idPlantilla}/restaurar`);
    return res.data;
  },

  modificarPlantilla: async (
    idPlantilla: string,
    datosNuevos: ModificarPlantilla,
  ) => {
    const res = await axiosClient.patch(
      `/plantillas/${idPlantilla}/modificar`,
      datosNuevos,
    );
    return res.data;
  },
};
