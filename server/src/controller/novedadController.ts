import { RequestHandler } from "express";
import Usuario from "../model/usuario";
import Area from "../model/area";
import Novedad from "../model/novedad";
import { NovedadMapper } from "../mappers/novedad.mapper";
import { FilterQuery } from "mongoose";
import {
  CreateNovedad,
  EliminarNovedad,
  FiltroNovedad,
  NovedadResponse,
  NovedadResponseData,
} from "../interfaces/novedad.interface";
import { Rol } from "../interfaces/user.interfaces";
import { AppError } from "../errors/appError";
import { validarObjectId } from "../utils/validateObjectId";

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
      throw new AppError(
        "Usuario no autenticado",
        401,
        "Debes estar autenticado para ver las novedades"
      );
    }

    if (!area) {
      throw new AppError(
        "Area no encontrada",
        404,
        "No se encontro el area con el id especificado"
      );
    }

    if (area.is_deleted) {
      throw new AppError(
        `Área ${area.nombre} elimininada`,
        400,
        "No se pueden generar novedades sobre áreas eliminadas"
      );
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
    const novedades = await Novedad.find({ is_deleted: false })
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
    const {
      usuario_id,
      area_id,
      tags,
      fechaInicio,
      fechaFin,
      textoBusqueda,
      is_deleted,
    } = req.body;

    const filtro: FilterQuery<any> = {};

    filtro.is_deleted = false;

    if (req.user?.rol === Rol.SUPERVISOR) {
      if (is_deleted !== undefined && is_deleted !== null) {
        filtro.is_deleted = is_deleted;
      } else {
        delete filtro.is_deleted;
      }
    }

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
      .populate("audit_delete.usuario_id", "apellido nombre username")
      .sort({ createdAt: -1 });

    const respuesta: NovedadResponse[] = novedades.map((novedad) => {
      return NovedadMapper.toDto(novedad);
    });
    return res.status(200).json(respuesta);
  } catch (error) {
    next(error);
  }
};

export const eliminarNovedad: RequestHandler<
  {},
  NovedadResponseData,
  EliminarNovedad,
  {}
> = async (req, res, next) => {
  const MENSAJE_ERROR = "Error de validación al eliminar la novedad";
  try {
    const { novedad_id, motivo } = req.body;
    const usuario_id = req.user?.id;
    let erroresValidacion: string[] = [];

    if (!usuario_id) erroresValidacion.push("Falta id de usuario");
    if (!novedad_id) erroresValidacion.push("Falta id de novedad");

    if (!motivo) erroresValidacion.push("Falta motivo de eliminacion");

    if (erroresValidacion.length > 0) {
      throw new AppError(MENSAJE_ERROR, 400, erroresValidacion.join(", "));
    }
    validarObjectId(usuario_id!, "usuario_id");
    validarObjectId(novedad_id, "novedad_id");

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      throw new AppError(
        "El usuario no existe",
        404,
        "No se encontro usuario con el id especificado"
      );
    }

    const novedad = await Novedad.findById(novedad_id);

    if (!novedad) {
      throw new AppError(
        "Novedad no existe",
        404,
        "No se encontro novedad con el id especificado"
      );
    }

    if (novedad.is_deleted) {
      throw new AppError(
        "Error de eliminacion",
        400,
        "La novedad ya se encuentra eliminada"
      );
    }
    const fecha = Date.now();

    const novedadActualizada = await Novedad.findByIdAndUpdate(
      novedad_id,
      {
        is_deleted: true,
        audit_delete: {
          fecha: fecha,
          usuario_id: usuario?._id,
          motivo: motivo,
        },
      },
      { new: true }
    )
      .populate("usuario", "nombre apellido username")
      .populate("area", "nombre")
      .populate("audit_delete.usuario_id", "nombre apellido username");

    if (!novedadActualizada) {
      throw new AppError(
        "No se pudo realizar la eliminacion. Novedad no encontrada",
        404,
        MENSAJE_ERROR
      );
    }
    const novedadRes = NovedadMapper.toDto(novedadActualizada);
    return res.status(201).json(novedadRes);
  } catch (error) {
    next(error);
  }
};
