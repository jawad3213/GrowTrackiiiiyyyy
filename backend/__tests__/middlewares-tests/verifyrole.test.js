const verifyRolee = require('../../middlewares/verificationRole'); // Adjust path as needed

describe('verifyRolee middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Mock request object
    req = {
      user: null
    };

    // Mock response object with chainable methods
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock next function
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when user has no role', () => {
    it('should return 403 when req.user is null', () => {
      req.user = null;
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "No role assigned" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when req.user exists but has no role property', () => {
      req.user = { id: 1, name: 'John' };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "No role assigned" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when req.user.role is undefined', () => {
      req.user = { id: 1, name: 'John', role: undefined };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "No role assigned" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when req.user.role is null', () => {
      req.user = { id: 1, name: 'John', role: null };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "No role assigned" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when user has unauthorized role', () => {
    it('should return 403 when user role is not in allowed roles (single role)', () => {
      req.user = { id: 1, name: 'John', role: 'user' };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized role" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when user role is not in allowed roles (multiple roles)', () => {
      req.user = { id: 1, name: 'John', role: 'guest' };
      const middleware = verifyRolee('admin', 'moderator');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized role" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when user has authorized role', () => {
    it('should call next() when user has the exact allowed role', () => {
      req.user = { id: 1, name: 'John', role: 'admin' };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next() when user role matches one of multiple allowed roles', () => {
      req.user = { id: 1, name: 'John', role: 'moderator' };
      const middleware = verifyRolee('admin', 'moderator', 'supervisor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should work with array of roles passed as single argument', () => {
      req.user = { id: 1, name: 'John', role: 'user' };
      const middleware = verifyRolee(['admin', 'user', 'moderator']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should work with mixed array and individual role arguments', () => {
      req.user = { id: 1, name: 'John', role: 'supervisor' };
      const middleware = verifyRolee(['admin', 'user'], 'moderator', 'supervisor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should work when no roles are provided (should reject all)', () => {
      req.user = { id: 1, name: 'John', role: 'admin' };
      const middleware = verifyRolee();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized role" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle empty array of roles', () => {
      req.user = { id: 1, name: 'John', role: 'admin' };
      const middleware = verifyRolee([]);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized role" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should be case sensitive', () => {
      req.user = { id: 1, name: 'John', role: 'Admin' };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized role" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle nested arrays correctly with flat()', () => {
      req.user = { id: 1, name: 'John', role: 'editor' };
      const middleware = verifyRolee('admin', ['moderator', 'editor']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle role as empty string', () => {
      req.user = { id: 1, name: 'John', role: '' };
      const middleware = verifyRolee('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "No role assigned" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('middleware function creation', () => {
    it('should return a function when called', () => {
      const middleware = verifyRolee('admin');
      expect(typeof middleware).toBe('function');
      expect(middleware.length).toBe(3); // req, res, next parameters
    });

    it('should create different middleware instances', () => {
      const adminMiddleware = verifyRolee('admin');
      const userMiddleware = verifyRolee('user');
      
      expect(adminMiddleware).not.toBe(userMiddleware);
    });
  });
});