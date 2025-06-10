import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || '';
    if (!uri) throw new Error('MONGO_URI no definido en .env');

    await mongoose.connect(uri, {
      dbName: 'catApp',
    });

    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};