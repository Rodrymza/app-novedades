import { NextFunction, Request, Response } from "express";
import Usuario from "../model/usuario";
import { UsuarioMapper } from "../mappers/usuario.mapper";

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
    const users = await Usuario.find()
      .select("id nombre apellido")
      .sort({ apellido: 1 })
      .lean();
    res.status(200).json(users);
  } catch (error) {}
};
