import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    // Obtenemos la URI de las variables de entorno
    const mongoUri = process.env.MONGO_URI;
    console.log(mongoUri);

    if (!mongoUri) {
      throw new Error("MONGO_URI no está definida en el archivo .env");
    }
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
