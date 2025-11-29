import { axiosClient } from "../api/axios";
import type {
  IDeleteUser,
  UserList,
  UserResponse,
} from "../types/user.interfaces";

export const UserService = {
  getUsers: async (): Promise<UserResponse[]> => {
    const response = await axiosClient.get<UserResponse[]>("/usuarios");
    return response.data;
  },
  getUserList: async () => {
    const respuesta = await axiosClient.get<UserList[]>("/usuarios/user-list/");
    return respuesta.data;
  },
  getProfile: async () => {
    const respuesta = await axiosClient.get<UserResponse>("/auth/profile");
    return respuesta.data;
  },
  deleteUser: async (reqEliminar: IDeleteUser) => {
    const respuesta = await axiosClient.put<UserResponse>(
      "/usuarios/eliminar",
      reqEliminar
    );
    return respuesta.data;
  },
};
