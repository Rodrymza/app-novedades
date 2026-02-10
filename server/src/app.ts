import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { AppError } from "./errors/appError";
import apiRouter from "./routes";

const app = express();

app.use(
  cors({
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
