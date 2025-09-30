// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();

app.use(express.json()); // Habilitar la lectura de JSON

dotenv.config(); // Para usar las variables de entorno

conectarDB(); // Conectar a la base de datos

// Configurar CORS
// Diminios permitidos
const whitelist = [process.env.FRONTEND_URL]; // URL de tu frontend

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de Cors'));
    }
  },
};
app.use(cors(corsOptions));

// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});