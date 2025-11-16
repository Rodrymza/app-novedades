import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import usuarioRoutes from './routes/usuarioRoutes';
dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Permite peticiones desde el frontend (React)
app.use(express.json()); 


const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('API del Libro de Novedades corriendo...');
});

app.use("/api/users", usuarioRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});