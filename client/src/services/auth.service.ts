import { axiosClient } from "../api/axios";
import type {
  CreateUserBody,
  IUpdatePassword,
  LoginUser,
  UserResponse,
} from "../types/user.interfaces";

export const AuthService = {
  login: async (credentials: LoginUser): Promise<UserResponse> => {
    const response = await axiosClient.post<UserResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  register: async (userData: CreateUserBody): Promise<UserResponse> => {
    const response = await axiosClient.post<UserResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  getProfile: async (): Promise<UserResponse> => {
    const response = await axiosClient.get<UserResponse>("/auth/profile"); // crear endpoint
    return response.data;
  },

  updatePassword: async (actualizarContrasenia: IUpdatePassword) => {
    const response = await axiosClient.patch(
      "/auth/actualizar-contrasenia",
      actualizarContrasenia
    );
    return response.data;
  },
};
