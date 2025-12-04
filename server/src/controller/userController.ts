import { NextFunction, Request, Response } from "express";
import Usuario, { IUsuario } from "../model/usuario";
import { UsuarioMapper } from "../mappers/usuario.mapper";
import { AppError } from "../errors/appError";
import { JwtPayload } from "../interfaces/jwt.interfaces";
import { Rol, UserResponseData } from "../interfaces/user.interfaces";
import { Types } from "mongoose";

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

    const usuario = await Usuario.findById(id_usuario);

    if (!usuario) {
      throw new AppError(
        "Usuario no encontrado",
        404,
        "No se encontro un usuario con el id proporcionado"
      );
    }
    usuario.is_deleted = true;
    usuario.audit_delete = {
      fecha: new Date(),
      usuario_id: new Types.ObjectId(supervisor.id),
      motivo: motivo,
    };
    await usuario.save();

    usuario.populate("audit_delete.usuario_id", "nombre apellido");

    return res.status(200).json(UsuarioMapper.toDto(usuario));
  } catch (error) {
    next(error);
  }
};

export const restaurarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const user = req.user;
    if (!user) {
      throw new AppError(
        "Error de autenticacion",
        401,
        "Debes estar autenticado para realizar la operacion"
      );
    }
    if (user.rol != Rol.SUPERVISOR) {
      throw new AppError(
        "Error de permisos",
        403,
        "Solo los supervisores pueden realizar esta operacion"
      );
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      throw new AppError(
        "Error al buscar el usuario",
        404,
        "No se encontro la usuario con el id especificado"
      );
    }
    if (!usuario.is_deleted) {
      throw new AppError(
        "Error al restaurar",
        400,
        "No puedes restaurar un usuario activo"
      );
    }

    usuario.is_deleted = false;
    usuario.audit_delete = undefined;

    await usuario.save();

    return res.status(200).json(UsuarioMapper.toDto(usuario));
  } catch (error) {
    next(error);
  }
};
