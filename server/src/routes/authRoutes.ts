import { Router } from "express";
import {
  crearUsuario,
  getProfile,
  loginUsuario,
} from "../controller/authController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const authRoutes = Router();

authRoutes.post("/register", validarToken, esSupervisor, crearUsuario);
authRoutes.post("/login", loginUsuario);
authRoutes.get("/profile", validarToken, getProfile);

export default authRoutes;
