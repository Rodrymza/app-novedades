import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../interfaces/error.interface";
import { AppError } from "../errors/appError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error("ERROR 💥", err.stack);

  // Chequeo de Estabilidad de Express: Si la respuesta ya fue enviada, detenemos el flujo para evitar crash
  if (res.headersSent) {
    return next(err);
  }

  //  Valores por defecto
  let status = 500;
  let message = "Error interno del servidor";
  let detail = "Ocurrió un error desconocido";

  // Chequeo de Errores Controlados (AppError)
  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
    detail = err.detail;
  }

  // 4. Chequeo de Seguridad (JWT)
  else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    status = 401;
    message = "Error de autenticación";
    detail = "Token inválido o expirado. Por favor, vuelva a iniciar sesión.";
  }

  // Chequeo de Mongoose: Validación
  else if (err.name === "ValidationError") {
    status = 400;
    message = "Error de validacion";
    // Extrear detalles de los errores
    detail = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  // Chequeo de Mongoose: CastError
  else if (err.name === "CastError") {
    status = 400;
    message = "Formato de solicitud inválido";
    detail = `El identificador proporcionado para el campo '${err.path}' es incorrecto. Debe ser un ID válido.`;
  }

  // Chequeo de MongoDB: Duplicados (11000)
  else if (err.code === 11000) {
    status = 409; //
    message = "Conflicto de datos";

    try {
      const field = Object.keys(err.keyValue)[0];
      detail = `El campo '${field}' ya existe.`;
    } catch {
      detail = "Un campo único ya existe.";
    }
  }
  res.status(status).json({ message, detail });
};
