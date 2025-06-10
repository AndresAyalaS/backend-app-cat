import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../../src/models/user.model'; 
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserModel.deleteMany(); // Limpia usuarios después de cada prueba
});

describe('User Model', () => {
  it('should create a valid user', async () => {
    const validUser = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juanperez@example.com',
      password: '1234'
    };

    const user = await UserModel.create(validUser);

    expect(user.firstName).toBe(validUser.firstName);
    expect(user.lastName).toBe(validUser.lastName);
    expect(user.email).toBe(validUser.email);
    expect(user.password).toBe(validUser.password);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should fail without required fields', async () => {
    const invalidUser = {
      email: 'sinNombre@example.com',
      password: '1234'
    };

    let error;
    try {
      await UserModel.create(invalidUser);
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.firstName).toBeDefined();
    expect(error.errors.lastName).toBeDefined();
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      firstName: 'Luis',
      lastName: 'Gómez',
      email: 'luis@example.com',
      password: '1234'
    };

    await UserModel.create(userData);

    let error;
    try {
      await UserModel.create(userData);
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Error de índice único en MongoDB
  });

  it('should not expose password in JSON response', async () => {
    const userData = {
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana@example.com',
      password: '1234'
    };

    const user = await UserModel.create(userData);
    const jsonUser = user.toJSON();

    expect(jsonUser.password).toBeUndefined();
  });

  it('should validate email format', async () => {
    const invalidEmailUser = {
      firstName: 'Carlos',
      lastName: 'Martínez',
      email: 'correo-invalido',
      password: '1234'
    };

    let error;
    try {
      await UserModel.create(invalidEmailUser);
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.email.message).toMatch(/Por favor ingresa un correo electrónico válido/);
  });
});
