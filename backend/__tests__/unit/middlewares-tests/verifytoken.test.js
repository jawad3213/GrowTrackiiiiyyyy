const JWT = require('jsonwebtoken');
const { verifyToken, verifyResetToken } = require('../../../middlewares/VerifyToken'); 

// Mock JWT
jest.mock('jsonwebtoken');

describe('JWT Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {},
      query: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Set up environment variables
    process.env.ACCESS_SECRET = 'test-access-secret';
    process.env.RESET_SECRET = 'test-reset-secret';
  });

  describe('verifyToken', () => {
    describe('Token extraction', () => {
      it('should extract token from cookies', () => {
        const token = 'valid-token';
        req.cookies.access_token = token;
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          callback(null, { userId: 123 });
        });

        verifyToken(req, res, next);

        expect(JWT.verify).toHaveBeenCalledWith(token, process.env.ACCESS_SECRET, expect.any(Function));
        expect(req.user).toEqual({ userId: 123 });
        expect(next).toHaveBeenCalled();
      });

      it('should extract token from Authorization header', () => {
        const token = 'valid-token';
        req.headers.authorization = `Bearer ${token}`;
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          callback(null, { userId: 123 });
        });

        verifyToken(req, res, next);

        expect(JWT.verify).toHaveBeenCalledWith(token, process.env.ACCESS_SECRET, expect.any(Function));
        expect(req.user).toEqual({ userId: 123 });
        expect(next).toHaveBeenCalled();
      });

      it('should prioritize cookie over Authorization header', () => {
        const cookieToken = 'cookie-token';
        const headerToken = 'header-token';
        req.cookies.access_token = cookieToken;
        req.headers.authorization = `Bearer ${headerToken}`;
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          callback(null, { userId: 123 });
        });

        verifyToken(req, res, next);

        expect(JWT.verify).toHaveBeenCalledWith(cookieToken, process.env.ACCESS_SECRET, expect.any(Function));
      });
    });

    describe('Missing token scenarios', () => {
      it('should return 401 when no token is provided', () => {
        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          errorCode: "NO_TOKEN",
          message: "No token was found."
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('should return 401 when Authorization header is malformed', () => {
        req.headers.authorization = 'InvalidFormat';
        
        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          errorCode: "NO_TOKEN",
          message: "No token was found."
        });
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('Token verification errors', () => {
      it('should handle TokenExpiredError', () => {
        req.cookies.access_token = 'expired-token';
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          const error = new Error('Token expired');
          error.name = 'TokenExpiredError';
          callback(error);
        });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          errorCode: "TOKEN_EXPIRED",
          message: "Access token has expired."
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('should handle JsonWebTokenError', () => {
        req.cookies.access_token = 'invalid-token';
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          const error = new Error('Invalid token');
          error.name = 'JsonWebTokenError';
          callback(error);
        });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          errorCode: "INVALID_TOKEN",
          message: "Invalid token structure."
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('should handle other JWT errors', () => {
        req.cookies.access_token = 'problematic-token';
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          const error = new Error('Some other error');
          error.name = 'SomeOtherError';
          callback(error);
        });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          errorCode: "AUTH_ERROR",
          message: "Authentication error occurred."
        });
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('Successful verification', () => {
      it('should set req.user and call next() on successful verification', () => {
        const token = 'valid-token';
        const decodedData = { userId: 123, email: 'test@example.com' };
        req.cookies.access_token = token;
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          callback(null, decodedData);
        });

        verifyToken(req, res, next);

        expect(JWT.verify).toHaveBeenCalledWith(token, process.env.ACCESS_SECRET, expect.any(Function));
        expect(req.user).toEqual(decodedData);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
    });
  });

  describe('verifyResetToken', () => {
    describe('Missing token scenarios', () => {
      it('should return 400 when no token is provided', () => {
        verifyResetToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Missing reset token'
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('should return 400 when token is empty string', () => {
        req.query.token = '';
        
        verifyResetToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Missing reset token'
        });
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('Token verification errors', () => {
      it('should return 401 for invalid or expired token', () => {
        req.query.token = 'invalid-token';
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          const error = new Error('Invalid token');
          callback(error);
        });

        verifyResetToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Invalid or expired token'
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('should return 401 for expired reset token', () => {
        req.query.token = 'expired-token';
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          const error = new Error('Token expired');
          error.name = 'TokenExpiredError';
          callback(error);
        });

        verifyResetToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Invalid or expired token'
        });
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('Successful verification', () => {
      it('should set req.user and call next() on successful verification', () => {
        const token = 'valid-reset-token';
        const decodedData = { userId: 123, purpose: 'reset' };
        req.query.token = token;
        
        JWT.verify.mockImplementation((token, secret, callback) => {
          callback(null, decodedData);
        });

        verifyResetToken(req, res, next);

        expect(JWT.verify).toHaveBeenCalledWith(token, process.env.RESET_SECRET, expect.any(Function));
        expect(req.user).toEqual(decodedData);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
    });
  });
});