import { Request, Response, NextFunction } from "express"; // <-- 1. Importa Request
import { ErrorResponse } from "../interfaces/error.interface";
import { AppError } from "../errors/appError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error(err.stack);
  let status = 500;
  let message = "Error interno del servidor";
  let detail = "Ocurrio un error desconocido";

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
    detail = err.detail;
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = "Error de validacion";
    detail = err.message;
  }

  if (err.code === 11000) {
    status = 409;
    message = "Conflicto de datos";

    try {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      detail = `El campo '${field}' con el valor '${value}' ya existe.`;
    } catch {
      detail = "Un campo único ya existe.";
    }
  }

  res.status(status).json({ message, detail });
};
