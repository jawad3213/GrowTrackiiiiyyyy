
const mockLoginValidator = jest.fn((req, res, next) => next());
const mockEmailValidator = jest.fn((req, res, next) => next());

// Mock controllers and middleware
jest.mock('../../controllers/authController', () => ({
  Login: jest.fn((req, res) => res.sendStatus(200)),
  ResetPass: jest.fn((req, res) => res.sendStatus(200)),
  Logout: jest.fn((req, res) => res.sendStatus(200)),
  RefreshToken: jest.fn((req, res) => res.sendStatus(200)),
  check: jest.fn((req, res) => res.sendStatus(200)),
}));

jest.mock('../../middlewares/Limiter', () => ({
  Authlimiter: jest.fn((req, res, next) => next()),
}));

jest.mock('../../middlewares/VerifyToken', () => ({
  verifyToken: jest.fn((req, res, next) => next()),
}));

// Mock the validate middleware to return our test validators
jest.mock('../../middlewares/validate', () => {
  const validateModule = {
    validate: jest.fn((rules) => {
      if (rules === 'Login') {
        return mockLoginValidator;
      } else if (rules === 'Email') {
        return mockEmailValidator;
      }
      return jest.fn((req, res, next) => next());
    })
  };
  
  // Spy on the validate function to track calls
  jest.spyOn(validateModule, 'validate');
  return validateModule;
});

// Mock the auth rules
jest.mock('../../validators/authrules', () => ({
  Login: 'Login',
  Email: 'Email',
}));

const request = require('supertest');
const express = require('express');
const authController = require('../../controllers/authController');
const { Authlimiter } = require('../../middlewares/Limiter');
const { verifyToken } = require('../../middlewares/VerifyToken');
const { validate } = require('../../middlewares/validate');
const authRules = require('../../validators/authrules');

// This needs to be required AFTER all mocks are set up
const authRoutes = require('../../routes/AuthRoute');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);

    // Example error handler for testing
    app.use((err, req, res, next) => {
      res.status(500).json({ message: err.message });
    });
  });

  describe('Route Configuration', () => {
    it('should correctly apply validate middleware for login route', async () => {
      // Make a request to trigger the login route
      await request(app).post('/auth/login').send({});
      
      // Verify that mockLoginValidator was called, which proves the validate middleware is working
      expect(mockLoginValidator).toHaveBeenCalled();
    });

    it('should correctly apply validate middleware for reset-password route', async () => {
      // Make a request to trigger the reset-password route
      await request(app).post('/auth/reset-password').send({});
      
      // Verify that mockEmailValidator was called, which proves the validate middleware is working
      expect(mockEmailValidator).toHaveBeenCalled();
    });
  });

  describe('Request and Middleware Flow', () => {
    it('should apply Authlimiter middleware on /login', async () => {
      await request(app).post('/auth/login').send({});
      expect(Authlimiter).toHaveBeenCalled();
    });

    it('should apply Authlimiter middleware on /reset-password', async () => {
      await request(app).post('/auth/reset-password').send({});
      expect(Authlimiter).toHaveBeenCalled();
    });

    it('should invoke login validation and controller on /login', async () => {
      await request(app).post('/auth/login').send({});
      expect(mockLoginValidator).toHaveBeenCalled();
      expect(authController.Login).toHaveBeenCalled();
    });

    it('should invoke reset-password validation and controller on /reset-password', async () => {
      await request(app).post('/auth/reset-password').send({});
      expect(mockEmailValidator).toHaveBeenCalled();
      expect(authController.ResetPass).toHaveBeenCalled();
    });

    it('should invoke logout controller on /logout', async () => {
      await request(app).post('/auth/logout').send({});
      expect(authController.Logout).toHaveBeenCalled();
    });

    it('should invoke refresh controller on /refresh', async () => {
      await request(app).post('/auth/refresh').send({});
      expect(authController.RefreshToken).toHaveBeenCalled();
    });

    it('should invoke verifyToken middleware and check controller on /check', async () => {
      await request(app).get('/auth/check');
      expect(verifyToken).toHaveBeenCalled();
      expect(authController.check).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle error thrown in login validator', async () => {
      const error = new Error('Validation failed');
      mockLoginValidator.mockImplementationOnce((req, res, next) => next(error));

      const response = await request(app).post('/auth/login').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Validation failed' });
    });

    it('should handle error thrown in email validator', async () => {
      const error = new Error('Email validation failed');
      mockEmailValidator.mockImplementationOnce((req, res, next) => next(error));

      const response = await request(app).post('/auth/reset-password').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Email validation failed' });
    });

    it('should handle error thrown in Authlimiter', async () => {
      const error = new Error('Rate limit exceeded');
      Authlimiter.mockImplementationOnce((req, res, next) => next(error));

      const response = await request(app).post('/auth/login').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Rate limit exceeded' });
    });

    it('should handle error thrown in verifyToken', async () => {
      const error = new Error('Invalid token');
      verifyToken.mockImplementationOnce((req, res, next) => next(error));

      const response = await request(app).get('/auth/check');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should handle error thrown in controller Login', async () => {
      const error = new Error('Login failed');
      authController.Login.mockImplementationOnce((req, res, next) => { throw error; });

      const response = await request(app).post('/auth/login').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Login failed' });
    });

    it('should handle error thrown in controller ResetPass', async () => {
      const error = new Error('Reset failed');
      authController.ResetPass.mockImplementationOnce((req, res, next) => { throw error; });

      const response = await request(app).post('/auth/reset-password').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Reset failed' });
    });

    it('should handle error thrown in controller Logout', async () => {
      const error = new Error('Logout failed');
      authController.Logout.mockImplementationOnce((req, res, next) => { throw error; });

      const response = await request(app).post('/auth/logout').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Logout failed' });
    });

    it('should handle error thrown in controller RefreshToken', async () => {
      const error = new Error('Refresh failed');
      authController.RefreshToken.mockImplementationOnce((req, res, next) => { throw error; });

      const response = await request(app).post('/auth/refresh').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Refresh failed' });
    });

    it('should handle error thrown in controller check', async () => {
      const error = new Error('Check failed');
      authController.check.mockImplementationOnce((req, res, next) => { throw error; });

      const response = await request(app).get('/auth/check');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Check failed' });
    });
  });
});