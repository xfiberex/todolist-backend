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

// Validaciones de registro
const registroValidationRules = [
  body("nombre", "El nombre es obligatorio").not().isEmpty().trim(),
  body("apellido", "El apellido es obligatorio").not().isEmpty().trim(),
  body("email", "Agrega un email válido").isEmail().normalizeEmail(),
  body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
];

// Pública
router.post("/registrar", registroValidationRules, registrar);

router.post("/login", [
    body("email", "El email es obligatorio").isEmail().normalizeEmail(),
    body("password", "La contraseña es obligatoria").not().isEmpty()
], autenticar);

router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// Privada (requiere JWT)
router.get("/perfil", checkAuth, perfil);
router.put("/perfil", checkAuth, actualizarPerfil);
router.put("/actualizar-password-perfil", checkAuth, actualizarPasswordPerfil);

export default router;
