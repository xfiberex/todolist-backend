import express from "express";
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

// -- Área Pública -- //
router.post("/registrar", registrar); // Crea un nuevo usuario
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar); // Confirmar cuenta vía token
router.post("/olvide-password", olvidePassword); // Enviar token para resetear

// Agrupa las dos rutas que comparten la misma URL dinámica
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// -- Área Privada -- //
// Se necesita un JWT válido para acceder a esta ruta
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password-perfil", checkAuth, actualizarPasswordPerfil);

export default router;
