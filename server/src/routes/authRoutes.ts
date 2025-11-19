import { Router } from "express";
import { crearUsuario, loginUsuario } from "../controller/authController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const authRoutes = Router();

authRoutes.post("/register", validarToken, esSupervisor, crearUsuario)
authRoutes.post("/login", loginUsuario);

export default authRoutes;