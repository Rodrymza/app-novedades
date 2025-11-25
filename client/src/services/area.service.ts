import { axiosClient } from "../api/axios";
import type { AreaResponse, CreateArea } from "../types/area.interface";

export const AreaService = {
  getAllAreas: async (): Promise<AreaResponse[]> => {
    const { data } = await axiosClient.get<AreaResponse[]>("/areas");
    return data;
  },

  crearArea: async (nuevaArea: CreateArea) => {
    const { data } = await axiosClient.post<AreaResponse>("/areas", nuevaArea);
    return data;
  },
};
