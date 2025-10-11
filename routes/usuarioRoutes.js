import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    actualizarPerfil,
    actualizarPasswordPerfil,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/authMiddleware.js";
import { requirePublicRegistrationEnabled, requireForgotPasswordEnabled } from "../middleware/featureFlags.js";

const router = express.Router();
// Rate limiters específicos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde.",
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: Number(process.env.RATE_LIMIT_FORGOT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas solicitudes de recuperación. Intenta de nuevo más tarde.",
});

// Validaciones de registro
const registroValidationRules = [
  body("nombre", "El nombre es obligatorio").not().isEmpty().trim(),
  body("apellido", "El apellido es obligatorio").not().isEmpty().trim(),
  body("email", "Agrega un email válido").isEmail().normalizeEmail(),
  body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
];

// Pública
router.post("/registrar", requirePublicRegistrationEnabled, registroValidationRules, registrar);

router.post("/login", loginLimiter, [
    body("email", "El email es obligatorio").isEmail().normalizeEmail(),
    body("password", "La contraseña es obligatoria").not().isEmpty()
], autenticar);

router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", requireForgotPasswordEnabled, forgotLimiter, olvidePassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// Privada (requiere JWT)
router.get("/perfil", checkAuth, perfil);
router.put("/perfil", checkAuth, actualizarPerfil);
router.put("/actualizar-password-perfil", checkAuth, actualizarPasswordPerfil);

export default router;
