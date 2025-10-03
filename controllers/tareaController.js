import Tarea from "../models/Tarea.js";

export const agregarTarea = async (req, res) => {
    const tarea = new Tarea(req.body);
    // Asignamos el creador de la tarea usando la información del usuario autenticado (del middleware)
    tarea.creador = req.usuario._id;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

export const obtenerTareas = async (req, res) => {
    // Buscamos todas las tareas donde el campo 'creador' coincida con el ID del usuario autenticado
    const tareas = await Tarea.find().where("creador").equals(req.usuario._id);
    res.json(tareas);
};

export const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido de Mongoose
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    const tarea = await Tarea.findById(id);
    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }

    // **Comprobación crucial**: Verificar que quien consulta la tarea es el creador
    if (tarea.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({ msg: error.message });
    }

    res.json(tarea);
};

export const actualizarTarea = async (req, res) => {
    const { id } = req.params;

    // 1. Validar que la tarea exista con ese ID
    const tarea = await Tarea.findById(id);

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }

    // 2. Validar que quien edita la tarea es el creador
    if (tarea.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({ msg: error.message });
    }

    // 3. Actualizar los campos
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const eliminarTarea = async (req, res) => {
    const { id } = req.params;

    // 1. Validar que la tarea exista con ese ID
    const tarea = await Tarea.findById(id);

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }

    // 2. Validar que quien elimina la tarea es el creador
    if (tarea.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({ msg: error.message });
    }

    // 3. Eliminar la tarea
    try {
        await tarea.deleteOne();
        res.json({ msg: "Tarea Eliminada Correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params;

    // 1. Validar que la tarea exista
    const tarea = await Tarea.findById(id).populate("creador");

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }

    // 2. Validar que quien cambia el estado es el creador
    if (tarea.creador._id.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({ msg: error.message });
    }

    // 3. Cambiar el estado y guardar
    tarea.estado = !tarea.estado;
    await tarea.save();

    // 4. Devolver la tarea actualizada al frontend
    res.json(tarea);
};
