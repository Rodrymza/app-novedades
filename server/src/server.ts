import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Permite peticiones desde el frontend (React)
app.use(express.json()); 


const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('API del Libro de Novedades corriendo...');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});