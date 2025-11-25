import { Router } from "express";
import { crearArea, findallAreas } from "../controller/areaController";

const areaRoutes = Router();

areaRoutes.get("/", findallAreas);
areaRoutes.post("/", crearArea);

export default areaRoutes;