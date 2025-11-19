import { RequestHandler } from "express";
import Area from "../model/area";
import { AreaResponseData, ICreateArea } from "../interfaces/area.interface";
import { AreaMapper } from "../mappers/area.mapper";

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
    const areas = await Area.find();

    const areasFormateadas: AreaResponseData[] = areas.map((area) => {
      return AreaMapper.toDTO(area);
    });

    return res.status(200).json(areasFormateadas);
  } catch (error) {
    next(error);
  }
};
