import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { AppError } from "./errors/appError";
import apiRouter from "./routes";

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
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("API Novedades Radiología corriendo..."));
app.get("/api/health", (req, res) => res.status(200).json({ status: "OK" }));

// RUTAS PRINCIPALES
app.use("/api", apiRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  next(
    new AppError(
      "Ruta no encontrada",
      404,
      `No existe: ${req.method} ${req.originalUrl}`,
    ),
  );
});

// Middleware Global de Errores
app.use(errorHandler);

export default app;
