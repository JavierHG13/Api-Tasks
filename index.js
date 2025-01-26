// Importar dependencias
import app from './src/app.js';
import { connectDB } from './src/db.js'; 

// Conectar a la base de datos
connectDB();

const port = 3000;

// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
  });
  