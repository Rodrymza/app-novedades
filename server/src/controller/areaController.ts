import { NextFunction, Request, RequestHandler, Response } from "express";
import Area from "../model/area";
import { AreaResponseData, ICreateArea } from "../interfaces/area.interface";
import { AreaMapper } from "../mappers/area.mapper";
import { FilterQuery } from "mongoose";
import { AppError } from "../errors/appError";

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
    const { todas } = req.query;
    const filtro: FilterQuery<any> = {};
    if (!todas) {
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
    const { id } = req.body;
    if (!id) {
      errores.push("Falta campo id de area a borrar");
    }
    const area = await Area.findByIdAndUpdate(id, { is_deleted: true });
    if (!area) {
      errores.push("No se encontro area con el id especificado");
    }
    if (errores.length > 0) {
      throw new AppError("Error al elminar area", 400, errores.join(", "));
    }
    return res
      .status(200)
      .json({ messsage: `Area ${area?.nombre} eliminada correctamente` });
  } catch (error) {}
};
