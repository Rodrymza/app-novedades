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
import { validarYFormatearDatos } from "../utils/user.validators";
import { hashearPassword } from "../utils/hashPassword";

export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Usuario.find().populate({
      path: "audit_delete.usuario_id",
      select: "nombre apellido username documento",
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
      .select("id nombre apellido documento")
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
  req: Request<{ id: string }, any, UserUpdateDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
      throw new AppError(
        "Sin datos",
        400,
        "No se enviaron datos para actualizar."
      );
    }

    // 2. BUSQUEDA INICIAL
    const usuarioAModificar = await Usuario.findById(id);

    if (!usuarioAModificar) {
      throw new AppError("Usuario no encontrado", 404, "El ID no existe.");
    }

    if (usuarioAModificar.is_deleted) {
      throw new AppError(
        "Acción denegada",
        400,
        "No se puede editar un usuario eliminado."
      );
    }

    // 3. VALIDACIÓN DE FORMATO Y LIMPIEZA (Aquí usamos la nueva función)
    // Esto nos devuelve un objeto limpio: { nombre: "Juan", apellido: "Perez", email: "..." }
    // Si algo falla, la función lanza el AppError automáticamente y salta al catch.
    const datosLimpios = validarYFormatearDatos(req.body);

    // 4. VALIDACIÓN DE NEGOCIO (Base de Datos)
    // Verificamos duplicidad de email SOLO si el email venía en el body y es diferente al actual
    if (datosLimpios.email && datosLimpios.email !== usuarioAModificar.email) {
      const emailExiste = await Usuario.exists({ email: datosLimpios.email });
      if (emailExiste) {
        throw new AppError(
          "Conflicto de datos",
          409,
          "El email ingresado ya está en uso por otro usuario."
        );
      }

      usuarioAModificar.email = datosLimpios.email;
    }

    if (
      datosLimpios.documento &&
      datosLimpios.documento !== usuarioAModificar.documento
    ) {
      const docExiste = await Usuario.exists({
        documento: datosLimpios.documento,
      });
      if (docExiste) {
        throw new AppError(
          "Conflicto de datos",
          409,
          "El documento ingresado ya está en uso por otro usuario."
        );
      }

      usuarioAModificar.documento = datosLimpios.documento;
    }

    // 5. ASIGNACIÓN Y GUARDADO
    if (datosLimpios.nombre) usuarioAModificar.nombre = datosLimpios.nombre;
    if (datosLimpios.apellido)
      usuarioAModificar.apellido = datosLimpios.apellido;
    if (datosLimpios.rol) usuarioAModificar.rol = datosLimpios.rol as Rol;

    await usuarioAModificar.save();

    return res.status(200).json(UsuarioMapper.toDto(usuarioAModificar));
  } catch (error) {
    next(error);
  }
};

export const restablecerContrasenia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const usuarioEncontrado = await Usuario.findById(id);

    if (!usuarioEncontrado) {
      throw new AppError(
        "Usuario no encontrado",
        404,
        "No se encontro un usuario con el id proporcionado"
      );
    }
    usuarioEncontrado.password = await hashearPassword(
      usuarioEncontrado.documento
    );
    await usuarioEncontrado.save();

    return res.status(200).json({
      message:
        "Contraseña restablecida correctamente, ahora el valor es el número de documento",
    });
  } catch (error) {
    next(error);
  }
};
