/* Este archivo define las rutas relacionadas con la autenticación y perfil de usuario en la aplicación.
  Utiliza `express.Router` para configurar las rutas y se asocian con las funciones correspondientes
  en el controlador de autenticación. Incluye validación de esquemas y middleware para proteger rutas. */

import { Router } from 'express';  // Importar Router de Express para definir las rutas de la aplicación
import { login, register, logout, profile, verifyToken,  verifyTokenReset, forgot_password, reset_password, verifyKeyword} from '../controllers/auth.controller.js';  // Importar las funciones de autenticación desde el controlador
import { authRequired } from '../middlewares/validateToken.js';  // Middleware para verificar que el usuario esté autenticado
import { validateSchema } from '../middlewares/validator.middlewar.js';  // Middleware para validar los datos enviados según un esquema
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';  // Esquemas de validación para registro e inicio de sesión

const router = Router();  // Crea una nueva instancia de Router

// Ruta para registrar un usuario
// - Método: POST
// - Middleware: Valida el esquema de datos para el registro (registerSchema)
// - Controlador: Ejecuta la función 'register' para registrar al usuario
router.post('/register', validateSchema(registerSchema), register);

// Ruta para iniciar sesión de un usuario
// - Método: POST
// - Middleware: Valida el esquema de datos para el inicio de sesión (loginSchema)
// - Controlador: Ejecuta la función 'login' para autenticar al usuario
router.post('/login', validateSchema(loginSchema), login);

// Ruta para cerrar sesión de un usuario
// - Método: POST
// - Controlador: Ejecuta la función 'logout' para cerrar la sesión
router.post('/logout', logout);

// Ruta para verificar la validez de un token
// - Método: GET
// - Controlador: Ejecuta la función 'verifyToken' para validar el token del usuario
router.get('/verify', verifyToken);


//Ruta para validar el token de recuperacion
router.get('/verifyToken/:token', verifyTokenReset);


// Ruta para obtener el perfil de un usuario
// - Método: GET
// - Middleware: 'authRequired' asegura que el usuario esté autenticado
// - Controlador: Ejecuta la función 'profile' para devolver la información del perfil del usuario
router.get('/profile', authRequired, profile);

//Ruta de tipo post para enviar el token de recuperación de contraseña
router.post('/forgot-password', forgot_password);

router.post('/verify-keyword', verifyKeyword)
//Ruta de tipo post para resetear la contraseña
router.post('/reset-password', reset_password)

// Exporta el router para que se pueda usar en otras partes de la aplicación
export default router;
