import { NextFunction, Request, RequestHandler, Response } from "express";
import Area from "../model/area";
import { AreaResponseData, ICreateArea } from "../interfaces/area.interface";
import { AreaMapper } from "../mappers/area.mapper";
import { FilterQuery } from "mongoose";
import { AppError } from "../errors/appError";
import { JwtPayload } from "../interfaces/jwt.interfaces";
import { Rol } from "../interfaces/user.interfaces";

export const crearArea: RequestHandler<
  {},
  AreaResponseData,
  ICreateArea,
  {}
> = async (req, res, next) => {
  try {
    const { nombre, descripcion = "Sin descripcion proporcionada" } = req.body;

    if (!nombre || nombre.trim() == "") {
      return res
        .status(400)
        .json({ message: "Error al crear area", detail: "Falta nombre" });
    }

    const nombreNormalizado = nombre.trim();
    const descripcionNormalizada = descripcion.trim();

    const nombreDuplicado = await Area.exists({ nombre: nombreNormalizado });

    if (nombreDuplicado) {
      return res.status(400).json({
        message: "Error al crear area",
        detail: "El nombre ya existe en la base de datos",
      });
    }

    const nuevaArea = await Area.create({
      nombre: nombreNormalizado,
      descripcion: descripcionNormalizada,
    });

    const areaRes = AreaMapper.toDTO(nuevaArea);
    return res.status(201).json(areaRes);
  } catch (error) {
    next(error);
  }
};

export const findallAreas: RequestHandler = async (req, res, next) => {
  try {
    const mostrarTodas = req.query.todas == "true";
    const esSupervisor = req.user!.rol == Rol.SUPERVISOR;
    const filtro: FilterQuery<any> = {};
    if (!mostrarTodas || !esSupervisor) {
      filtro.is_deleted = false;
    }
    const areas = await Area.find(filtro).sort({ nombre: 1 });

    const areasFormateadas: AreaResponseData[] = areas.map((area) => {
      return AreaMapper.toDTO(area);
    });

    return res.status(200).json(areasFormateadas);
  } catch (error) {
    next(error);
  }
};

export const eliminarArea = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errores: string[] = [];
    const { id } = req.params;
    const supervisor = req.user! as JwtPayload;

    const area = await Area.findById(id);

    if (!area) {
      throw new AppError(
        "Error al borrar",
        400,
        "No se encontro area con el id especificado"
      );
    }

    if (area?.is_deleted) {
      errores.push("No puedes eliminar un area que ya se encuentra borrada");
    }

    if (errores.length > 0) {
      throw new AppError("Error al elminar area", 400, errores.join(", "));
    }

    area.is_deleted = true;
    await area.save();

    return res.status(200).json({
      messsage: `Area ${area?.nombre} eliminada correctamente`,
      area: AreaMapper.toDTO(area),
    });
  } catch (error) {
    next(error);
  }
};

export const restaurarArea = async (
  req: Request,
  res: Response<AreaResponseData>,
  next: NextFunction
) => {
  const { id } = req.params;

  const areaEncontrada = await Area.findById(id);

  if (!areaEncontrada) {
    throw new AppError(
      "Area no encontrada",
      404,
      "No se encontro un area con el id especificado"
    );
  }
  if (!areaEncontrada?.is_deleted) {
    throw new AppError(
      "Area activa",
      400,
      "No puede restaurarse un area activa"
    );
  }

  areaEncontrada.is_deleted = false;

  await areaEncontrada.save();

  return res.status(200).json(AreaMapper.toDTO(areaEncontrada));
};
