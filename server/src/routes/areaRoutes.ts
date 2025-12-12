import { Router } from "express";
import {
  crearArea,
  eliminarArea,
  findallAreas,
  restaurarArea,
} from "../controller/areaController";
import { esSupervisor, validarToken } from "../utils/tokenService";
import { validarIdMongo } from "../middlewares/validaciones.middleware";

const areaRoutes = Router();

areaRoutes.get("/", validarToken, findallAreas);
areaRoutes.post("/", validarToken, esSupervisor, crearArea);
areaRoutes.patch(
  "/:id/eliminar",
  validarToken,
  esSupervisor,
  validarIdMongo,
  eliminarArea
);
areaRoutes.patch(
  "/:id/restaurar",
  validarToken,
  esSupervisor,
  validarIdMongo,
  restaurarArea
);

export default areaRoutes;
