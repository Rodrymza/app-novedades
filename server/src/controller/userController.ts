import { NextFunction, Request, Response } from "express";
import Usuario, { IUsuario } from "../model/usuario";
import { UsuarioMapper } from "../mappers/usuario.mapper";
import { AppError } from "../errors/appError";
import { JwtPayload } from "../interfaces/jwt.interfaces";
import {
  Rol,
  UserResponseData,
  UserUpdateDTO,
} from "../interfaces/user.interfaces";
import { Types } from "mongoose";

export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Usuario.find().populate({
      path: "audit_delete.usuario_id",
      select: "nombre apellido username",
    });
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
    const { id } = req.params;
    const { motivo } = req.body;
    let errores: string[] = [];
    if (!supervisor) {
      throw new AppError(
        "Supervisor no autenticado",
        401,
        "Solo los supervisores autenticados pueden eliminar usuarios"
      );
    }

    if (!id) {
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
    if (id === supervisor.id) {
      throw new AppError(
        "Acción no permitida",
        403,
        "No puedes eliminar tu propia cuenta de usuario."
      );
    }

    const usuario = await Usuario.findById(id);

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
    const { id } = req.params;
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

export const modificarPerfil = async (
  req: Request<any, any, UserUpdateDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const usuario = req.user;
    const { apellido, nombre, email } = req.body;

    if (!usuario) {
      throw new AppError(
        "Error de autenticacion",
        401,
        "Debes estar logueado para cambiar tus datos"
      );
    }

    const hayDatosParaActualizar = nombre || apellido || email;

    if (!hayDatosParaActualizar) {
      throw new AppError(
        "Sin datos",
        400,
        "Debes enviar al menos un dato (nombre, apellido o email) para actualizar."
      );
    }

    const usuario_id = usuario.id;

    const usuarioAModificar = await Usuario.findById(usuario_id);

    if (!usuarioAModificar) {
      throw new AppError(
        "Error al buscar el usuario",
        404,
        "El id especificado no pertenece a ningun usuario"
      );
    }

    if (usuarioAModificar.is_deleted) {
      throw new AppError(
        "Error en usuario encontrado",
        400,
        "No puedes modificar los datos de un usuario eliminado"
      );
    }

    if (email && email !== usuarioAModificar.email) {
      const emailExiste = await Usuario.exists({ email });
      if (emailExiste) {
        throw new AppError(
          "Conflicto de datos",
          409,
          "El email ingresado ya está en uso por otro usuario."
        );
      }
      usuarioAModificar.email = email;
    }

    if (nombre) usuarioAModificar.nombre = nombre;
    if (apellido) usuarioAModificar.apellido = apellido;

    await usuarioAModificar.save();

    return res.status(200).json(UsuarioMapper.toDto(usuarioAModificar));
  } catch (error) {
    next(error);
  }
};
