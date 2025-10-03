import express from "express";
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

const router = express.Router();

// Validaciones para el registro
const registroValidationRules = [
  body("nombre", "El nombre es obligatorio").not().isEmpty().trim(),
  body("apellido", "El apellido es obligatorio").not().isEmpty().trim(),
  body("email", "Agrega un email válido").isEmail().normalizeEmail(),
  body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
];

// -- Área Pública -- //
router.post("/registrar", registroValidationRules, registrar); // Crea un nuevo usuario

router.post("/login", [
    body("email", "El email es obligatorio").isEmail().normalizeEmail(),
    body("password", "La contraseña es obligatoria").not().isEmpty()
], autenticar);

router.get("/confirmar/:token", confirmar); // Confirmar cuenta vía token
router.post("/olvide-password", olvidePassword); // Enviar token para resetear

// Agrupa las dos rutas que comparten la misma URL dinámica
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// -- Área Privada -- //
// Se necesita un JWT válido para acceder a esta ruta
router.get("/perfil", checkAuth, perfil);
router.put("/perfil", checkAuth, actualizarPerfil);
router.put("/actualizar-password-perfil", checkAuth, actualizarPasswordPerfil);

export default router;
