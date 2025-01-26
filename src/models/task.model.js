/* Este archivo define el modelo de datos para una tarea (Task) utilizando Mongoose.
  Una tarea tiene un título, descripción, fecha de creación y está asociada a un usuario.
  También se incluyen marcas de tiempo (timestamps) para registrar las fechas de creación y actualización automáticamente. */

import mongoose from "mongoose";

// Definir el esquema de la colección "tasks" en la base de datos
const taskSchema = new mongoose.Schema(
    {
        // Título de la tarea
        title: {
            type: String,  // El título debe ser un texto
            required: true,  // Este campo es obligatorio
        },
        // Descripción de la tarea
        description: {
            type: String,  // La descripción debe ser un texto
            required: true,  // Este campo es obligatorio
        },
        // Fecha asociada a la tarea
        date: {
            type: Date,  // La fecha debe ser un tipo de dato Date
            default: Date.now,  // Si no se proporciona, se establece la fecha actual por defecto
        },
        // Usuario asociado a la tarea
        user: {
            type: mongoose.Schema.Types.ObjectId,  // Referencia al ID de un documento en otra colección
            ref: 'User',  // Nombre de la colección referenciada
            required: true,  // Este campo es obligatorio
        },
    },
    {
        timestamps: true,  // Añade automáticamente campos "createdAt" y "updatedAt" al documento
    }
);

// Exportar el modelo "Task" basado en el esquema definido
export default mongoose.model('Task', taskSchema);
