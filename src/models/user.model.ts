import { Document, Schema, model } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  firstName: { 
    type: String, 
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  lastName: { 
    type: String, 
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  email: { 
    type: String, 
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Por favor ingresa un correo electrónico válido'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es requerida'],
    minlength: [4, 'La contraseña debe tener al menos 4 caracteres']
  }
}, {
  timestamps: true, 
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password; 
      return ret;
    }
  }
});


UserSchema.index({ email: 1 });

export const UserModel = model<IUserDocument>('User', UserSchema);