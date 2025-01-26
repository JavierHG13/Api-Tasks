// Este archivo configura la conexión a la base de datos MongoDB utilizando Mongoose.
// La función `connectDB` establece la conexión y maneja errores si la conexión falla.

import mongoose from "mongoose"; // Importar mongoose para trabajar con MongoDB
import { MONGODB_URI } from "./config.js"; // Importar la URI de la base de datos desde el archivo de configuración

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI); // Conectar a la base de datos 'merndb'
        console.log("MongoDB conectado"); // Mensaje de éxito al conectar
    } catch (error) {
        console.error("Error al conectar MongoDB:", error); // Mostrar el error si la conexión falla
    }
};
