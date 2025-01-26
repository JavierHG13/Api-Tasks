/* Este archivo contiene un middleware que verifica la autenticación del usuario mediante un JSON Web Token (JWT). 
  El middleware asegura que las rutas protegidas solo puedan ser accedidas por usuarios autenticados con un token válido.*/

import jwt from "jsonwebtoken";  // Importar el módulo para trabajar con JSON Web Tokens
import { TOKEN_SECRET } from '../config.js';  // Importar la clave secreta para verificar el token

// Middleware para verificar si el usuario está autenticado
export const authRequired = (req, res, next) => {
    const { token } = req.cookies;  // Obtener el token de las cookies del cliente

    // Verificar si no se encontró un token
    if (!token)
        return res.status(401).json({ message: "No token, authorization denied" });

    // Verificar la validez del token utilizando la clave secreta
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        // Si hay un error (por ejemplo, token inválido o expirado), retornar un error 403
        if (err) return res.status(403).json({ message: "Invalid token" });

        // Si el token es válido, asignar los datos del usuario al objeto de la solicitud
        req.user = user;

        // Pasar al siguiente middleware o controlador
        next();
    });
};
