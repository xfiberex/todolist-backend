// index.js
import 'dotenv/config';
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import startCleanupDemoTasks from "./helpers/cleanupDemoTasks.js";

const app = express();

// Helmet básico siempre
app.use(helmet());
// CSP opcional para despliegues con UI controlada
if (process.env.ENABLE_CSP === '1') {
    app.use(
        helmet.contentSecurityPolicy({
            useDefaults: true,
            directives: {
                // Ajusta estas fuentes según tu hosting y necesidades
                "default-src": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'"],
                "style-src": ["'self'", "'unsafe-inline'"],
                "img-src": ["'self'", "data:"],
                "connect-src": ["'self'", process.env.FRONTEND_URL],
            },
        })
    );
}

app.use(express.json()); // Habilitar la lectura de JSON

conectarDB(); // Conectar a la base de datos

startCleanupDemoTasks(); // Iniciar tareas programadas después de establecer conexión a DB

// CORS (permitir sólo orígenes confiables en producción)
const whitelist = [process.env.FRONTEND_URL].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (como Postman) o desde el mismo servidor
        if (!origin) return callback(null, true);

        // En producción, el origen DEBE estar en la whitelist
        if (process.env.NODE_ENV === 'production') {
            if (whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Acceso no permitido por CORS"));
            }
        } else {
            // En desarrollo, permite cualquier origen
            callback(null, true);
        }
    },
};
app.use(cors(corsOptions));

// Rate limit API (50 req/15min por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos",
});

// Si hay proxy (ej. despliegues como Render/Heroku), confiar en el primer proxy
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use('/api', limiter);

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
