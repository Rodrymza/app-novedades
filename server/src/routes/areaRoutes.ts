import { Router } from "express";
import {
  crearArea,
  eliminarArea,
  findallAreas,
} from "../controller/areaController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const areaRoutes = Router();

areaRoutes.get("/", validarToken, findallAreas);
areaRoutes.post("/", validarToken, esSupervisor, crearArea);
areaRoutes.put("/eliminar", validarToken, esSupervisor, eliminarArea);

export default areaRoutes;
