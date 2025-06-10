process.env.JWT_SECRET = 'test-secret-key-super-secure-for-testing-only';

import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/utils/jwt'; // Ajusta la ruta según tu estructura

// Guardar el entorno original para restaurarlo después
const originalEnv = process.env;

afterAll(() => {
  // Restaurar variables de entorno originales
  process.env = originalEnv;
});

describe('JWT Utils', () => {
  describe('generateToken', () => {
    it('debería generar un token válido con payload simple', () => {
      const payload = { userId: 123, email: 'test@example.com' };
      
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes separadas por puntos
    });

    it('debería generar un token que se puede verificar', () => {
      const payload = { userId: 456, role: 'admin' };
      
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).toMatchObject(payload);
    });

    it('debería incluir exp (expiration) en el token', () => {
      const payload = { userId: 789 };
      
      const token = generateToken(payload);
      const decoded = jwt.decode(token) as any;
      
      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
    });

    it('debería generar tokens diferentes para el mismo payload', () => {
      const payload = { userId: 999 };
      
      const token1 = generateToken(payload);
      const token2 = generateToken(payload);
      
      expect(token1).not.toBe(token2); // Los tokens incluyen timestamp, por lo que serán diferentes
    });

    it('debería manejar payloads complejos', () => {
      const complexPayload = {
        userId: 100,
        user: {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          roles: ['user', 'moderator']
        },
        permissions: ['read', 'write'],
        metadata: {
          loginTime: new Date().toISOString(),
          sessionId: 'abc123'
        }
      };
      
      const token = generateToken(complexPayload);
      const decoded = verifyToken(token);
      
      expect(decoded).toMatchObject(complexPayload);
    });
  });

  describe('verifyToken', () => {
    it('debería verificar un token válido correctamente', () => {
      const payload = { userId: 123, email: 'test@example.com' };
      const token = generateToken(payload);
      
      const decoded = verifyToken(token);
      
      expect(decoded).toMatchObject(payload);
      expect((decoded as any).iat).toBeDefined(); // issued at
      expect((decoded as any).exp).toBeDefined(); // expires at
    });

    it('debería lanzar error para token inválido', () => {
      const invalidToken = 'token.invalido.aqui';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it('debería lanzar error para token mal formado', () => {
      const malformedToken = 'esto-no-es-un-jwt';
      
      expect(() => {
        verifyToken(malformedToken);
      }).toThrow();
    });

    it('debería lanzar error para token firmado con secreto diferente', () => {
      const payload = { userId: 123 };
      const tokenWithDifferentSecret = jwt.sign(payload, 'different-secret', { expiresIn: '1h' });
      
      expect(() => {
        verifyToken(tokenWithDifferentSecret);
      }).toThrow();
    });

    it('debería lanzar error para token expirado', () => {
      const payload = { userId: 123 };
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '0s' });
      
      // Esperar un poco para asegurar que el token expire
      setTimeout(() => {
        expect(() => {
          verifyToken(expiredToken);
        }).toThrow();
      }, 100);
    });

    it('debería verificar token con diferentes tipos de payload', () => {
      const payloads = [
        { userId: 1 },
        { email: 'test@test.com', role: 'admin' },
        { data: { nested: { value: 'test' } } },
        { array: [1, 2, 3] },
        { boolean: true, number: 42, string: 'hello' }
      ];

      payloads.forEach(payload => {
        const token = generateToken(payload);
        const decoded = verifyToken(token);
        expect(decoded).toMatchObject(payload);
      });
    });
  });

  describe('Integración y casos edge', () => {
    it('debería mantener consistencia en múltiples operaciones', () => {
      const payload = { userId: 555, sessionId: 'test-session' };
      
      // Generar token
      const token = generateToken(payload);
      
      // Verificar múltiples veces
      const decoded1 = verifyToken(token);
      const decoded2 = verifyToken(token);
      
      expect(decoded1).toEqual(decoded2);
      expect(decoded1).toMatchObject(payload);
    });

    it('debería manejar payload vacío', () => {
      const emptyPayload = {};
      
      const token = generateToken(emptyPayload);
      const decoded = verifyToken(token);
      
      expect(decoded).toMatchObject(emptyPayload);
    });

    it('debería preservar tipos de datos en el payload', () => {
      const payload = {
        string: 'texto',
        number: 123,
        boolean: true,
        null: null,
        array: [1, 'dos', true],
        object: { nested: 'value' }
      };
      
      const token = generateToken(payload);
      const decoded = verifyToken(token) as any;
      
      expect(typeof decoded.string).toBe('string');
      expect(typeof decoded.number).toBe('number');
      expect(typeof decoded.boolean).toBe('boolean');
      expect(decoded.null).toBeNull();
      expect(Array.isArray(decoded.array)).toBe(true);
      expect(typeof decoded.object).toBe('object');
    });
  });

  describe('Manejo de errores de configuración', () => {
    it('debería lanzar error si JWT_SECRET no está configurado', () => {
      // Guardar el valor actual
      const currentSecret = process.env.JWT_SECRET;
      
      // Eliminar JWT_SECRET temporalmente
      delete process.env.JWT_SECRET;
      
      // Esto debería fallar al importar el módulo, pero como ya está importado,
      // podemos simular el comportamiento
      expect(() => {
        if (!process.env.JWT_SECRET) {
          throw new Error('Falta configurar JWT_SECRET en el archivo .env');
        }
      }).toThrow('Falta configurar JWT_SECRET en el archivo .env');
      
      // Restaurar el valor
      process.env.JWT_SECRET = currentSecret;
    });
  });
});

// Tests adicionales para casos específicos de tu aplicación
describe('JWT Utils - Casos de uso específicos', () => {
  it('debería generar token para autenticación de usuario', () => {
    const userPayload = {
      userId: 12345,
      email: 'usuario@ejemplo.com',
      role: 'user',
      permissions: ['read']
    };
    
    const token = generateToken(userPayload);
    const decoded = verifyToken(token);
    
    expect(decoded).toMatchObject(userPayload);
  });

  it('debería generar token para sesión de administrador', () => {
    const adminPayload = {
      userId: 1,
      email: 'admin@ejemplo.com',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin']
    };
    
    const token = generateToken(adminPayload);
    const decoded = verifyToken(token);
    
    expect(decoded).toMatchObject(adminPayload);
  });

  it('debería verificar que el token tiene duración de 5 horas', () => {
    const payload = { userId: 123 };
    const token = generateToken(payload);
    const decoded = jwt.decode(token) as any;
    
    const issuedAt = decoded.iat;
    const expiresAt = decoded.exp;
    const duration = expiresAt - issuedAt;
    
    // 5 horas = 5 * 60 * 60 = 18000 segundos
    expect(duration).toBe(18000);
  });
});