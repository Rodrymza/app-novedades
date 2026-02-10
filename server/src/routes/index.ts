import { Router } from "express";
import authRoutes from "./authRoutes";
import novedadRoutes from "./novedadRoutes";
import areaRoutes from "./areaRoutes";
import userRoutes from "./userRoutes";
import plantillaRoutes from "./plantillaRoutes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/novedades", novedadRoutes);
apiRouter.use("/areas", areaRoutes);
apiRouter.use("/usuarios", userRoutes);
apiRouter.use("/plantillas", plantillaRoutes);

export default apiRouter;
