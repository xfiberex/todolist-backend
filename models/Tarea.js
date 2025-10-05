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
            default: false, // false: incompleta, true: completa
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
            enum: ["Baja", "Media", "Alta"],
        },
        creador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
        },
    },
    {
        timestamps: true, // createdAt/updatedAt
    }
);

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
