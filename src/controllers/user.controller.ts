import { Request, Response } from 'express';
import { UserService, RegisterData, LoginData } from '../services/user.service';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password }: RegisterData = req.body;

    // Validación básica
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos',
        requiredFields: ['firstName', 'lastName', 'email', 'password']
      });
    }

    // Validaciones adicionales
    if (firstName.trim().length < 2) {
      return res.status(400).json({ 
        message: 'El nombre debe tener al menos 2 caracteres' 
      });
    }

    if (lastName.trim().length < 2) {
      return res.status(400).json({ 
        message: 'El apellido debe tener al menos 2 caracteres' 
      });
    }

    if (password.length < 4) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 4 caracteres' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'El formato del correo electrónico no es válido' 
      });
    }

    const user = await UserService.register({ 
      firstName, 
      lastName, 
      email, 
      password 
    });

    const token = generateToken({ id: user._id, email: user.email });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error en registro:', error);
    
    // Manejar errores específicos de MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Ya existe un usuario registrado con este correo electrónico' 
      });
    }

    res.status(400).json({ 
      message: error.message || 'Error interno del servidor' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginData = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Correo electrónico y contraseña son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'El formato del correo electrónico no es válido' 
      });
    }

    const user = await UserService.login({ email, password });

    // Generar token
    const token = generateToken({ id: user._id, email: user.email });
    
    res.status(200).json({ 
      message: 'Login exitoso',
      token, 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    
    // Por seguridad, no revelamos si el email existe o no
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({ 
        message: 'Correo electrónico o contraseña incorrectos' 
      });
    }

    res.status(401).json({ 
      message: 'Correo electrónico o contraseña incorrectos' 
    });
  }
};

// Endpoint adicional para obtener perfil de usuario
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ 
        message: 'ID de usuario requerido' 
      });
    }

    const user = await UserService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({ 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

// Endpoint adicional para actualizar perfil
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({ 
        message: 'ID de usuario requerido' 
      });
    }

    // Validar que no se envíen campos vacíos
    const allowedFields = ['firstName', 'lastName', 'email'];
    const filteredData: any = {};
    
    for (const field of allowedFields) {
      if (updateData[field] && updateData[field].trim()) {
        filteredData[field] = updateData[field].trim();
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ 
        message: 'No se proporcionaron datos válidos para actualizar' 
      });
    }

    const user = await UserService.updateUser(userId, filteredData);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({ 
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error actualizando perfil:', error);
    res.status(400).json({ 
      message: error.message || 'Error interno del servidor' 
    });
  }
};