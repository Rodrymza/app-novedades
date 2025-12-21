import { axiosClient } from "../api/axios";
import type { AreaResponse, CreateArea } from "../types/area.interface";

export const AreaService = {
  getAllAreas: async (todas: boolean): Promise<AreaResponse[]> => {
    const { data } = await axiosClient.get<AreaResponse[]>(
      `/areas${todas ? "?todas=true" : ""}`
    );
    return data;
  },

  crearArea: async (nuevaArea: CreateArea) => {
    const { data } = await axiosClient.post<AreaResponse>("/areas", nuevaArea);
    return data;
  },

  borrarArea: async (id: string) => {
    const { data } = await axiosClient.patch(`/areas/${id}/eliminar`, {});
    return data;
  },

  restaurarArea: async (id: string) => {
    const { data } = await axiosClient.patch(`/areas/${id}/restaurar`, {});
    return data;
  },

  actualizarArea: async (id: string, nuevosDatos: CreateArea) => {
    const { data } = await axiosClient.patch(
      `/areas/${id}/actualizar`,
      nuevosDatos
    );
    return data;
  },
};
