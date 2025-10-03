// models/Tarea.js
import mongoose from "mongoose";

const tareaSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            trim: true,
            required: true,
        },
        descripcion: {
            type: String,
            trim: true,
            required: true,
        },
        estado: {
            type: Boolean,
            default: false, // false: Incompleta, true: Completa
        },
        fechaEntrega: {
            type: Date,
            required: true,
            // Usar función para evaluar en tiempo de creación del documento
            default: Date.now,
        },
        prioridad: {
            type: String,
            required: true,
            enum: ["Baja", "Media", "Alta"], // Solo permite estos valores
        },
        creador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario", // Referencia al modelo Usuario
        },
    },
    {
        timestamps: true,
    }
);

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
