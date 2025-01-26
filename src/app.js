// Este archivo configura la aplicación principal de Express para el backend. 
// Aquí se incluyen middlewares como morgan, cors y cookie-parser, y se montan las rutas de autenticación y tareas.
// Esto actúa como el núcleo del servidor, manejando la configuración global y la integración de rutas.

// Importar módulos necesarios para configurar la aplicación
import express from 'express';  // Framework para construir aplicaciones web
import morgan from 'morgan';  // Middleware para registrar solicitudes HTTP
import dotenv from 'dotenv';  // Módulo para cargar variables de entorno desde un archivo .env
import cookieParser from 'cookie-parser'; // Middleware para analizar cookies
import cors from 'cors';  // Middleware para habilitar solicitudes de otros orígenes
import authRoutes from './routes/auth.routes.js';  // Rutas de autenticación
import taskRoutes from './routes/tasks.routes.js';  // Rutas de tareas
import { FRONTEND_URL } from './config.js';
// Crear una instancia de la aplicación Express
const app = express();  

// Configuración de CORS para permitir solicitudes desde el cliente
//const URL = process.env.NODE_ENV === 'production' ? 'https://gestor-de-tareas-vert.vercel.app' : 'http://localhost:5173';

app.use(cors({
    origin: FRONTEND_URL,  // Dominio permitido
    credentials: true  // Habilitar el envío de cookies en las solicitudes
}));

dotenv.config();  // Cargar variables de entorno desde un archivo .env

// Registrar solicitudes HTTP en la consola usando el formato 'dev'
app.use(morgan('dev'));

// Configurar Express para analizar cuerpos de solicitudes en formato JSON
app.use(express.json());

// Analizar cookies y convertirlas en objetos accesibles desde req.cookies
app.use(cookieParser());

// Montar rutas con un prefijo '/api'
app.use("/api", authRoutes);  // Rutas de autenticación
app.use("/api", taskRoutes);  // Rutas de tareas


// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware para servir archivos estáticos
app.use(express.static('client/dist'));

// Redirigir todas las demás solicitudes a React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Exportar la instancia de la aplicación Express
export default app;
