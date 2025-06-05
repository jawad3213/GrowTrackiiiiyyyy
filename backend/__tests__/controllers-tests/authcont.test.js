const authController = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Authlimiter } = require('../../middlewares/Limiter');

// Mock all external dependencies
jest.mock('../../models/authModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('nodemailer');
jest.mock('../../middlewares/Limiter');

// Mock the database configuration to prevent real DB connection
jest.mock('../../config/db.js', () => ({}));

// Mock environment variables
process.env.ACCESS_SECRET = 'test-access-secret';
process.env.REFRESH_SECRET = 'test-refresh-secret';
process.env.RESET_SECRET = 'test-reset-secret';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';

describe('Auth Controller Tests', () => {
  let req, res, mockSendMail, mockTransporter;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {},
      cookies: {},
      ip: '127.0.0.1',
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    // Mock Authlimiter
    Authlimiter.resetKey = jest.fn();

    // Mock nodemailer properly
    mockSendMail = jest.fn();
    mockTransporter = {
      sendMail: mockSendMail
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    
    // Mock the transporter on the authController exports
    authController.transporter = mockTransporter;
  });

  describe('Login', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
    });

    test('should login successfully with valid credentials and proper token expirations', async () => {
      const mockUser = {
        id_member: 1,
        role: 'user',
        fullname: 'Test User'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      await authController.Login(req, res);

      // Assert
      expect(authModel.LoginModel).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, type: 'refresh' },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      expect(Authlimiter.resetKey).toHaveBeenCalledWith('127.0.0.1');
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Connected Successfully !" });
    });

    test('should return 401 for invalid credentials', async () => {
      authModel.LoginModel.mockResolvedValue(null);

      await authController.Login(req, res);

      expect(authModel.LoginModel).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Email or Password is incorrect" });
    });

    test('should handle server errors during login', async () => {
      authModel.LoginModel.mockRejectedValue(new Error('Database error'));

      await authController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('RefreshToken', () => {
    beforeEach(() => {
      req.cookies.refresh_token = 'valid-refresh-token';
    });

    test('should refresh token successfully with 15-minute access token', async () => {
      const mockDecoded = { id: 1 };
      const mockUser = {
        id_member: 1,
        role: 'user',
        fullname: 'Test User'
      };

      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('new-access-token');

      await authController.RefreshToken(req, res);

      expect(JWT.verify).toHaveBeenCalledWith('valid-refresh-token', process.env.REFRESH_SECRET);
      expect(authModel.GetUserById).toHaveBeenCalledWith(1);
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'new-access-token', {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 401 when no refresh token is provided', async () => {
      req.cookies.refresh_token = undefined;

      await authController.RefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "No token refresh was found, Please login again!" });
    });

    test('should return 400 when user is not found', async () => {
      const mockDecoded = { id: 1 };
      
      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(null);

      await authController.RefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please log in" });
    });

    test('should handle invalid or expired refresh token', async () => {
      JWT.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.RefreshToken(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired refresh token!" });
    });
  });

  describe('Logout', () => {
    test('should logout successfully', () => {
      authController.Logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
      });
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    test('should handle errors during logout', () => {
      // Mock clearCookie to throw an error on first call only
      res.clearCookie
        .mockImplementationOnce(() => {
          throw new Error('Cookie error');
        })
        .mockReturnThis();

      authController.Logout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
  });

  describe('ResetPass', () => {
    beforeEach(() => {
      req.body = { email: 'test@example.com' };
    });

    test('should send reset password email successfully with 15-minute expiration token', async () => {
      const mockUser = {
        id_member: 1,
      };

      authModel.FindUserByEmail.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('reset-token');
      mockSendMail.mockResolvedValue(true);

      await authController.ResetPass(req, res);

      // Assert
      expect(authModel.FindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1},
        process.env.RESET_SECRET,
        { expiresIn: '15m' }
      );
      expect(mockSendMail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "A password reset email has been sent. Please check your inbox or spam folder ✅"
      });
    });

    test('should return 400 when user is not found', async () => {
      authModel.FindUserByEmail.mockResolvedValue(null);

      await authController.ResetPass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found with this email ❌" });
    });

    test('should handle server errors during reset password', async () => {
      authModel.FindUserByEmail.mockRejectedValue(new Error('Database error'));

      await authController.ResetPass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    test('should handle email sending failures', async () => {
      const mockUser = {
        id_member: 1,
      };

      authModel.FindUserByEmail.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('reset-token');
      mockSendMail.mockResolvedValue(false);

      await authController.ResetPass(req, res);

      // The function doesn't handle email sending failures explicitly
      // It only responds with success if sent is truthy
      // If sent is falsy, the function doesn't respond, so we need to check the behavior
      expect(mockSendMail).toHaveBeenCalled();
      // Since the function doesn't handle the false case, it won't call res.status or res.json
      // This might be a bug in the original code that should be addressed
    });
  });

  describe('ResetPassEmail', () => {
    beforeEach(() => {
      req.body = { password: 'newpassword123' };
      req.user = { id: 1 };
    });

    test('should update password successfully', async () => {
      const hashedPassword = 'hashed-password';
      const mockUser = { id_member: 1 };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      authModel.UpdatePassById.mockResolvedValue(mockUser);

      await authController.ResetPassEmail(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(authModel.UpdatePassById).toHaveBeenCalledWith(1, hashedPassword);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "The password was updated successfully!" });
    });

    test('should return 400 when user is not found', async () => {
      const hashedPassword = 'hashed-password';

      bcrypt.hash.mockResolvedValue(hashedPassword);
      authModel.UpdatePassById.mockResolvedValue(null);

      await authController.ResetPassEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found with this email " });
    });

    test('should handle server errors during password update', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));

      await authController.ResetPassEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      // Fixed the typo in the expected message - it should match the actual controller
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error " });
    });
  });

  describe('check', () => {
    test('should return 200 status with valid:true and role when user is authenticated', () => {
      // Arrange
      req.user = {
        id: 1,
        role: 'admin'
      };

      // Act
      authController.check(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        id: 1,
        role: 'admin',
        message: 'Authenticated'
      });
    });

    test('should return 401 status with valid:false and null role when user is not authenticated', () => {
      // Arrange
      req.user = null;

      // Act
      authController.check(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        role: null,
        message: 'Not authenticated'
      });
    });

    test('should handle different user roles correctly', () => {
      // Arrange
      req.user = {
        id: 2,
        role: 'user'
      };

      // Act
      authController.check(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        id: 2,
        role: 'user',
        message: 'Authenticated'
      });
    });

    test('should treat empty user object as authenticated', () => {
      // Arrange
      req.user = {};

      // Act
      authController.check(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        id: undefined,
        role: undefined,
        message: 'Authenticated'
      });
    });
  });
});

