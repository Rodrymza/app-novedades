import { RequestHandler } from "express";
import Usuario from "../model/usuario";
import Area from "../model/area";
import Novedad from "../model/novedad";
import { NovedadMapper } from "../mappers/novedad.mapper";
import { FilterQuery } from "mongoose";
import {
  CreateNovedad,
  FiltroNovedad,
  NovedadResponseData,
} from "../interfaces/novedad.interface";

export const crearNovedad: RequestHandler<
  {},
  NovedadResponseData,
  CreateNovedad,
  {}
> = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "No autorizado",
        detail: "Debes estar autenticado para crear una novedad",
      });
    }

    const { contenido, area_id, etiquetas } = req.body;
    const user_id = req.user.id;

    if (!contenido || contenido.trim() === "") {
      return res.status(400).json({
        message: "Error de contenido",
        detail: "El contenido no puede estar vacío",
      });
    }

    if (!area_id) {
      return res.status(400).json({
        message: "Error de área",
        detail: "El ID del área es requerido",
      });
    }

    if (contenido.length > 5000) {
      return res.status(400).json({
        message: "Error de contenido",
        detail: "El contenido no puede exceder 5000 caracteres",
      });
    }

    const contenidoEtiquetas: string[] = etiquetas || [];

    const [usuario, area] = await Promise.all([
      Usuario.findById(user_id),
      Area.findById(area_id),
    ]);

    if (!usuario) {
      return res.status(404).json({
        message: "Error de usuario",
        detail: "No se encontró un usuario con el id especificado",
      });
    }

    if (!area) {
      return res.status(404).json({
        message: "Error de área",
        detail: "No se encontró un área con el id especificado",
      });
    }

    const nuevaNovedad = await Novedad.create({
      contenido: contenido.trim(),
      usuario: user_id,
      area: area_id,
      etiquetas: contenidoEtiquetas,
    });

    const novedadPoblada = await nuevaNovedad.populate([
      { path: "usuario", select: "apellido nombre username" },
      { path: "area", select: "nombre" },
    ]);

    const novedadRespuesta = NovedadMapper.toDto(novedadPoblada);
    return res.status(201).json(novedadRespuesta);
  } catch (error) {
    next(error);
  }
};

export const findAllNovedades: RequestHandler = async (req, res, next) => {
  try {
    const novedades = await Novedad.find()
      .populate("usuario", "nombre apellido username")
      .populate("area", "nombre")
      .sort({ createdAt: -1 });

    const novedadesFormateadas = novedades.map((novedad) => {
      return NovedadMapper.toDto(novedad);
    });
    return res.status(200).json(novedadesFormateadas);
  } catch (error) {
    next(error);
  }
};

export const filtrarNovedades: RequestHandler<
  {},
  NovedadResponseData[],
  FiltroNovedad, // Ahora incluye textoBusqueda
  {}
> = async (req, res, next) => {
  try {
    const { usuario_id, area_id, tags, fechaInicio, fechaFin, textoBusqueda } =
      req.body;

    const filtro: FilterQuery<any> = {};

    //Logica de texto libre
    if (textoBusqueda) {
      filtro.$text = { $search: textoBusqueda };
    }

    // Lógica de Rango de Fechas
    if (fechaInicio || fechaFin) {
      filtro.createdAt = {};

      if (fechaInicio) {
        const [y, m, d] = fechaInicio.split("-");
        filtro.createdAt.$gte = new Date(
          parseInt(y),
          parseInt(m) - 1,
          parseInt(d)
        );
      }

      if (fechaFin) {
        const [y, m, d] = fechaFin.split("-");
        const fecha = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        fecha.setHours(23, 59, 59, 999);
        filtro.createdAt.$lte = fecha;
      }
    }

    if (usuario_id) {
      filtro.usuario = usuario_id;
    }
    if (area_id) {
      filtro.area = area_id;
    }
    if (tags && tags.length > 0) {
      filtro.etiquetas = { $in: tags };
    } // 3. Ejecutamos la consulta

    const novedades = await Novedad.find(filtro)
      .populate("usuario", "nombre apellido username")
      .populate("area", "nombre")
      .sort({ createdAt: -1 });

    const respuesta = novedades.map((novedad) => {
      return NovedadMapper.toDto(novedad);
    });
    return res.status(200).json(respuesta);
  } catch (error) {
    next(error);
  }
};
