import { Router } from "express";
import {
  crearNovedad,
  eliminarNovedad,
  filtrarNovedades,
  findAllNovedades,
} from "../controller/novedadController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const novedadRoutes = Router();

novedadRoutes.get("/", validarToken, findAllNovedades);
novedadRoutes.post("/", validarToken, crearNovedad);
novedadRoutes.post("/filtrar", validarToken, filtrarNovedades);
novedadRoutes.put("/eliminar", validarToken, esSupervisor, eliminarNovedad);

export default novedadRoutes;
