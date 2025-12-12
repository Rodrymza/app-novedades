import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/appError";

export const validarIdMongo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(
      new AppError("ID inválido", 400, "El ID proporcionado no es válido")
    );
  }
  next();
};
