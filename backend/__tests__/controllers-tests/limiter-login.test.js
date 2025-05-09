// authController.test.js
const authController = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const JWT = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/authModel');
jest.mock('jsonwebtoken');
jest.mock('../../middlewares/Limiter', () => ({
  authlimiter: {
    resetKey: jest.fn()
  },
  serverLimiter: jest.fn()
}));

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      },
      ip: '127.0.0.1'
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  describe('Login', () => {
    test('should reset limiter key upon successful login', async () => {
      // Mock successful user login
      const mockUser = {
        id_member: 1,
        role: 'user',
        fullname: 'Test User'
      };
      authModel.LoginModel.mockResolvedValue(mockUser);
      
      // Mock JWT sign
      JWT.sign.mockReturnValueOnce('fake_access_token');
      JWT.sign.mockReturnValueOnce('fake_refresh_token');
      
      // Call the login function
      await authController.Login(req, res);
      
      // Assert authlimiter.resetKey was called with the correct IP
      const { authlimiter } = require('../../middlewares/Limiter');
      expect(authlimiter.resetKey).toHaveBeenCalledWith('127.0.0.1');
      
      // Verify other expected behaviors
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({message: "Connected Successfully !"});
    });

    test('should not reset limiter key when login fails', async () => {
      // Mock failed login (no user returned)
      authModel.LoginModel.mockResolvedValue(null);
      
      // Call the login function
      await authController.Login(req, res);
      
      // Assert authlimiter.resetKey was NOT called
      const { authlimiter } = require('../../middlewares/Limiter');
      expect(authlimiter.resetKey).not.toHaveBeenCalled();
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({message: "Email or Password is incorrect"});
    });

    test('should handle server errors properly', async () => {
      // Mock server error
      authModel.LoginModel.mockRejectedValue(new Error('Database error'));
      
      // Call the login function
      await authController.Login(req, res);
      
      // Assert authlimiter.resetKey was NOT called
      const { authlimiter } = require('../../middlewares/Limiter');
      expect(authlimiter.resetKey).not.toHaveBeenCalled();
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({message: "Server Error, Please try again later!"});
    });
  });
});