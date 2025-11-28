import { NextFunction, Request, Response } from "express";
import Usuario from "../model/usuario";
import { UsuarioMapper } from "../mappers/usuario.mapper";
import { AppError } from "../errors/appError";
import { JwtPayload } from "../interfaces/jwt.interfaces";

export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Usuario.find();
    const usersDto = users.map(UsuarioMapper.toDto);
    res.status(200).json(usersDto);
  } catch (error) {}
};

export const getUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Usuario.find({ is_deleted: false })
      .select("id nombre apellido")
      .sort({ apellido: 1 })
      .lean();
    res.status(200).json(users);
  } catch (error) {}
};

export const eliminarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supervisor = req.user! as JwtPayload;
    const { id_usuario, motivo } = req.body;
    let errores: string[] = [];
    if (!supervisor) {
      throw new AppError(
        "Supervisor no autenticado",
        401,
        "Solo los supervisores autenticados pueden eliminar usuarios"
      );
    }

    if (!id_usuario) {
      errores.push("El ID del usuario a eliminar es obligatorio.");
    }
    if (!motivo) {
      errores.push("El motivo de eliminacion es obligatorio.");
    }
    if (errores.length > 0) {
      throw new AppError(
        "Error de validacion",
        400,
        `Errores de validacion: ${errores.join(", ")}`
      );
    }
    if (id_usuario === supervisor.id) {
      throw new AppError(
        "Acción no permitida",
        403,
        "No puedes eliminar tu propia cuenta de usuario."
      );
    }
    const usuarioEliminado = await Usuario.findByIdAndUpdate(
      id_usuario,
      {
        is_deleted: true,
        audit_delete: {
          fecha: new Date(),
          usuario_id: supervisor.id,
          motivo: motivo,
        },
      },
      { new: true }
    ).populate("audit_delete.usuario_id", "nombre apellido");

    if (!usuarioEliminado) {
      throw new AppError(
        "Usuario no encontrado",
        404,
        `No se encontró el usuario con ID: ${id_usuario}`
      );
    }
    return res.status(200).json(UsuarioMapper.toDto(usuarioEliminado));
  } catch (error) {
    next(error);
  }
};
