import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import Usuario from "../model/usuario";
import {
  CreateUserBody,
  UserResponse,
  UserResponseData,
} from "../interfaces/user.interfaces";
import { getMessage } from "../utils/getMessage";

export const crearUsuario: RequestHandler<
  {}, // 1er Genérico: Params 
  UserResponseData, // 2do Genérico: Response Body
  CreateUserBody, // 3er Genérico: Request Body
  {} // 4to Genérico: Query
> = async (req, res) => {
  try {
    const { apellido, nombre, username, email, password, rol } = req.body;

    // ferificacion de usuario existente
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Usuario.create({
      apellido,
      nombre,
      username,
      email,
      password: hashedPassword,
      rol: rol || "OPERADOR",
    });

    if (user) {
      const responseData: UserResponse = {
        _id: user._id,
        apellido: user.apellido,
        nombre: user.nombre,
        username: user.username,
        email: user.email,
        rol: user.rol,
      };

      return res.status(201).json(responseData);
    } else {
      return res.status(400).json({ 
        message: "Datos de usuario inválidos"});
    }
  } catch (error) {
    console.error(error);
    const errorMessage = getMessage(error);
      return res
        .status(500)
        .json({
          message : "Error en el servidor",
          detail : errorMessage
        });
  }
};
