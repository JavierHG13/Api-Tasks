// Este archivo define el esquema de validación para la creación de tareas utilizando la biblioteca Zod. 
// El esquema asegura que los datos enviados por el cliente para crear una tarea cumplan con los requisitos, 
// como la presencia de un título y una descripción válidos, y permite opcionalmente una fecha en formato de cadena.

// Importar Zod para definir y validar esquemas de datos
import { z } from 'zod';

// Esquema de validación para la creación de tareas
export const createTaskSchema = z.object({
    title: z.string({
        required_error: 'El título es requerido', // Mensaje de error si el título está vacío
    }),
    description: z.string({
        required_error: 'La descripción debe ser String', // Mensaje de error si la descripción no es una cadena
    }),
    date: z.string().datetime().optional(), // Campo opcional para la fecha en formato de cadena
});
