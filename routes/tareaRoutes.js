import express from "express";
import { body, validationResult } from "express-validator";
import {
    agregarTarea,
    obtenerTareas,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstadoTarea,
} from "../controllers/tareaController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware para responder errores de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rutas protegidas con checkAuth

// '/api/tareas'
router
    .route("/")
    .post(
        checkAuth,
        [
            body("nombre").isString().trim().isLength({ min: 1, max: 100 }).withMessage("Nombre requerido (1-100)"),
            body("descripcion").isString().trim().isLength({ min: 1, max: 1000 }).withMessage("Descripción requerida (1-1000)"),
            body("prioridad").isIn(["Baja", "Media", "Alta"]).withMessage("Prioridad inválida"),
            body("fechaEntrega").optional().isISO8601().withMessage("Fecha inválida"),
        ],
        validate,
        agregarTarea
    )
    .get(checkAuth, obtenerTareas);

// '/api/tareas/:id'
router
    .route("/:id")
    .get(checkAuth, obtenerTarea)
    .put(
        checkAuth,
        [
            body("nombre").optional().isString().trim().isLength({ min: 1, max: 100 }),
            body("descripcion").optional().isString().trim().isLength({ min: 1, max: 1000 }),
            body("prioridad").optional().isIn(["Baja", "Media", "Alta"]),
            body("fechaEntrega").optional().isISO8601(),
        ],
        validate,
        actualizarTarea
    )
    .delete(checkAuth, eliminarTarea);

router.post("/estado/:id", checkAuth, cambiarEstadoTarea);

export default router;
