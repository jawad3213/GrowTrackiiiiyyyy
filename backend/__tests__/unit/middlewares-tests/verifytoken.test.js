const { verifyToken, verifyResetToken } = require('../../../middlewares/VerifyToken');
const JWT = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('JWT Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  // === verifyToken tests ===
  describe('verifyToken', () => {
    it('should return 401 if no token is provided', () => {
      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        errorCode: 'NO_TOKEN'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is expired', () => {
      req.cookies.access_token = 'expiredToken';
      JWT.verify.mockImplementation((token, secret, cb) => cb({ name: 'TokenExpiredError' }, null));

      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        errorCode: 'TOKEN_EXPIRED'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      req.cookies.access_token = 'invalidToken';
      JWT.verify.mockImplementation((token, secret, cb) => cb({ name: 'JsonWebTokenError' }, null));

      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        errorCode: 'INVALID_TOKEN'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 on other JWT error', () => {
      req.cookies.access_token = 'otherErrorToken';
      JWT.verify.mockImplementation((token, secret, cb) => cb({ name: 'OtherError' }, null));

      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        errorCode: 'AUTH_ERROR'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set req.user if token is valid', () => {
      req.cookies.access_token = 'validToken';
      const decoded = { id: 1 };
      JWT.verify.mockImplementation((token, secret, cb) => cb(null, decoded));

      verifyToken(req, res, next);
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should check query token if cookie is missing', () => {
      req.query.token = 'queryToken';
      const decoded = { id: 2 };
      JWT.verify.mockImplementation((token, secret, cb) => cb(null, decoded));

      verifyToken(req, res, next);
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
    });
  });

  // === verifyResetToken tests ===
  describe('verifyResetToken', () => {
    it('should return 400 if no reset token is provided', () => {
      verifyResetToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Missing reset token'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if reset token is invalid or expired', () => {
      req.query.token = 'invalidResetToken';
      JWT.verify.mockImplementation((token, secret, cb) => cb(new Error('Invalid'), null));

      verifyResetToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid or expired token'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set req.user if reset token is valid', () => {
      req.query.token = 'validResetToken';
      const decoded = { id: 3 };
      JWT.verify.mockImplementation((token, secret, cb) => cb(null, decoded));

      verifyResetToken(req, res, next);
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
