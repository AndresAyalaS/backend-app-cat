import { register, login, getProfile, updateProfile } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { generateToken } from '../../src/utils/jwt';
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mocks
jest.mock('../src/services/user.service');
jest.mock('../src/utils/jwt');

describe('User Controller', () => {
  let res: Response;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 📝 TEST REGISTER
  describe('register', () => {
    it('should return 400 if missing fields', async () => {
      const req = { body: {} } as Request;
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should register user and return token', async () => {
      const req = {
        body: { firstName: 'John', lastName: 'Doe', email: 'john@test.com', password: '1234' }
      } as Request;

      const mockUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Mock required mongoose document methods/properties minimally
        $assertPopulated: jest.fn(),
        $clone: jest.fn(),
        $getAllSubdocs: jest.fn(),
        $ignore: jest.fn(),
        $isDefault: jest.fn(),
        $isDeleted: false,
        $isEmpty: jest.fn(),
        $isValid: jest.fn(),
        $locals: {},
        $markValid: jest.fn(),
        $model: jest.fn(),
        $op: '',
        $session: jest.fn(),
        $set: jest.fn(),
        $toObject: jest.fn(),
        $where: jest.fn(),
        depopulate: jest.fn(),
        directModifiedPaths: jest.fn(),
        equals: jest.fn(),
        errors: undefined,
        get: jest.fn(),
        id: '1',
        increment: jest.fn(),
        init: jest.fn(),
        invalidate: jest.fn(),
        isDirectModified: jest.fn(),
        isDirectSelected: jest.fn(),
        isInit: jest.fn(),
        isModified: jest.fn(),
        isSelected: jest.fn(),
        markModified: jest.fn(),
        modifiedPaths: jest.fn(),
        overwrite: jest.fn(),
        populate: jest.fn(),
        populated: jest.fn(),
        remove: jest.fn(),
        replaceOne: jest.fn(),
        save: jest.fn(),
        set: jest.fn(),
        toJSON: jest.fn(),
        toObject: jest.fn(),
        unmarkModified: jest.fn(),
        update: jest.fn(),
        updateOne: jest.fn(),
        validate: jest.fn(),
        validateSync: jest.fn(),
      } as any;

      (UserService.register as jest.MockedFunction<typeof UserService.register>).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue('mocked-token');

      await register(req, res);

      expect(UserService.register).toHaveBeenCalled();
      expect(generateToken).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mocked-token' }));
    });
  });

  // 📝 TEST LOGIN
  describe('login', () => {
    it('should return 400 if missing email or password', async () => {
      const req = { body: {} } as Request;
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should login and return token', async () => {
      const req = {
        body: { email: 'john@test.com', password: '1234' }
      } as Request;

      const mockUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Mock required mongoose document methods/properties minimally
        $assertPopulated: jest.fn(),
        $clone: jest.fn(),
        $getAllSubdocs: jest.fn(),
        $ignore: jest.fn(),
        $isDefault: jest.fn(),
        $isDeleted: false,
        $isEmpty: jest.fn(),
        $isValid: jest.fn(),
        $locals: {},
        $markValid: jest.fn(),
        $model: jest.fn(),
        $op: '',
        $session: jest.fn(),
        $set: jest.fn(),
        $toObject: jest.fn(),
        $where: jest.fn(),
        depopulate: jest.fn(),
        directModifiedPaths: jest.fn(),
        equals: jest.fn(),
        errors: undefined,
        get: jest.fn(),
        id: '1',
        increment: jest.fn(),
        init: jest.fn(),
        invalidate: jest.fn(),
        isDirectModified: jest.fn(),
        isDirectSelected: jest.fn(),
        isInit: jest.fn(),
        isModified: jest.fn(),
        isSelected: jest.fn(),
        markModified: jest.fn(),
        modifiedPaths: jest.fn(),
        overwrite: jest.fn(),
        populate: jest.fn(),
        populated: jest.fn(),
        remove: jest.fn(),
        replaceOne: jest.fn(),
        save: jest.fn(),
        set: jest.fn(),
        toJSON: jest.fn(),
        toObject: jest.fn(),
        unmarkModified: jest.fn(),
        update: jest.fn(),
        updateOne: jest.fn(),
        validate: jest.fn(),
        validateSync: jest.fn(),
        schema: {}, // add schema property if needed by your typings
        collection: {}, // add collection property if needed by your typings
        __v: 0
      } as any;

      (UserService.login as jest.MockedFunction<typeof UserService.login>).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue('mocked-token');

      await login(req, res);

      expect(UserService.login).toHaveBeenCalled();
      expect(generateToken).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mocked-token' }));
    });

    it('should handle invalid credentials', async () => {
      const req = {
        body: { email: 'john@test.com', password: 'wrong' }
      } as Request;

      (UserService.login as jest.MockedFunction<typeof UserService.login>).mockRejectedValue(new Error('Credenciales inválidas'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Correo electrónico o contraseña incorrectos'
      }));
    });
  });

  // 📝 TEST GET PROFILE
  describe('getProfile', () => {
    it('should return 400 if no userId param', async () => {
      const req = { params: {} } as Request;
      await getProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      const req = { params: { id: '123' } } as unknown as Request;
      (UserService.getUserById as jest.MockedFunction<typeof UserService.getUserById>).mockResolvedValue(null);
      await getProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return user profile', async () => {
      const req = { params: { id: '123' } } as unknown as Request;
      const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Mock required mongoose document methods/properties minimally
        $assertPopulated: jest.fn(),
        $clone: jest.fn(),
        $getAllSubdocs: jest.fn(),
        $ignore: jest.fn(),
        $isDefault: jest.fn(),
        $isDeleted: false,
        $isEmpty: jest.fn(),
        $isValid: jest.fn(),
        $locals: {},
        $markValid: jest.fn(),
        $model: jest.fn(),
        $op: '',
        $session: jest.fn(),
        $set: jest.fn(),
        $toObject: jest.fn(),
        $where: jest.fn(),
        depopulate: jest.fn(),
        directModifiedPaths: jest.fn(),
        equals: jest.fn(),
        errors: undefined,
        get: jest.fn(),
        id: '123',
        increment: jest.fn(),
        init: jest.fn(),
        invalidate: jest.fn(),
        isDirectModified: jest.fn(),
        isDirectSelected: jest.fn(),
        isInit: jest.fn(),
        isModified: jest.fn(),
        isSelected: jest.fn(),
        markModified: jest.fn(),
        modifiedPaths: jest.fn(),
        overwrite: jest.fn(),
        populate: jest.fn(),
        populated: jest.fn(),
        remove: jest.fn(),
        replaceOne: jest.fn(),
        save: jest.fn(),
        set: jest.fn(),
        toJSON: jest.fn(),
        toObject: jest.fn(),
        unmarkModified: jest.fn(),
        update: jest.fn(),
        updateOne: jest.fn(),
        validate: jest.fn(),
        validateSync: jest.fn(),
      } as any;
      (UserService.getUserById as jest.MockedFunction<typeof UserService.getUserById>).mockResolvedValue(mockUser);
      await getProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({ id: '123' })
      }));
    });
  });

  // 📝 TEST UPDATE PROFILE
  describe('updateProfile', () => {
    it('should return 400 if no userId param', async () => {
      const req = { params: {}, body: {} } as Request;
      await updateProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if no valid fields', async () => {
      const req = { params: { id: '123' }, body: {} } as unknown as Request;
      await updateProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      const req = { params: { id: '123' }, body: { firstName: 'Jane' } } as unknown as Request;
      (UserService.updateUser as jest.MockedFunction<typeof UserService.updateUser>).mockResolvedValue(null);
      await updateProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update user and return new data', async () => {
      const req = { params: { id: '123' }, body: { firstName: 'Jane' } } as unknown as Request;
      const mockUser = {
        _id: '123',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'hashedpassword',
        updatedAt: new Date(),
        // Mock required mongoose document methods/properties minimally
        $assertPopulated: jest.fn(),
        $clone: jest.fn(),
        $getAllSubdocs: jest.fn(),
        $ignore: jest.fn(),
        $isDefault: jest.fn(),
        $isDeleted: false,
        $isEmpty: jest.fn(),
        $isValid: jest.fn(),
        $locals: {},
        $markValid: jest.fn(),
        $model: jest.fn(),
        $op: '',
        $session: jest.fn(),
        $set: jest.fn(),
        $toObject: jest.fn(),
        $where: jest.fn(),
        depopulate: jest.fn(),
        directModifiedPaths: jest.fn(),
        equals: jest.fn(),
        errors: undefined,
        get: jest.fn(),
        id: '123',
        increment: jest.fn(),
        init: jest.fn(),
        invalidate: jest.fn(),
        isDirectModified: jest.fn(),
        isDirectSelected: jest.fn(),
        isInit: jest.fn(),
        isModified: jest.fn(),
        isSelected: jest.fn(),
        markModified: jest.fn(),
        modifiedPaths: jest.fn(),
        overwrite: jest.fn(),
        populate: jest.fn(),
        populated: jest.fn(),
        remove: jest.fn(),
        replaceOne: jest.fn(),
        save: jest.fn(),
        set: jest.fn(),
        toJSON: jest.fn(),
        toObject: jest.fn(),
        unmarkModified: jest.fn(),
        update: jest.fn(),
        updateOne: jest.fn(),
        validate: jest.fn(),
        validateSync: jest.fn(),
        createdAt: new Date(),
      } as any;
      (UserService.updateUser as jest.MockedFunction<typeof UserService.updateUser>).mockResolvedValue(mockUser);
      await updateProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Perfil actualizado exitosamente'
      }));
    });
  });
});
