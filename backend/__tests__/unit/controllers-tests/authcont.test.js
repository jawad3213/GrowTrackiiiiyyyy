// Mock all dependencies BEFORE importing the controller
jest.mock('../../../models/authModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../middlewares/Limiter');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Create a mock transporter that we can control
const mockSendMail = jest.fn();
const mockTransporter = {
  sendMail: mockSendMail
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => mockTransporter)
}));

// Now import the controller AFTER mocking
const authController = require('../../../controllers/authController');
const authModel = require('../../../models/authModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Authlimiter } = require('../../../middlewares/Limiter');

// Mock environment variables
process.env.ACCESS_SECRET = 'test-access-secret';
process.env.REFRESH_SECRET = 'test-refresh-secret';
process.env.RESET_SECRET = 'test-reset-secret';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response objects
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

    // Setup default mocks
    Authlimiter.resetKey = jest.fn();
    JWT.sign = jest.fn();
    JWT.verify = jest.fn();
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

    it('should login successfully without cookies', async () => {
      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      await authController.Login(req, res);

      expect(authModel.LoginModel).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(Authlimiter.resetKey).toHaveBeenCalledWith('127.0.0.1');
      expect(JWT.sign).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Connected Successfully Sans Cookies !",
        role: 'user',
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        email: 'test@example.com',
        fullname: 'Test User'
      });
    });

    it('should login successfully with cookies and RememberMe=true', async () => {
      req.headers['use-cookies'] = 'true';
      req.body.RememberMe = true;

      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      await authController.Login(req, res);

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
    });

    it('should login successfully with cookies and RememberMe=false (session cookies)', async () => {
      req.headers['use-cookies'] = 'true';
      req.body.RememberMe = false;

      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User',
        email: 'test@example.com'
      };

      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      await authController.Login(req, res);

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'mock-access-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
      });
    });

    it('should return 401 for invalid credentials', async () => {
      authModel.LoginModel.mockResolvedValue(null);

      await authController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email or Password is incorrect"
      });
    });

    it('should handle server errors', async () => {
      authModel.LoginModel.mockRejectedValue(new Error('Database error'));

      await authController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });
  });

  describe('RefreshToken', () => {
    beforeEach(() => {
      req.cookies = { refresh_token: 'mock-refresh-token' };
      req.headers = { 'use-cookies': 'true' };
    });

    it('should refresh token successfully with cookies', async () => {
      const mockDecoded = { id: 1, RememberMe: true };
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
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'new-access-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should refresh token successfully without cookies', async () => {
      req.headers['use-cookies'] = 'false';
      req.body = { refresh_token: 'mock-refresh-token' };
      req.cookies = {};

      const mockDecoded = { id: 1, RememberMe: false };
      const mockUser = {
        id_member: 1,
        role: 'user',
        full_name: 'Test User'
      };

      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('new-access-token');

      await authController.RefreshToken(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "The new access token is set!",
        access_token: 'new-access-token'
      });
    });

    it('should return 401 when no refresh token provided', async () => {
      req.cookies = {};
      req.body = {};

      await authController.RefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "No token refresh was found, Please login again!"
      });
    });

    it('should return 400 when user not found', async () => {
      const mockDecoded = { id: 1, RememberMe: true };

      JWT.verify.mockReturnValue(mockDecoded);
      authModel.GetUserById.mockResolvedValue(null);

      await authController.RefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please log in"
      });
    });

    it('should handle invalid refresh token', async () => {
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
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
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

    it('should handle logout errors', async () => {
      // Mock console.log to avoid output during tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Force an error by making clearCookie throw
      res.clearCookie.mockImplementation(() => {
        throw new Error('Cookie error');
      });

      await authController.Logout(req, res);

      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error"
      });

      consoleSpy.mockRestore();
    });
  });

  describe('ResetPass', () => {
    beforeEach(() => {
      req.body = { email: 'test@example.com' };
      // Reset the mock before each test
      mockSendMail.mockClear();
    });

    it('should send reset email successfully', async () => {
      const mockUser = { id_member: 1 };
      
      authModel.FindUserByEmail.mockResolvedValue(mockUser);
      JWT.sign.mockReturnValue('reset-token');
      mockSendMail.mockResolvedValue({ messageId: 'test-id' });

      await authController.ResetPass(req, res);

      expect(authModel.FindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1 },
        'test-reset-secret',
        { expiresIn: '15m' }
      );
      expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
        from: 'test@example.com',
        to: 'test@example.com',
        subject: 'Password Reset Request 🔒',
        html: expect.stringContaining('Password Reset')
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "A password reset email has been sent. Please check your inbox or spam folder ✅"
      });
    });

    it('should return 400 when user not found', async () => {
      authModel.FindUserByEmail.mockResolvedValue(null);

      await authController.ResetPass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found with this email ❌"
      });
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should handle server errors', async () => {
      authModel.FindUserByEmail.mockRejectedValue(new Error('Database error'));

      await authController.ResetPass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });

  describe('ResetPassEmail', () => {
    beforeEach(() => {
      req.user = { id: 1 };
      req.body = { password: 'newpassword123' };
    });

    it('should reset password successfully', async () => {
      const hashedPassword = 'hashed-password';
      const mockUser = { id_member: 1 };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      authModel.UpdatePassById.mockResolvedValue(mockUser);

      await authController.ResetPassEmail(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(authModel.UpdatePassById).toHaveBeenCalledWith(1, hashedPassword);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "The password was updated successfully!"
      });
    });

    it('should return 400 when user not found', async () => {
      const hashedPassword = 'hashed-password';

      bcrypt.hash.mockResolvedValue(hashedPassword);
      authModel.UpdatePassById.mockResolvedValue(null);

      await authController.ResetPassEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found with this email "
      });
    });

    it('should handle server errors', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await authController.ResetPassEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error "
      });
    });
  });

  describe('check', () => {
    it('should return valid when user is authenticated', async () => {
      req.user = {
        id: 1,
        role: 'user'
      };

      await authController.check(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        id: 1,
        role: 'user',
        message: 'Authenticated'
      });
    });

    it('should return invalid when user is not authenticated', async () => {
      req.user = null;

      await authController.check(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        role: null,
        message: 'Not authenticated'
      });
    });

    it('should return invalid when user is undefined', async () => {
      delete req.user;

      await authController.check(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        role: null,
        message: 'Not authenticated'
      });
    });
  });
});