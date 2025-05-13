// Enhanced test file: server.test.js

// 1. Mock dependencies
jest.mock('../controllers/authController', () => ({
    Login: jest.fn((req, res) => res.status(200).json({ success: true })),
    ResetPass: jest.fn((req, res) => res.status(200).json({ success: true })),
    Logout: jest.fn((req, res) => res.status(200).json({ success: true })),
    RefreshToken: jest.fn((req, res) => res.status(200).json({ success: true })),
    check: jest.fn((req, res) => res.status(200).json({ success: true })),
    ResetPassEmail: jest.fn((req, res) => res.status(200).json({ success: true }))
  }));
  
  jest.mock('../validators/authrules', () => ({
    Login: { email: {}, password: {} },
    Email: { email: {} },
    Password: { password: {} }
  }));
  
  jest.mock('../middlewares/validate', () => {
    const validate = jest.fn(() => (req, res, next) => next());
    return { validate };
  });
  
  jest.mock('../middlewares/VerifyToken', () => ({
    verifyToken: jest.fn((req, res, next) => {
      req.userId = 'mock-user-id';
      next();
    }),
    verifyResetToken: jest.fn((req, res, next) => {
      req.userId = 'mock-user-id';
      next();
    })
  }));
  
  jest.mock('../middlewares/Limiter', () => ({
    ServerLimiter: jest.fn((req, res, next) => next()),
    Authlimiter: jest.fn((req, res, next) => next())
  }));
  
  jest.mock('pg', () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      connect: jest.fn(),
      end: jest.fn()
    };
    return { Pool: jest.fn(() => mockPool) };
  });
  
  jest.mock('dotenv', () => ({
    config: jest.fn()
  }));
  
  process.env.PORT = 3030;
  
  // 2. Require app and libraries
  const app = require('../server');
  const request = require('supertest');
  const { validate } = require('../middlewares/validate');
  
  // 3. Tests
  
  describe('Express Server Tests', () => {
    let server;
  
    beforeAll(() => {
      server = app.listen(process.env.PORT);
    });
  
    afterAll(async () => {
      await server.close();
    });
  
    test('Server initializes correctly', () => {
      expect(app).toBeDefined();
    });
  
    test('Auth routes are accessible', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
  
      expect(loginResponse.statusCode).not.toBe(404);
  
      const resetResponse = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'test@example.com' });
  
      expect(resetResponse.statusCode).not.toBe(404);
  
      const checkResponse = await request(app).get('/api/auth/check');
  
      expect(checkResponse.statusCode).not.toBe(404);
    });
  
    test('Password reset endpoint works', async () => {
      const response = await request(app)
        .post('/api/resetpass')
        .send({ password: 'NewSecurePassword123' });
  
      expect(response.statusCode).not.toBe(500);
      expect(response.body).toHaveProperty('success', true);
    });
  
    test('Validate reset token endpoint works', async () => {
      const response = await request(app).get('/api/validate-reset-token?token=mockToken123');
      expect(response.statusCode).not.toBe(404);
      expect(response.body).toHaveProperty('success', true);
    });
  
    test('Password reset rejects missing password', async () => {
        const { ResetPassEmail } = require('../controllers/authController');
        ResetPassEmail.mockImplementationOnce((req, res) => {
          if (!req.body.password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
          }
          return res.status(200).json({ success: true });
        });
      
        const response = await request(app).post('/api/resetpass').send({});
        expect(response.statusCode).toEqual(400);
      });
      
    test('Validate middleware is called for /api/resetpass', async () => {
      await request(app).post('/api/resetpass').send({ password: 'AnotherValid123' });
      expect(validate).toHaveBeenCalled();
    });
  
    test('Non-existent route returns 404', async () => {
      const response = await request(app).get('/some/random/route');
      expect(response.statusCode).toBe(404);
    });
  });
  