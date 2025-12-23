import { Router } from "express";
import {
  actualizarContrasenia,
  crearUsuario,
  getProfile,
  loginUsuario,
  logoutUsuario,
} from "../controller/authController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const authRoutes = Router();

authRoutes.post("/register", validarToken, esSupervisor, crearUsuario);
authRoutes.post("/login", loginUsuario);
authRoutes.get("/profile", validarToken, getProfile);
authRoutes.post("/logout", validarToken, logoutUsuario);
authRoutes.patch(
  "/actualizar-contrasenia",
  validarToken,
  actualizarContrasenia
);

export default authRoutes;
