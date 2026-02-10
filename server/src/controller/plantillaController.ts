import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import Plantilla from "../model/plantilla";
import { PrioridadNovedad } from "../interfaces/novedad.interface";
import { PlantillaMapper } from "../mappers/plantilla.mapper";
import { Rol } from "../interfaces/user.interfaces";
import { toTitleCase } from "../utils/user.validators";
import { sendSuccess } from "../utils/response";

export const crearPlantilla = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nombre, tags, contenido, prioridad } = req.body;

    if (!nombre?.trim() || !contenido?.trim()) {
      throw new AppError(
        "Datos incompletos",
        400,
        "Nombre y contenido son obligatorios",
      );
    }

    const nombreNormalizado = toTitleCase(nombre.trim());

    const prioridadValida = Object.values(PrioridadNovedad).includes(
      prioridad?.toUpperCase(),
    )
      ? prioridad.toUpperCase()
      : undefined;

    const tagsNormalizados =
      tags?.map((tag: string) => tag.toLowerCase().trim()) || [];

    const existe = await Plantilla.exists({ nombre: nombreNormalizado });
    if (existe) {
      throw new AppError(
        "Nombre duplicado",
        400,
        "Ya existe una plantilla con ese nombre",
      );
    }

    // 4. Creación
    const nuevaPlantilla = await Plantilla.create({
      nombre: nombreNormalizado,
      tags: tagsNormalizados,
      contenido: contenido.trim(),
      prioridad: prioridadValida,
    });

    return sendSuccess(
      res,
      PlantillaMapper.toDTO(nuevaPlantilla),
      "Plantilla creada con éxito",
    );
  } catch (error) {
    next(error);
  }
};

export const findAllPlantillas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { estado } = req.query;
    const esSupervisor = req.user!.rol == Rol.SUPERVISOR;

    const filtro: any = { is_deleted: false };

    if (esSupervisor) {
      if (estado === "eliminadas") {
        filtro.is_deleted = true;
      } else if (estado === "todas") {
        delete filtro.is_deleted;
      }
    }
    const plantillas = await Plantilla.find(filtro).sort({ createdAt: -1 });

    if (plantillas.length == 0) {
      return res.status(200).json("No existen plantillas cargadas");
    }

    const plantillasDTO = plantillas.map((plantilla) =>
      PlantillaMapper.toDTO(plantilla),
    );
    return res.status(200).json(plantillasDTO);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoPlantilla = (eliminar: boolean) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const plantilla = await Plantilla.findById(id);

      if (!plantilla) {
        throw new AppError(
          "Plantilla no encontrada",
          404,
          "No se encontró una plantilla con ese ID",
        );
      }

      // Si quiero eliminar (true) y ya está deleted (true) -> Error
      // Si quiero restaurar (false) y ya está activa (false) -> Error
      if (plantilla.is_deleted === eliminar) {
        const estadoActual = eliminar ? "eliminada" : "activa";
        throw new AppError(
          `Acción redundante`,
          400,
          `La plantilla ya se encuentra ${estadoActual}`,
        );
      }

      plantilla.is_deleted = eliminar;
      await plantilla.save();

      const accion = eliminar ? "eliminada" : "restaurada";

      return res.status(200).json({
        message: `Plantilla '${plantilla.nombre}' ${accion} correctamente`,
      });
    } catch (error) {
      next(error);
    }
  };
};

export const modificarPlantilla = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { nombre, tags, contenido, prioridad } = req.body;

    const plantillaEcontrada = await Plantilla.findById(id);

    if (!plantillaEcontrada) {
      throw new AppError(
        "Plantilla no encontrada",
        404,
        "No se encontro plantilla con el id especificado",
      );
    }

    if (nombre) plantillaEcontrada.nombre = toTitleCase(nombre.trim());
    if (tags) plantillaEcontrada.tags = tags;
    if (contenido) plantillaEcontrada.contenido.trim();
    if (prioridad) plantillaEcontrada.prioridad;

    return res.status(201).json(PlantillaMapper.toDTO(plantillaEcontrada));
  } catch (error) {
    next(error);
  }
};
