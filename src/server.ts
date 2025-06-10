import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
  });
});