const authController = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Mock the required modules
jest.mock('../../models/authModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('nodemailer');
jest.mock('../../middlewares/Limiter', () => ({
  authlimiter: {
    resetKey: jest.fn()
  }
}));

describe('Auth Controller Tests', () => {
  let req;
  let res;
  let mockCookie = jest.fn();
  let mockClearCookie = jest.fn();
  let mockSendMail = jest.fn();
  let originalDateNow;
  let mockTransporter;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Store original Date.now
    originalDateNow = Date.now;
    
    // Setup request and response objects
    req = {
      body: {},
      cookies: {},
      ip: '127.0.0.1',
      user: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: mockCookie,
      clearCookie: mockClearCookie
    };

    // Setup nodemailer mock with a basic implementation
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockTransporter = {
      sendMail: mockSendMail
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    
    // Set up mock for the exported transporter
    authController.transporter = mockTransporter;

    // Setup JWT mock
    JWT.sign.mockReturnValue('test-token');
    
    // Setup process.env values for testing
    process.env.ACCESS_SECRET = 'test-access-secret';
    process.env.REFRESH_SECRET = 'test-refresh-secret';
    process.env.RESET_SECRET = 'test-reset-secret';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'test-password';
  });
  
  afterEach(() => {
    // Restore original Date.now
    Date.now = originalDateNow;
  });

  describe('Login', () => {
    test('should login successfully with valid credentials and proper token expirations', async () => {
      // Arrange
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = { 
        id_member: 1, 
        role: 'user', 
        fullname: 'Test User' 
      };
      authModel.LoginModel.mockResolvedValue(mockUser);
      JWT.sign.mockClear();

      // Act
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
      
      expect(mockCookie).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Connected Successfully !' });
    });

    test('should return 401 for invalid credentials', async () => {
      // Arrange
      req.body = { email: 'wrong@example.com', password: 'wrongpass' };
      authModel.LoginModel.mockResolvedValue(null);

      // Act
      await authController.Login(req, res);

      // Assert
      expect(authModel.LoginModel).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email or Password is incorrect' });
    });

    test('should handle server errors during login', async () => {
      // Arrange
      req.body = { email: 'test@example.com', password: 'password123' };
      authModel.LoginModel.mockRejectedValue(new Error('Database error'));

      // Act
      await authController.Login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server Error, Please try again later!' });
    });
  });

  describe('RefreshToken', () => {
    test('should refresh token successfully with 15-minute access token', async () => {
      // Arrange
      req.cookies.refresh_token = 'valid-refresh-token';
      JWT.verify.mockReturnValue({ id: 1, type: 'refresh' });
      authModel.GetUserById.mockResolvedValue({ 
        id_member: 1, 
        role: 'user', 
        fullname: 'Test User' 
      });
      JWT.sign.mockClear();

      // Act
      await authController.RefreshToken(req, res);

      // Assert
      expect(JWT.verify).toHaveBeenCalledWith('valid-refresh-token', process.env.REFRESH_SECRET);
      expect(authModel.GetUserById).toHaveBeenCalledWith(1);
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      expect(mockCookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'The new access token is set!' });
    });

    test('should return 401 when no refresh token is provided', async () => {
      // Arrange
      req.cookies.refresh_token = undefined;

      // Act
      await authController.RefreshToken(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token refresh was found, Please login again!' });
    });

    test('should return 400 when user is not found', async () => {
      // Arrange
      req.cookies.refresh_token = 'valid-refresh-token';
      JWT.verify.mockReturnValue({ id: 999, type: 'refresh' });
      authModel.GetUserById.mockResolvedValue(null);

      // Act
      await authController.RefreshToken(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please log in' });
    });

    test('should handle invalid or expired refresh token', async () => {
      // Arrange
      req.cookies.refresh_token = 'invalid-token';
      JWT.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      await authController.RefreshToken(req, res);

      // Assert
      expect(mockClearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired refresh token!' });
    });
  });

  describe('Logout', () => {
    test('should logout successfully', () => {
      // Act
      authController.Logout(req, res);

      // Assert
      expect(mockClearCookie).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully.' });
    });

    test('should handle errors during logout', () => {
      // Arrange
      mockClearCookie.mockImplementation(() => {
        throw new Error('Cookie error');
      });

      // Act
      authController.Logout(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('ResetPass', () => {
    test('should send reset password email successfully with 15-minute expiration token', async () => {
      // Arrange
      req.body = { email: 'test@example.com' };
      authModel.FindUserByEmail.mockResolvedValue({ 
        id_member: 1,
      });
      JWT.sign.mockClear();

      // Act
      await authController.ResetPass(req, res);

      // Assert
      expect(authModel.FindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1 },
        process.env.RESET_SECRET,
        { expiresIn: '15m' }
      );
      
      // Check that sendMail was called with the correct parameters
      expect(mockSendMail).toHaveBeenCalled();
      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe('test@example.com');
      expect(mailOptions.subject).toBe('Password Reset Request 🔒');
      expect(mailOptions.html).toContain('Reset My Password');
      expect(mailOptions.html).toContain('This link will expire in 15 minutes');
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'A password reset email has been sent. Please check your inbox or spam folder ✅',
      });
    });

    test('should return 400 when user is not found', async () => {
      // Arrange
      req.body = { email: 'nonexistent@example.com' };
      authModel.FindUserByEmail.mockResolvedValue(null);

      // Act
      await authController.ResetPass(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found with this email ❌' });
    });

    test('should handle server errors during reset password', async () => {
      // Arrange
      req.body = { email: 'test@example.com' };
      authModel.FindUserByEmail.mockRejectedValue(new Error('Database error'));

      // Act
      await authController.ResetPass(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server Error, Please try again later!' });
    });
    
    test('should handle email sending failures', async () => {
      // Arrange
      req.body = { email: 'test@example.com' };
      authModel.FindUserByEmail.mockResolvedValue({ id_member: 1 });
      mockSendMail.mockRejectedValue(new Error('Email sending failed'));

      // Act
      await authController.ResetPass(req, res);

      // Assert
      expect(mockSendMail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server Error, Please try again later!' });
    });
  });

  describe('ResetPassEmail', () => {
    test('should update password successfully', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { password: 'newPassword123' };
      bcrypt.hash.mockResolvedValue('hashed_password');
      authModel.UpdatePassById.mockResolvedValue(true);

      // Act
      await authController.ResetPassEmail(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(authModel.UpdatePassById).toHaveBeenCalledWith(1, 'hashed_password');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'The password was updated successfully!' });
    });

    test('should return 400 when user is not found', async () => {
      // Arrange
      req.user = { id: 999 };
      req.body = { password: 'newPassword123' };
      bcrypt.hash.mockResolvedValue('hashed_password');
      authModel.UpdatePassById.mockResolvedValue(null);

      // Act
      await authController.ResetPassEmail(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found with this email ' });
    });

    test('should handle server errors during password update', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { password: 'newPassword123' };
      bcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));

      // Act
      await authController.ResetPassEmail(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error ' });
    });
  });

  describe('check', () => {
    test('should return 200 when user is authenticated', () => {
      // Arrange
      req.user = { id: 1 };

      // Act
      authController.check(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authenticated' });
    });

    test('should return 401 when user is not authenticated', () => {
      // Arrange
      req.user = undefined;

      // Act
      authController.check(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
    });
  });
});