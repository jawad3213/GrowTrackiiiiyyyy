// SOLUTION PART 1: Create specific mock middleware functions that we can track
const mockLoginValidator = jest.fn((req, res, next) => next());
const mockEmailValidator = jest.fn((req, res, next) => next());

jest.mock('../../controllers/authController', () => ({
  Login: jest.fn((req, res) => res.sendStatus(200)),
  ResetPass: jest.fn((req, res) => res.sendStatus(200)),
  Logout: jest.fn((req, res) => res.sendStatus(200)),
  RefreshToken: jest.fn((req, res) => res.sendStatus(200)),
  check: jest.fn((req, res) => res.sendStatus(200))
}));

jest.mock('../../middlewares/Limiter', () => ({
  Authlimiter: jest.fn((req, res, next) => next())
}));

jest.mock('../../middlewares/VerifyToken', () => ({
  verifyToken: jest.fn((req, res, next) => next())
}));

jest.mock('../../validators/authrules', () => ({
  Login: ['mockLoginRule'],
  Email: ['mockEmailRule']
}));

// SOLUTION PART 2: This is the key change - mock validate to return our specific mock functions
jest.mock('../../middlewares/validate', () => ({
  validate: jest.fn(rules => {
    if (Array.isArray(rules) && rules[0] === 'mockLoginRule') {
      return mockLoginValidator;
    } else if (Array.isArray(rules) && rules[0] === 'mockEmailRule') {
      return mockEmailValidator;
    }
    return jest.fn((req, res, next) => next());
  })
}));

// NOW import the remaining dependencies and the route file
const request = require('supertest');
const express = require('express');
const authController = require('../../controllers/authController');
const { Authlimiter } = require('../../middlewares/Limiter');
const { verifyToken } = require('../../middlewares/VerifyToken');
const { validate } = require('../../middlewares/validate');
const authRules = require('../../validators/authrules');

// Import the route file AFTER all mocks are set up
const authRoutes = require('../../routes/AuthRoute');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Reset mock call counts before each test
    jest.clearAllMocks();
    
    // Setup express app for testing
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });

  describe('Route Configuration', () => {
    it('should apply Authlimiter middleware to all routes', async () => {
      await request(app).post('/auth/login').send({});
      expect(Authlimiter).toHaveBeenCalled();
    });
    
    it('should define the login route with proper validation', async () => {
      // SOLUTION PART 3: Check if validate was called with the right rules BEFORE making the request
      expect(validate).toHaveBeenCalledWith(authRules.Login);
      
      // SOLUTION PART 4: Make the request and check if our specific middleware was called
      await request(app).post('/auth/login').send({});
      expect(mockLoginValidator).toHaveBeenCalled();
      expect(authController.Login).toHaveBeenCalled();
    });
    
    it('should define the reset-password route with proper validation', async () => {
      // SOLUTION PART 3: Check if validate was called with the right rules BEFORE making the request
      expect(validate).toHaveBeenCalledWith(authRules.Email);
      
      // SOLUTION PART 4: Make the request and check if our specific middleware was called
      await request(app).post('/auth/reset-password').send({});
      expect(mockEmailValidator).toHaveBeenCalled();
      expect(authController.ResetPass).toHaveBeenCalled();
    });
    
    // Rest of the tests remain largely unchanged
    it('should define the logout route', async () => {
      await request(app).post('/auth/logout').send({});
      expect(authController.Logout).toHaveBeenCalled();
    });
    
    it('should define the refresh token route', async () => {
      await request(app).post('/auth/refresh').send({});
      expect(authController.RefreshToken).toHaveBeenCalled();
    });
    
    it('should define the check route with token verification', async () => {
      await request(app).get('/auth/check');
      expect(verifyToken).toHaveBeenCalled();
      expect(authController.check).toHaveBeenCalled();
    });
  });

  // Rest of the tests remain unchanged
  describe('Request and Response Flow', () => {
    // Tests unchanged...
  });

  describe('Error Handling', () => {
    // Tests unchanged...
  });
});