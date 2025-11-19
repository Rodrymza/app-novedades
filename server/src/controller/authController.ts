import { RequestHandler } from "express";
import Usuario from "../model/usuario";
import {
  CreateUserBody,
  LoginUser,
  UserResponse,
  UserResponseData,
} from "../interfaces/user.interfaces";
import { hashearPassword, validarPassword } from "../utils/hashPassword";
import { generarToken } from "../utils/tokenService";
import { UsuarioMapper } from "../mappers/usuario.mapper";

export const crearUsuario: RequestHandler<
  {}, // 1er Genérico: Params
  UserResponseData, // 2do Genérico: Response Body
  CreateUserBody, // 3er Genérico: Request Body
  {} // 4to Genérico: Query
> = async (req, res, next) => {
  try {
    const { apellido, nombre, username, email, password, rol } = req.body;

    // verificacion de usuario existente
    const userExists = await Usuario.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      const message =
        userExists.email === email
          ? "El email ya está registrado"
          : "El nombre de usuario ya está en uso";

      return res.status(400).json({
        message: "Error de validación",
        detail: message,
      });
    }
    const hashedPassword = await hashearPassword(password);

    const user = await Usuario.create({
      apellido,
      nombre,
      username,
      email,
      password: hashedPassword,
      rol: rol || "OPERADOR",
    });

    if (user) {
      const responseData: UserResponse = UsuarioMapper.toDto(user);

      return res.status(201).json(responseData);
    } else {
      return res.status(400).json({
        message: "Datos de usuario inválidos",
      });
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
      secure: process.env.NODE_ENV === "production", // Solo enviar por HTTPS en producción
      sameSite: "strict", // Protección extra contra ataques CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 día (expira en 24 horas, igual que el token)
    });

    const responseData: UserResponse = UsuarioMapper.toDto(usuario);

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};
