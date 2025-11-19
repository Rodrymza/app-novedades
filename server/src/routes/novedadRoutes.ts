import { Router } from "express";
import { crearNovedad, filtrarNovedades, findAllNovedades } from "../controller/novedadController";

const novedadRoutes = Router();

novedadRoutes.get("/", findAllNovedades )
novedadRoutes.post("/", crearNovedad)
novedadRoutes.post("/filtrar", filtrarNovedades)

export default novedadRoutes;