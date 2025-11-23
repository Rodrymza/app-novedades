import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import novedadRoutes from "./routes/novedadRoutes";
import areaRoutes from "./routes/areaRoutes";
import { validarToken } from "./utils/tokenService";
import userRoutes from "./routes/userRoutes";
dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("API del Libro de Novedades corriendo...");
});

app.use("/api/auth", authRoutes);
app.use("/api/novedades", validarToken, novedadRoutes);
app.use("/api/areas", validarToken, areaRoutes);
app.use("/api/usuarios", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
