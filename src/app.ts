import express from 'express';
import cors from 'cors';
import catRoutes from './routes/cat.routes';
import imageRoutes from './routes/image.routes';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './config/swagger';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/cats', catRoutes);
app.use('/images', imageRoutes);
app.use('/users', userRoutes);

// Swagger
setupSwagger(app);

export default app;
