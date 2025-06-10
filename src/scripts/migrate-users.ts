import mongoose from "mongoose";
import { UserModel } from "../models/user.model"; // Ajusta la ruta si es diferente
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/catApp";

async function migrateUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    const oldUsers = await UserModel.find({ email: { $exists: false } });

    if (oldUsers.length === 0) {
      console.log("No hay usuarios para migrar");
      return;
    }

    for (const user of oldUsers) {
      const username = (user as any).username;

      if (!username) {
        console.warn(`Usuario sin username: ${user._id}`);
        continue;
      }

      const fakeEmail = `${username.toLowerCase()}@fakeemail.com`;
      const capitalized = username.charAt(0).toUpperCase() + username.slice(1);

      user.firstName = capitalized;
      user.lastName = "User";
      user.email = fakeEmail;

      (user as any).username = undefined;

      await user.save();
      console.log(`Usuario ${user._id} migrado`);
    }

    console.log("Migración completada");
  } catch (error) {
    console.error("Error en migración:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  }
}

migrateUsers();
