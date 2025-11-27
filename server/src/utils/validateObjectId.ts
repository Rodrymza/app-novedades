import mongoose from "mongoose";
import { AppError } from "../errors/appError";

export function validarObjectId(id: string, fieldName = "id") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(
      "Error de validacion",
      400,
      `El ${fieldName} tiene un formato inválido`
    );
  }
}
