import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUsuarioDocument } from "../model/usuario";
import { NextFunction, Request, Response } from "express";
import { getMessage } from "./getMessage";
import { JwtPayload } from "../interfaces/jwt.interfaces";

const secreto = process.env.JWT_SECRET;
const expiraEn = "2h";

if (!secreto) {
  throw new Error(
    "Ocurrio un error grave. JWT no esta correctamente definido en el archivo .env.!"
  );
}

export const generarToken = (user: IUsuarioDocument): string => {
  const payload: JwtPayload = {
    id: user._id.toString(),
    username: user.username,
    rol: user.rol,
  };

  return jwt.sign(payload, secreto!, { expiresIn: expiraEn });
};

export const validarToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({
      message: "Acceso no autorizado",
      detail: "No se proporciono un token (no autenticado)",
    });
  }
  try {
    const data = jwt.verify(token, secreto) as JwtPayload;
    req.user = data;
    next();
  } catch (error) {
    const errorMessage = getMessage(error);
    if (errorMessage === "TokenExpiredError") {
      return res.status(401).json({
        message: "Error de autenticacion",
        detail: "El token ingresado esta expirado",
      });
    }

    return res.status(401).json({
      message: "Error de autenticacion",
      error: "El token ingresado es invalido",
    });
  }
};

export const esSupervisor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res
      .status(401)
      .json({ mesage: "Acceso Denegado", detail: "No has iniciado sesion" });
  }
  if (req.user && req.user.rol == "SUPERVISOR") {
    next();
  } else {
    res.status(403).json({
      message: "Acceso Denegado",
      detail: "No tienes permisos de supervisor",
    });
  }
};
