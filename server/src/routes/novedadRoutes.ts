import { Router } from "express";
import {
  crearNovedad,
  eliminarNovedad,
  filtrarNovedades,
  findAllNovedades,
  restaurarNovedad,
} from "../controller/novedadController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const novedadRoutes = Router();

novedadRoutes.get("/", validarToken, findAllNovedades);
novedadRoutes.post("/", validarToken, crearNovedad);
novedadRoutes.post("/filtrar", validarToken, filtrarNovedades);
novedadRoutes.patch(
  "/:id/eliminar",
  validarToken,
  esSupervisor,
  eliminarNovedad
);
novedadRoutes.patch(
  "/:id/restaurar",
  validarToken,
  esSupervisor,
  restaurarNovedad
);
export default novedadRoutes;
