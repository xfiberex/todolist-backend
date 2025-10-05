import express from "express";
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

// Rutas protegidas con checkAuth

// '/api/tareas'
router
    .route("/")
    .post(checkAuth, agregarTarea)
    .get(checkAuth, obtenerTareas);

// '/api/tareas/:id'
router
    .route("/:id")
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, actualizarTarea)
    .delete(checkAuth, eliminarTarea);

router.post("/estado/:id", checkAuth, cambiarEstadoTarea);

export default router;
