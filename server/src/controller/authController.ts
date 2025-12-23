import { NextFunction, Request, RequestHandler, Response } from "express";
import Usuario from "../model/usuario";
import {
  CreateUserBody,
  LoginUser,
  Rol,
  UserResponse,
  UserResponseData,
} from "../interfaces/user.interfaces";
import { hashearPassword, validarPassword } from "../utils/hashPassword";
import { generarToken } from "../utils/tokenService";
import { UsuarioMapper } from "../mappers/usuario.mapper";
import { AppError } from "../errors/appError";
import { validarYFormatearDatos } from "../utils/user.validators";
import { JwtPayload } from "../interfaces/jwt.interfaces";

export const crearUsuario: RequestHandler<
  {},
  UserResponseData,
  CreateUserBody,
  {}
> = async (req, res, next) => {
  try {
    const { username, password, rol } = req.body;

    // Procesado de campos campos formateables (Nombre, Apellido, Email, Documento)
    const datosLimpios = validarYFormatearDatos(req.body);

    if (
      !datosLimpios.nombre ||
      !datosLimpios.apellido ||
      !datosLimpios.email ||
      !datosLimpios.documento
    ) {
      throw new AppError(
        "Faltan datos",
        400,
        "Nombre, apellido, email y documento son obligatorios."
      );
    }
    if (!username || !password) {
      throw new AppError(
        "Faltan datos",
        400,
        "El nombre de usuario y la contraseña son obligatorios."
      );
    }

    const userExists = await Usuario.findOne({
      $or: [
        { email: datosLimpios.email },
        { username: username },
        { documento: datosLimpios.documento },
      ],
    });

    if (userExists) {
      // Personalizamos el mensaje de error según qué campo chocó
      let message = "El usuario ya existe.";
      if (userExists.email === datosLimpios.email)
        message = `El email '${datosLimpios.email}' ya está registrado`;
      if (userExists.documento === datosLimpios.documento)
        message = `El documento '${datosLimpios.documento}' ya está registrado`;
      if (userExists.username === username)
        message = `El usuario '${username}' ya está en uso`;

      throw new AppError("Error de validacion", 409, message);
    }

    const hashedPassword = await hashearPassword(password);

    const user = await Usuario.create({
      // A. Datos Formateados (Capitalizados y limpios)
      apellido: datosLimpios.apellido,
      nombre: datosLimpios.nombre,
      email: datosLimpios.email,
      documento: datosLimpios.documento,

      // B. Datos Directos/Lógicos
      username: username,
      password: hashedPassword,
      rol: rol || Rol.OPERADOR, // Default si no envían rol
    });

    if (user) {
      return res.status(201).json(UsuarioMapper.toDto(user));
    } else {
      throw new AppError("Error interno", 500, "No se pudo crear el usuario");
    }
  } catch (error) {
    next(error);
  }
};

export const loginUsuario: RequestHandler<
  {},
  UserResponseData,
  LoginUser,
  {}
> = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ message: "Error de autenticacion", detail: "Falta usuario" });
    }
    if (!password) {
      return res.status(400).json({
        message: "Error de autenticacion",
        detail: "Falta contraseña",
      });
    }

    const usuario = await Usuario.findOne({ username });

    if (!usuario) {
      return res
        .status(400)
        .json({ message: "El usuario ingresado no existe" });
    }

    const contraseniaValida = await validarPassword(password, usuario.password);

    if (!contraseniaValida) {
      return res
        .status(401)
        .json({ message: "La contraseña ingresada es incorrecta" });
    }

    const token = generarToken(usuario);

    res.cookie("jwt", token, {
      httpOnly: true, //El JS del frontend no puede leerla
      secure: true, // Solo enviar por HTTPS en producción
      sameSite: "none", // Protección extra contra ataques CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 día (expira en 24 horas, igual que el token)
    });

    const responseData: UserResponse = UsuarioMapper.toDto(usuario);

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getProfile: RequestHandler<{}, UserResponseData, {}, {}> = async (
  req,
  res,
  next
) => {
  try {
    const userPayload = req.user;
    if (!userPayload) {
      return res.status(401).json({
        message: "Error de autenticacion",
        detail: "Usuario no logueado",
      });
    }

    const user_id = userPayload.id;
    const usuarioObtenido = await Usuario.findById(user_id);
    if (!usuarioObtenido) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const responseData: UserResponse = UsuarioMapper.toDto(usuarioObtenido);

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const logoutUsuario: RequestHandler<
  {},
  UserResponseData,
  {},
  {}
> = async (req, res, next) => {
  try {
    const userPayload = req.user;
    if (!userPayload) {
      res.status(401).json({
        message: "Error de autenticacion",
        detail: "Usuario no logueado",
      });
    }
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    next(error);
  }
};

export const actualizarContrasenia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as JwtPayload;
    const { passwordActual, passwordNuevo } = req.body;

    if (passwordActual == passwordNuevo) {
      throw new AppError(
        "Datos inválidos",
        400,
        "La nueva contraseña no puede ser igual a la actual."
      );
    }

    if (!passwordNuevo || !passwordActual) {
      throw new AppError(
        "Datos faltantes",
        400,
        "Faltan datos para actualizar la contraseña."
      );
    }

    const usuario = await Usuario.findById(user.id);

    if (!usuario) {
      throw new AppError(
        "Usuario no encontrado",
        404,
        "No se encontró el usuario."
      );
    }

    const passwordValido = await validarPassword(
      passwordActual,
      usuario.password
    );

    if (!passwordValido) {
      throw new AppError(
        "Contraseña incorrecta",
        401,
        "La contraseña actual no es correcta."
      );
    }

    usuario.password = await hashearPassword(passwordNuevo);
    await usuario.save();

    return res.status(200).json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    next(error);
  }
};
