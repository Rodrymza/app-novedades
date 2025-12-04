import { Router } from "express";
import {
  eliminarUsuario,
  findAllUsers,
  getUsersList,
  restaurarUsuario,
} from "../controller/userController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const userRoutes = Router();

userRoutes.get("/", validarToken, esSupervisor, findAllUsers);
userRoutes.get("/user-list", validarToken, getUsersList);
userRoutes.put("/eliminar", validarToken, esSupervisor, eliminarUsuario);
userRoutes.put("/restaurar", validarToken, esSupervisor, restaurarUsuario);

export default userRoutes;
