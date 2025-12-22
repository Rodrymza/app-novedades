import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import novedadRoutes from "./routes/novedadRoutes";
import areaRoutes from "./routes/areaRoutes";
import userRoutes from "./routes/userRoutes";
import { AppError } from "./errors/appError";
import { crearSupervisorPorDefecto } from "./utils/initialSetup";
dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (como Postman o scripts móviles)
      if (!origin) return callback(null, true);

      // Si el origen está en la lista permitida, o si incluimos la URL de vercel más tarde
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.includes(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("API del Libro de Novedades corriendo...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Servidor activo!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/novedades", novedadRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/usuarios", userRoutes);

app.use((req, res, next) => {
  next(
    new AppError(
      "Ruta no encontrada",
      404,
      `No existe la ruta: ${req.method} ${req.originalUrl}`
    )
  );
});

app.use(errorHandler);

(async () => {
  try {
    await connectDB();
    console.log("📦 Base de datos conectada");
    await crearSupervisorPorDefecto();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar la base de datos:", err);
    process.exit(1);
  }
})();
