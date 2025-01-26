/* Este archivo define el modelo de datos para un usuario (User) utilizando Mongoose.
  Un usuario tiene un nombre de usuario, correo electrónico y contraseña.
  Además, se registran automáticamente las fechas de creación y última actualización mediante `timestamps`. */

  import mongoose from "mongoose";  // Importar mongoose para trabajar con la base de datos MongoDB


  // Definición del esquema para el modelo de usuario
  const userSchema = new mongoose.Schema(
      {
         // Campo para el nombre real del usuario
          realName: {
              type: String, // El tipo de dato es una cadena de texto
              required: true, // Este campo es obligatorio
              trim: true, // Elimina espacios en blanco al principio y al final del texto
          },
          // Campo para el apellido del usuario
          lastName: {
              type: String, // El tipo de dato es una cadena de texto
              required: true, // Este campo es obligatorio
              trim: true, // Elimina espacios en blanco al principio y al final del texto
          },
          // Campo para el correo electrónico del usuario
          email: {
              type: String, // El tipo de dato es una cadena de texto
              required: true, // Este campo es obligatorio
              trim: true, // Elimina espacios en blanco al principio y al final del texto
              unique: true, // Garantiza que no haya dos usuarios con el mismo correo
          },
          // Campo para el número de teléfono del usuario
          phoneNumber: {
              type: String, // El tipo de dato es una cadena de texto
              required: true, // Este campo es obligatorio
              trim: true, // Elimina espacios en blanco al principio y al final del texto
          },
          // Campo para la contraseña del usuario
          password: {
              type: String, // El tipo de dato es una cadena de texto
              required: true, // Este campo es obligatorio
          },
          // Campo para la palabra secreta del usuario
          secretWord: {
              type: String, // El tipo de dato es una cadena de texto
              required: true, // Este campo es obligatorio
              trim: true, // Elimina espacios en blanco al principio y al final del texto
          },
      },
      {
          timestamps: true, // Añade automáticamente campos 'createdAt' y 'updatedAt' para registrar fechas de creación y actualización
      }
  );
  // Exporta el modelo de usuario basado en el esquema definido
  export default mongoose.model('User', userSchema);
  