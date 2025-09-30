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

// Todas las rutas de aquí en adelante requieren autenticación.
// El middleware 'checkAuth' se ejecutará antes de cada controlador.

// Rutas agrupadas para '/api/tareas'
router
    .route("/")
    .post(checkAuth, agregarTarea) // Crear una nueva tarea
    .get(checkAuth, obtenerTareas); // Obtener todas las tareas del usuario

// Rutas agrupadas para '/api/tareas/:id'
router
    .route("/:id")
    .get(checkAuth, obtenerTarea) // Obtener una tarea específica
    .put(checkAuth, actualizarTarea) // Actualizar una tarea específica
    .delete(checkAuth, eliminarTarea); // Eliminar una tarea específica

router.post("/estado/:id", checkAuth, cambiarEstadoTarea); // Cambiar el estado de una tarea

export default router;
