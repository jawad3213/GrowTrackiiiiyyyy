const authController = require('../../../controllers/authController');
const authModel = require('../../../models/authModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Authlimiter } = require('../../../middlewares/Limiter');

// Mock all dependencies
jest.mock('../../../models/authModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('nodemailer');
jest.mock('../../../middlewares/Limiter');
jest.mock('../../../config/db', () => ({
  totalCount: 10,
  idleCount: 5,
  waitingCount: 2
}));

// Mock environment variables
process.env.ACCESS_SECRET = 'test-access-secret';
process.env.REFRESH_SECRET = 'test-refresh-secret';
process.env.RESET_SECRET = 'test-reset-secret';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';

describe('Auth Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {},
      headers: {},
      cookies: {},
      ip: '127.0.0.1',
      user: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('Login', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        RememberMe: false
      };
      req.headers = { 'use-cookies': 'false' };
    });

    test('should login successfully without cookies', async () => {
      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('mock-access-token');
      Authlimiter.resetKey = jest.fn();

      await authController.Login(req, res);

      expect(authModel.LoginModel).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(Authlimiter.resetKey).toHaveBeenCalledWith('127.0.0.1');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        'test-access-secret',
        { expiresIn: '15m' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Connected Successfully without Cookies !",
        role: 'user',
        access_token: 'mock-access-token',
        email: 'test@example.com',
        fullname: 'Test User'
      });
    });

    test('should login successfully with cookies and RememberMe', async () => {
      req.headers['use-cookies'] = 'true';
      req.body.RememberMe = true;

      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValueOnce('mock-access-token').mockReturnValueOnce('mock-refresh-token');
      Authlimiter.resetKey = jest.fn();

      await authController.Login(req, res);

      expect(JWT.sign).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'mock-access-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000
      });
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'mock-refresh-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Connected Successfully with Cookies!",
        role: 'user',
        email: 'test@example.com',
        fullname: 'Test User'
      });
    });

    test('should login successfully with cookies without RememberMe (session cookies)', async () => {
      req.headers['use-cookies'] = 'true';
      req.body.RememberMe = false;

      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValueOnce('mock-access-token').mockReturnValueOnce('mock-refresh-token');
      Authlimiter.resetKey = jest.fn();

      await authController.Login(req, res);

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'mock-access-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
      });
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'mock-refresh-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
      });
    });

    test('should return 401 for invalid credentials', async () => {
      authModel.LoginModel.mockResolvedValue(null);

      await authController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email or Password is incorrect"
      });
    });

    test('should handle server errors', async () => {
      authModel.LoginModel.mockRejectedValue(new Error('Database error'));

      await authController.Login(req, res);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });

    test('should use extended token expiry for RememberMe without cookies', async () => {
      req.body.RememberMe = true;
      req.headers['use-cookies'] = 'false';

      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('mock-access-token');

      await authController.Login(req, res);

      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        'test-access-secret',
        { expiresIn: '45m' }
      );
    });
  });

  describe('RefreshToken', () => {
    beforeEach(() => {
      req.cookies = {
        refresh_token: 'mock-refresh-token'
      };
    });

    test('should refresh token successfully', async () => {
      const mockDecoded = {
        id: 1,
        RememberMe: true
      };
      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User'
      };

      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('new-access-token');

      await authController.RefreshToken(req, res);

      expect(JWT.verify).toHaveBeenCalledWith('mock-refresh-token', 'test-refresh-secret');
      expect(authModel.GetUserById).toHaveBeenCalledWith(1);
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        'test-access-secret',
        { expiresIn: '15m' }
      );
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'new-access-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "The new access token is set!"
      });
    });

    test('should return 401 when no refresh token provided', async () => {
      req.cookies = {};

      await authController.RefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "No token refresh was found, Please login again!"
      });
    });

    test('should return 400 when user not found', async () => {
      const mockDecoded = { id: 1, RememberMe: true };
      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(null);

      await authController.RefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please log in"
      });
    });

    test('should handle invalid/expired refresh token', async () => {
      JWT.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.RefreshToken(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired refresh token!"
      });
    });

    test('should set cookie without maxAge when RememberMe is false', async () => {
      const mockDecoded = {
        id: 1,
        RememberMe: false
      };
      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User'
      };

      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('new-access-token');

      await authController.RefreshToken(req, res);

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'new-access-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: undefined
      });
    });
  });

  describe('Logout', () => {
    test('should logout successfully', async () => {
      await authController.Logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
      });
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logout successful"
      });
    });

    test('should handle logout errors', async () => {
      // Mock clearCookie to throw an error
      res.clearCookie.mockImplementation(() => {
        throw new Error('Cookie error');
      });

      await authController.Logout(req, res);

      expect(console.log).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error"
      });
    });
  });

  describe('ResetPass', () => {
    let mockTransporter;

    beforeEach(() => {
      req.body = {
        email: 'test@example.com'
      };

      mockTransporter = {
        sendMail: jest.fn()
      };
      nodemailer.createTransport.mockReturnValue(mockTransporter);
    });

    test.skip('should send reset password email successfully', async () => {
      const mockUser = {
        id_member: 1,
        role: 'user'
      };

      authModel.FindUserByEmail.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('reset-token');
      mockTransporter.sendMail.mockResolvedValue(true);

      await authController.ResetPass(req, res);

      expect(authModel.FindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user' },
        'test-reset-secret',
        { expiresIn: '15m' }
      );
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'test@example.com',
        subject: 'Password Reset Request 🔒',
        html: expect.stringContaining('http://localhost:5173/resetpass?token=reset-token')
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "A password reset email has been sent. Please check your inbox or spam folder ✅"
      });
    });

    test('should return 400 when user not found', async () => {
      authModel.FindUserByEmail.mockResolvedValue(null);

      await authController.ResetPass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found with this email ❌"
      });
    });

    test('should handle server errors', async () => {
      authModel.FindUserByEmail.mockRejectedValue(new Error('Database error'));

      await authController.ResetPass(req, res);

      expect(console.log).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });
  });

  describe('ResetPassEmail', () => {
    beforeEach(() => {
      req.body = {
        password: 'newpassword123'
      };
      req.user = {
        id: 1
      };
    });

    test('should reset password successfully', async () => {
      const hashedPassword = 'hashed-password';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      authModel.UpdatePassById.mockResolvedValue(true);

      await authController.ResetPassEmail(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(authModel.UpdatePassById).toHaveBeenCalledWith(1, hashedPassword);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "The password was updated successfully!"
      });
    });

    test('should return 400 when user not found', async () => {
      bcrypt.hash.mockResolvedValue('hashed-password');
      authModel.UpdatePassById.mockResolvedValue(null);

      await authController.ResetPassEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found with this email "
      });
    });

    test('should handle server errors', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await authController.ResetPassEmail(req, res);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error "
      });
    });
  });

  describe('check', () => {
    test('should return valid when user is authenticated', () => {
      req.user = {
        id: 1,
        role: 'user'
      };

      authController.check(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        id: 1,
        role: 'user',
        message: 'Authenticated'
      });
    });

    test('should return invalid when user is not authenticated', () => {
      req.user = null;

      authController.check(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        role: null,
        message: 'Not authenticated'
      });
    });

    test('should return invalid when user is undefined', () => {
      req.user = undefined;

      authController.check(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        role: null,
        message: 'Not authenticated'
      });
    });
  });
});

// Additional test for edge cases and error handling
describe('Edge Cases and Error Handling', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
      cookies: {},
      ip: '127.0.0.1',
      user: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('Login should handle missing email or password', async () => {
    req.body = { email: '', password: '' };
    req.headers = { 'use-cookies': 'false' };

    authModel.LoginModel.mockResolvedValue(null);

    await authController.Login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email or Password is incorrect"
    });
  });

  test('ResetPass should handle email sending failure', async () => {
    req.body = { email: 'test@example.com' };
    
    const mockUser = { id_member: 1, role: 'user' };
    const mockTransporter = { sendMail: jest.fn().mockResolvedValue(false) };
    
    authModel.FindUserByEmail.mockResolvedValue(mockUser);
    JWT.sign.mockReturnValue('reset-token');
    nodemailer.createTransport.mockReturnValue(mockTransporter);

    await authController.ResetPass(req, res);

    // Should not return success response if email sending fails
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});