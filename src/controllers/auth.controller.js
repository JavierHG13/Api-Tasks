/* Este archivo contiene los controladores relacionados con la autenticación de usuarios en una aplicación basada en Node.js y MongoDB.
Los controladores permiten registrar usuarios, iniciar sesión, cerrar sesión, verificar tokens JWT y obtener información del perfil del usuario autenticado.
Estos controladores interactúan con la base de datos y manejan las cookies para gestionar la autenticación y autorización. */

import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
import { transporter } from '../libs/nodemailer.js'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET, FRONTEND_URL } from '../config.js'

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
    const { email, password, username, realName, lastName, phoneNumber, secretWord } = req.body;

    try {
        // Verificar si el correo ya está en uso
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json(["Error al registrar. El correo ya está en uso."]);

        // Encriptar la contraseña antes de guardarla en la base de datos
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear un nuevo objeto usuario con los datos proporcionados
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            realName,
            lastName,
            phoneNumber,
            secretWord, 
        });

        // Guardar el usuario en la base de datos
        const userSaved = await newUser.save();

        // Crear un token JWT para autenticar al usuario
        const token = await createAccessToken({ id: userSaved._id });

        // Guardar el token en una cookie para mantener la sesión
        res.cookie('token', token);

        // Enviar al cliente los datos del usuario registrado (sin la contraseña ni la palabra secreta)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            realName: userSaved.realName,
            lastName: userSaved.lastName,
            phoneNumber: userSaved.phoneNumber,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });
    } catch (error) {
        // Manejo de errores: devolver un mensaje de error si algo falla
        res.status(500).json({ message: error.message });
    }
};

// Controlador para iniciar sesión de un usuario
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        // Buscar al usuario en la base de datos por su email
        const userFound = await User.findOne({ email })

        // Verificar si el usuario no existe
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, userFound.password)

        // Verificar si las contraseñas no coinciden
        if (!isMatch) return res.status(400).json(["Contraseña incorrecta"])

        // Crear un token JWT para autenticar al usuario
        const token = await createAccessToken({ id: userFound._id })

        // Guardar el token en una cookie para mantener la sesión
        res.cookie('token', token)

        // Enviar al cliente los datos del usuario logueado (sin la contraseña)
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        })
    } catch (error) {
        // Manejo de errores: devolver un mensaje de error si algo falla
        res.status(500).json({ message: error.message })
    }
}

// Controlador para cerrar sesión de un usuario
export const logout = (req, res) => {
    // Limpiar la cookie que contiene el token
    res.cookie('token', "", {
        expires: new Date(0) // Establecer la cookie con una fecha de expiración pasada
    })
    return res.sendStatus(200) // Responder con un estado exitoso
}

// Controlador para obtener la información del perfil de un usuario
export const profile = async (req, res) => {
    try {
        // Buscar al usuario por su ID obtenido del token
        const userFound = await User.findById(req.user.id)

        // Verificar si el usuario no existe
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        // Enviar los datos del usuario al cliente
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: error.message })
    }
}

// Controlador para verificar la validez del token de sesión
export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    // Verificar si el token no está presente
    if (!token) return res.status(401).json({ message: "No autorizado" })

    // Verificar la validez del token
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Token inválido" })

        // Buscar al usuario por su ID contenido en el token
        const userFound = await User.findById(user.id)

        // Verificar si el usuario no existe
        if (!userFound) return res.status(401).json({ message: "No autorizado" })

        // Enviar los datos del usuario al cliente
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        })
    })
}

//Verfica si el token es valido no regresa ningun dato al fronend
export const verifyTokenReset = async (req, res) => {
    
    const {token} = req.params;


    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);

        const user = await User.findById(decoded.id);

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ message: 'Token válido' });

    } catch (err) {
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
}

export const forgot_password = async (req, res) => {

    const { email } = req.body;
    
    if(!email) return res.status(400).json({ message: 'El correo es requerido' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ 
        message: 'Usuario encontrado'
    });
};

export const verifyKeyword = async (req, res) => {
    const { email, secretWord } = req.body;

    // Validación inicial
    if (!email) return res.status(400).json({ message: 'El correo es requerido' });
    if (!secretWord) return res.status(400).json({ message: 'La palabra clave es requerida' });

    try {
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'El usuario no existe' });

        // Verificar la palabra clave
        if (user.secretWord !== secretWord) {

            return res.status(401).json({ message: 'Palabra clave incorrecta' });
        }

        // Generar el token de recuperación
        const token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '1h' });

        // Construir la URL de recuperación de contraseña
        const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

        // Configurar las opciones del correo
        const mailOptions = {
            to: email,
            subject: 'Recuperación de contraseña',
            html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Este enlace es válido por 1 hora.</p>`,
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Correo de recuperación enviado' });

    } catch (error) {
        console.error('Error en verifyKeyword:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }


};

export const reset_password = async (req, res) => {
    const { token, newPassword } = req.body;

    if(!token || !newPassword) return res.status(400).json({ message: 'La nueva contraseña es requerida' });

    if(newPassword.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    
    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);

        console.log(decoded)

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const userUpdated = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        
        const mailOptions = {
            to: userUpdated.email,
            subject: 'Contraseña actualizada',
            html: `<p>Tu contraseña ha sido actualizada con éxito. <a href="${FRONTEND_URL}/login">Iniciar sesion</a></p>`,
        };

        await transporter.sendMail(mailOptions); //Enviar correco de confirmacion

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });

    } catch (err) {
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};
