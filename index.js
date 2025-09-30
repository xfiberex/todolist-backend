// index.js
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();

app.use(helmet());

app.use(express.json()); // Habilitar la lectura de JSON

dotenv.config(); // Para usar las variables de entorno

conectarDB(); // Conectar a la base de datos

// Configurar CORS
// Diminios permitidos
const whitelist = [process.env.FRONTEND_URL]; // URL de tu frontend

const corsOptions = {
    origin: function (origin, callback) {
    // En producción, el origen DEBE estar en la whitelist
    if (process.env.NODE_ENV === 'production') {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acceso no permitido por CORS"));
      }
    } else {
      // En desarrollo, permite Postman o similares
      callback(null, true);
    }
  },
};
app.use(cors(corsOptions));

// Aplicar a todas las rutas API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Limita cada IP a 50 peticiones por ventana de tiempo
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos",
});

app.use('/api', limiter);

// Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
