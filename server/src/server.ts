import app from "./app";
import connectDB from "./config/db";
import { crearSupervisorPorDefecto } from "./utils/initialSetup";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    console.log("📦 Base de datos conectada");

    await crearSupervisorPorDefecto();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error fatal al iniciar:", err);
    process.exit(1);
  }
})();
