/* Este archivo define las rutas relacionadas con la gestión de tareas en la aplicación.
  Utiliza `express.Router` para configurar las rutas, las cuales están protegidas por un middleware de autenticación.
  También incluye validaciones de esquema y está vinculado a las funciones del controlador de tareas. */

import { Router } from 'express';  // Importar Router de Express para definir rutas
import { authRequired } from '../middlewares/validateToken.js';  // Middleware para verificar que el usuario esté autenticado
import {
    getTasks,       // Controlador para obtener todas las tareas del usuario
    getTask,        // Controlador para obtener una tarea específica
    createTask,     // Controlador para crear una nueva tarea
    updateTask,     // Controlador para actualizar una tarea existente
    deleteTask      // Controlador para eliminar una tarea
} from '../controllers/tasks.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js';  // Middleware para validar los datos según un esquema
import { createTaskSchema } from '../schemas/task.chema.js';  // Esquema de validación para la creación de tareas

const router = Router();  // Crea una nueva instancia de Router

// Ruta para obtener todas las tareas del usuario
// - Método: GET
// - Middleware: 'authRequired' asegura que el usuario esté autenticado
// - Controlador: 'getTasks' obtiene las tareas vinculadas al usuario autenticado
router.get('/tasks', authRequired, getTasks);

// Ruta para obtener una tarea específica por su ID
// - Método: GET
// - Middleware: 'authRequired' asegura que el usuario esté autenticado
// - Controlador: 'getTask' obtiene una tarea específica vinculada al usuario
router.get('/tasks/:id', authRequired, getTask);

// Ruta para crear una nueva tarea
// - Método: POST
// - Middlewares:
//   - 'authRequired' asegura que el usuario esté autenticado
//   - 'validateSchema(createTaskSchema)' valida los datos enviados según el esquema definido
// - Controlador: 'createTask' crea una nueva tarea para el usuario autenticado
router.post('/tasks', authRequired, validateSchema(createTaskSchema), createTask);

// Ruta para eliminar una tarea por su ID
// - Método: DELETE
// - Middleware: 'authRequired' asegura que el usuario esté autenticado
// - Controlador: 'deleteTask' elimina una tarea específica vinculada al usuario
router.delete('/tasks/:id', authRequired, deleteTask);

// Ruta para actualizar una tarea por su ID
// - Método: PUT
// - Middleware: 'authRequired' asegura que el usuario esté autenticado
// - Controlador: 'updateTask' actualiza una tarea específica vinculada al usuario
router.put('/tasks/:id', authRequired, updateTask);

// Exporta el router para que pueda ser utilizado en otras partes de la aplicación
export default router;
