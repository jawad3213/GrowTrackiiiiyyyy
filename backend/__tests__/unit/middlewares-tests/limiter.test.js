const { Authlimiter, ServerLimiter } = require('.../../../middlewares/Limiter'); // Adjust path as needed

// Mock express-rate-limit
jest.mock('express-rate-limit', () => {
  return jest.fn((options) => {
    const mockLimiter = jest.fn((req, res, next) => {
      // Simulate rate limiting logic
      const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
      
      // Store request counts in a mock store
      if (!mockLimiter._store) {
        mockLimiter._store = new Map();
      }
      
      const now = Date.now();
      const windowStart = Math.floor(now / options.windowMs) * options.windowMs;
      const storeKey = `${key}:${windowStart}`;
      
      const current = mockLimiter._store.get(storeKey) || 0;
      
      if (current >= options.max) {
        // Rate limit exceeded
        return res.status(429).json(options.message);
      }
      
      // Increment counter
      mockLimiter._store.set(storeKey, current + 1);
      next();
    });
    
    // Attach options to the mock for testing
    mockLimiter._options = options;
    return mockLimiter;
  });
});

describe('Rate Limiters', () => {
  let mockReq, mockRes, mockNext;
  
  beforeEach(() => {
    mockReq = {
      ip: '192.168.1.1'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Clear any existing stores
    if (Authlimiter._store) Authlimiter._store.clear();
    if (ServerLimiter._store) ServerLimiter._store.clear();
  });

  describe('Authlimiter', () => {
    it('should be configured with correct options', () => {
      expect(Authlimiter._options).toEqual({
        windowMs: 30 * 60 * 1000, // 30 minutes
        max: 20,
        keyGenerator: expect.any(Function),
        message: {
          status: 429,
          message: "Too many attemps, please try again after 30 minutes."
        },
        standardHeaders: true,
        legacyHeaders: false
      });
    });

    it('should use IP address as key', () => {
      const key = Authlimiter._options.keyGenerator(mockReq);
      expect(key).toBe('192.168.1.1');
    });

    it('should allow requests under the limit', () => {
      // Make 5 requests (under limit of 20)
      for (let i = 0; i < 5; i++) {
        Authlimiter(mockReq, mockRes, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalledTimes(5);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should block requests over the limit', () => {
      // Make 21 requests (over limit of 20)
      for (let i = 0; i < 21; i++) {
        Authlimiter(mockReq, mockRes, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalledTimes(20);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 429,
        message: "Too many attemps, please try again after 30 minutes."
      });
    });

    it('should handle different IP addresses separately', () => {
      const req1 = { ip: '192.168.1.1' };
      const req2 = { ip: '192.168.1.2' };
      
      // Make 20 requests from first IP
      for (let i = 0; i < 20; i++) {
        Authlimiter(req1, mockRes, mockNext);
      }
      
      // Make 1 request from second IP - should be allowed
      Authlimiter(req2, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(21);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('ServerLimiter', () => {
    it('should be configured with correct options', () => {
      expect(ServerLimiter._options).toEqual({
        windowMs: 60 * 60 * 1000, // 60 minutes
        max: 500,
        message: {
          status: 429,
          message: "Too many requests, please try again after 60 minutes."
        },
        standardHeaders: true,
        legacyHeaders: false
      });
    });

    it('should allow requests under the limit', () => {
      // Make 100 requests (under limit of 500)
      for (let i = 0; i < 100; i++) {
        ServerLimiter(mockReq, mockRes, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalledTimes(100);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should block requests over the limit', () => {
      // Make 501 requests (over limit of 500)
      for (let i = 0; i < 501; i++) {
        ServerLimiter(mockReq, mockRes, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalledTimes(500);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 429,
        message: "Too many requests, please try again after 60 minutes."
      });
    });

    it('should use default key generator (IP address)', () => {
      // Since no keyGenerator is specified, it should default to req.ip
      ServerLimiter(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should handle both limiters independently', () => {
      // Reset mocks
      mockNext.mockClear();
      mockRes.status.mockClear();
      mockRes.json.mockClear();
      
      // Make requests to both limiters
      for (let i = 0; i < 10; i++) {
        Authlimiter(mockReq, mockRes, mockNext);
        ServerLimiter(mockReq, mockRes, mockNext);
      }
      
      // Both should allow all 10 requests
      expect(mockNext).toHaveBeenCalledTimes(20);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});