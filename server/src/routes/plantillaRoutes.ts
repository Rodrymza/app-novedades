import { Router } from "express";
import { esSupervisor, validarToken } from "../utils/tokenService";
import {
  cambiarEstadoPlantilla,
  crearPlantilla,
  findAllPlantillas,
  modificarPlantilla,
} from "../controller/plantillaController";

const plantillaRoutes = Router();

plantillaRoutes.get("/", validarToken, findAllPlantillas);
plantillaRoutes.post("/", validarToken, esSupervisor, crearPlantilla);
plantillaRoutes.patch(
  "/:id/modificar",
  validarToken,
  esSupervisor,
  modificarPlantilla
);

plantillaRoutes.patch(
  "/:id/eliminar",
  validarToken,
  esSupervisor,
  cambiarEstadoPlantilla(true)
);
plantillaRoutes.patch(
  "/:id/restaurar",
  validarToken,
  esSupervisor,
  cambiarEstadoPlantilla(false)
);

export default plantillaRoutes;
