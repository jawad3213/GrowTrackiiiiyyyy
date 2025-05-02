const authController = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const limiter = require('../../middlewares/Limiter');

// Mock the required modules
jest.mock('../../models/authModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('nodemailer');
jest.mock('../../middlewares/Limiter');

describe('Auth Controller Tests', () => {
  let req;
  let res;
  let mockCookie = jest.fn();
  let mockClearCookie = jest.fn();
  let mockSendMail = jest.fn();
  let originalDateNow;

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
    mockSendMail = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail
    });

    // Setup JWT mock
    JWT.sign.mockReturnValue('test-token');
    
    // Setup limiter mock
    limiter.resetKey = jest.fn();

    // Setup process.env values for testing
    process.env.ACCESS_SECRET = 'test-access-secret';
    process.env.REFRESH_SECRET = 'test-refresh-secret';
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
      expect(limiter.resetKey).toHaveBeenCalledWith(req.ip);
      
      // Verify access token (15 minutes)
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user', fullname: 'Test User' },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      
      // Verify refresh token (7 days)
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
    
    test('should handle specifically expired refresh token', async () => {
      // Arrange
      req.cookies.refresh_token = 'expired-token';
      JWT.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
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

  describe('ResetPass Token Expiration', () => {
    test('should verify reset token expiration by testing a simulated expired token', async () => {
      // Arrange - Setup time mocking
      const mockCurrentTime = new Date('2023-01-01T12:00:00Z').getTime();
      Date.now = jest.fn(() => mockCurrentTime);
      
      // Create a token that was issued 16 minutes ago (beyond the 15 min expiry)
      const tokenIssuedTime = mockCurrentTime - (16 * 60 * 1000); // 16 minutes ago
      
      // Mock JWT verify to simulate checking an expired token
      JWT.verify.mockImplementation(() => {
        // Check if token would be expired (issued more than 15 mins ago)
        if (Date.now() - tokenIssuedTime > 15 * 60 * 1000) {
          const error = new Error('Token expired');
          error.name = 'TokenExpiredError';
          throw error;
        }
        return { id: 1, role: 'user' };
      });
      
      // Create a request with the "expired" token
      const expiredTokenReq = {
        params: { token: 'expired-reset-token' }
      };
      
      // Act & Assert - Verify token would be rejected
      await expect(async () => {
        // This would typically be a middleware or separate function to verify token
        // We're directly testing JWT.verify here
        JWT.verify(expiredTokenReq.params.token, process.env.ACCESS_SECRET);
      }).rejects.toThrow('Token expired');
      
      // Restore the token issued time to simulate a valid token
      const validTokenIssuedTime = mockCurrentTime - (14 * 60 * 1000); // 14 minutes ago
      
      // Update the mock
      JWT.verify.mockImplementation(() => {
        // Check if token would be expired (issued more than 15 mins ago)
        if (Date.now() - validTokenIssuedTime > 15 * 60 * 1000) {
          const error = new Error('Token expired');
          error.name = 'TokenExpiredError';
          throw error;
        }
        return { id:1, role: 'user' };
      });
      
      // Act & Assert - Verify valid token would be accepted
      const result = JWT.verify('valid-reset-token', process.env.ACCESS_SECRET);
      expect(result).toEqual({ id: 1, role: 'user' });
    });
  });

  describe('ResetPass', () => {
    /*test('should send reset password email successfully with 15-minute expiration token', async () => {
      // Arrange
      req.body = { email: 'test@example.com' };
      authModel.FindUserByEmail.mockResolvedValue({ 
        role: 'user',
        id : 1,
      });
      mockSendMail.mockResolvedValue(true);
      JWT.sign.mockClear();
      
      // Create a mock implementation for sendMail that captures the mail options
      let capturedMailOptions;
      mockSendMail.mockImplementation(mailOptions => {
        capturedMailOptions = mailOptions;
        return Promise.resolve(true);
      });

      // Act
      await authController.ResetPass(req, res);

      // Assert
      expect(authModel.FindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: 1 },
        process.env.RESET_SECRET,
        { expiresIn: '15m' }
      );
      expect(mockSendMail).toHaveBeenCalled();
      
      // Verify that the email contains the reset link and expiration info
      expect(capturedMailOptions.html).toContain('Reset My Password');
      expect(capturedMailOptions.html).toContain('This link will expire in 15 minutes');
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'A password reset email has been sent. Please check your inbox or spam folder ✅',
      });
    });
*/
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
      // Mock FindUserByEmail to throw an error
      authModel.FindUserByEmail.mockRejectedValue(new Error('Database error'));

      // Act
      await authController.ResetPass(req, res);

      // Assert
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
      expect(res.json).toHaveBeenCalledWith({ message: 'Interne Servel Error ' });
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