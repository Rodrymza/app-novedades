import { Response } from "express";
import { ApiResponse } from "../interfaces/response.interface";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Operación exitosa",
) => {
  const response: ApiResponse<T> = {
    success: true,
    message: message,
    data: data,
  };
  return res.status(200).json(response);
};

export const sendBadRequest = <T>(
  res: Response,
  data: T,
  message: string = "Error en la solicitud (datos incorrectos)",
) => {
  const response: ApiResponse<T> = {
    success: false,
    message: message,
    data: data,
  };
  return res.status(400).json(response);
};
