import { Router } from "express";
import {
  eliminarUsuario,
  findAllUsers,
  getUsersList,
  modificarPerfil,
  restaurarUsuario,
} from "../controller/userController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const userRoutes = Router();

userRoutes.get("/", validarToken, esSupervisor, findAllUsers);
userRoutes.get("/user-list", validarToken, getUsersList);
userRoutes.patch("/:id/eliminar", validarToken, esSupervisor, eliminarUsuario);
userRoutes.patch(
  "/:id/restaurar",
  validarToken,
  esSupervisor,
  restaurarUsuario
);
userRoutes.patch("/:id/modificar", validarToken, esSupervisor, modificarPerfil);

export default userRoutes;
