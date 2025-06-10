import { IUserDocument, UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class UserService {
  static async register(userData: RegisterData): Promise<IUserDocument> {
    const { firstName, lastName, email, password } = userData;

    // Validar que todos los campos estén presentes
    if (!firstName || !lastName || !email || !password) {
      throw new Error('Todos los campos son requeridos');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del correo electrónico no es válido');
    }

    // Validar longitud de contraseña
    if (password.length < 4) {
      throw new Error('La contraseña debe tener al menos 4 caracteres');
    }

    // Validar longitud de nombres
    if (firstName.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (lastName.trim().length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      throw new Error('Ya existe un usuario registrado con este correo electrónico');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = new UserModel({ 
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword 
    });

    await user.save();
    return user;
  }

  static async login(loginData: LoginData) {
    const { email, password } = loginData;

    // Validar que todos los campos estén presentes
    if (!email || !password) {
      throw new Error('Correo electrónico y contraseña son requeridos');
    }

    // Buscar usuario por email
    const user = await UserModel.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Credenciales inválidas');
    }

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  static async getUserById(userId: string): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findById(userId).select('-password');
      return user;
    } catch (error) {
      throw new Error('Usuario no encontrado');
    }
  }

  static async getUserByEmail(email: string): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findOne({ 
        email: email.toLowerCase().trim() 
      }).select('-password');
      return user;
    } catch (error) {
      throw new Error('Usuario no encontrado');
    }
  }

  static async updateUser(userId: string, updateData: Partial<RegisterData>): Promise<IUserDocument | null> {
    try {
      // Si se está actualizando la contraseña, hashearla
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      // Si se está actualizando el email, verificar que no esté en uso
      if (updateData.email) {
        const existingUser = await UserModel.findOne({ 
          email: updateData.email.toLowerCase().trim(),
          _id: { $ne: userId }
        });
        
        if (existingUser) {
          throw new Error('Ya existe un usuario registrado con este correo electrónico');
        }
        
        updateData.email = updateData.email.toLowerCase().trim();
      }

      // Limpiar espacios en nombres si están presentes
      if (updateData.firstName) {
        updateData.firstName = updateData.firstName.trim();
      }
      if (updateData.lastName) {
        updateData.lastName = updateData.lastName.trim();
      }

      const user = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }
}