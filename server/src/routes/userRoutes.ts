import { Router } from "express";
import { findAllUsers, getUsersList } from "../controller/userController";
import { esSupervisor, validarToken } from "../utils/tokenService";

const userRoutes = Router();

userRoutes.get("/", validarToken, esSupervisor, findAllUsers);
userRoutes.get("/user-list", validarToken, getUsersList);

export default userRoutes;
