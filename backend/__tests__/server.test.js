// Mock everything we need directly in this file
// This must happen BEFORE requiring the server

// 1. Mock auth controller
jest.mock('../controllers/authController', () => ({
    Login: jest.fn((req, res) => res.status(200).json({ success: true })),
    ResetPass: jest.fn((req, res) => res.status(200).json({ success: true })),
    Logout: jest.fn((req, res) => res.status(200).json({ success: true })),
    RefreshToken: jest.fn((req, res) => res.status(200).json({ success: true })),
    check: jest.fn((req, res) => res.status(200).json({ success: true })),
    ResetPassEmail: jest.fn((req, res) => res.status(200).json({ success: true }))
  }));
  
  // 2. Mock auth rules
  jest.mock('../validators/authrules', () => ({
    Login: { email: {}, password: {} },
    Email: { email: {} },
    Password: { password: {} }
  }));
  
  // 3. Mock validation middleware
  jest.mock('../middlewares/validate', () => ({
    validate: jest.fn((rules) => (req, res, next) => next())
  }));
  
  // 4. Mock token verification middleware
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
  
  // 5. Mock rate limiters
  jest.mock('../middlewares/Limiter', () => ({
    ServerLimiter: jest.fn((req, res, next) => next()),
    Authlimiter: jest.fn((req, res, next) => next())
  }));
  
  // 6. Mock PostgreSQL
  jest.mock('pg', () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      connect: jest.fn(),
      end: jest.fn()
    };
    return { Pool: jest.fn(() => mockPool) };
  });
  
  // 7. Mock environment variables
  jest.mock('dotenv', () => ({
    config: jest.fn()
  }));
  process.env.PORT = 3030;
  
  // NOW we can require the server
  const app = require('../server');
  const request = require('supertest');
  
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
      
      const checkResponse = await request(app)
        .get('/api/auth/check');
        
      expect(checkResponse.statusCode).not.toBe(404);
    });
  
    test('Password reset endpoint works', async () => {
      const response = await request(app)
        .post('/api/resetpass')
        .send({ password: 'NewSecurePassword123' });
      
      // This might return different status codes depending on your implementation
      // The key is that it shouldn't throw an error
      expect(response.statusCode).not.toBe(500);
    });
  });