import { axiosClient } from "../api/axios";
import type {
  CreateNovedad,
  FiltroNovedad,
  NovedadResponse,
} from "../types/novedad.interface";

export const NovedadService = {
  getAllNovedades: async (): Promise<NovedadResponse[] | void> => {
    const novedades = await axiosClient.get<NovedadResponse[]>("/novedades");
    return novedades.data;
  },

  crearNovedad: async (nuevaNovedad: CreateNovedad) => {
    const novedad = await axiosClient.post<NovedadResponse>(
      "/novedades",
      nuevaNovedad
    );
    return novedad.data;
  },

  filtrarNovedades: async (filtro: FiltroNovedad) => {
    const respuesta = await axiosClient.post<NovedadResponse[]>(
      "/novedades/filtrar",
      filtro
    );
    return respuesta.data;
  },
  borrarNovedad: async (novedad_id: string, motivo: string) => {
    const body = { novedad_id, motivo };
    const respuesta = await axiosClient.put<NovedadResponse>(
      "/novedades/eliminar",
      body
    );
    return respuesta.data;
  },
};
