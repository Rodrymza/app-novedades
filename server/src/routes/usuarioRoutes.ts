import { Router } from "express";
import { crearUsuario } from "../controller/usuarioController";

const usuarioRoutes = Router();

usuarioRoutes.post("/", crearUsuario)

export default usuarioRoutes;