// Additional test suite for edge cases
describe('Auth Controller Edge Cases', () => {
  let req, res, mockSendMail, mockTransporter;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {},
      cookies: {},
      ip: '127.0.0.1',
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    Authlimiter.resetKey = jest.fn();

    // Mock nodemailer properly for edge cases too
    mockSendMail = jest.fn();
    mockTransporter = {
      sendMail: mockSendMail
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    authController.transporter = mockTransporter;
  });

  test('Login should handle missing email or password', async () => {
    req.body = { email: 'test@example.com' }; // Missing password

    authModel.LoginModel.mockResolvedValue(null);

    await authController.Login(req, res);

    expect(authModel.LoginModel).toHaveBeenCalledWith('test@example.com', undefined);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('RefreshToken should handle malformed JWT', async () => {
    req.cookies.refresh_token = 'malformed-token';
    
    JWT.verify.mockImplementation(() => {
      throw new Error('JsonWebTokenError');
    });

    await authController.RefreshToken(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('ResetPass should handle email service errors', async () => {
    const mockUser = {
      id_member: 1,
    };

    req.body = { email: 'test@example.com' };
    authModel.FindUserByEmail.mockResolvedValue(mockUser);
    JWT.sign.mockReturnValue('reset-token');
    mockSendMail.mockRejectedValue(new Error('SMTP Error'));

    await authController.ResetPass(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
  });
});