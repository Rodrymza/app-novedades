import { Router } from "express";
import {
  eliminarUsuario,
  findAllUsers,
  getUsersList,
} from "../controller/userController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const userRoutes = Router();

userRoutes.get("/", validarToken, esSupervisor, findAllUsers);
userRoutes.get("/user-list", validarToken, getUsersList);
userRoutes.delete("/", validarToken, esSupervisor, eliminarUsuario);

export default userRoutes;
