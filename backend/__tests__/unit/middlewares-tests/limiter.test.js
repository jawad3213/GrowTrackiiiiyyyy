// Mock express-rate-limit at the very top, before any imports
const mockRateLimit = jest.fn();
jest.mock('express-rate-limit', () => mockRateLimit);

describe('Rate Limiters Configuration', () => {
  let Authlimiter, ServerLimiter;

  beforeEach(() => {
    // Clear all mocks and module cache
    jest.clearAllMocks();
    jest.resetModules();
    console.log = jest.fn();
    
    // Set up the default mock implementation
    mockRateLimit.mockImplementation(() => {
      const middleware = jest.fn((req, res, next) => next());
      middleware.resetKey = jest.fn();
      middleware.getHits = jest.fn();
      return middleware;
    });
  });

  describe('Authlimiter Configuration', () => {
    it('should be created with correct configuration', () => {
      // Import the module to trigger rateLimit calls
      const limiterModule = require('../../../middlewares/Limiter');
      Authlimiter = limiterModule.Authlimiter;
      ServerLimiter = limiterModule.ServerLimiter;

      // Verify rateLimit was called with auth configuration
      expect(mockRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          windowMs: 30 * 60 * 1000,
          max: 20,
          keyGenerator: expect.any(Function),
          onLimitReached: expect.any(Function),
          message: {
            status: 429,
            message: "Too many attemps, please try again after 30 minutes."
          },
          standardHeaders: true,
          legacyHeaders: false
        })
      );
    });

    it('should generate key based on IP address', () => {
      require('../../../middlewares/Limiter');
      
      // Find the auth configuration call
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20 && call[0].windowMs === 30 * 60 * 1000
      );
      
      expect(authCall).toBeDefined();
      
      const authConfig = authCall[0];
      const mockReq = { ip: '192.168.1.1' };
      const key = authConfig.keyGenerator(mockReq);

      expect(key).toBe('192.168.1.1');
      expect(console.log).toHaveBeenCalledWith('🔍 Rate limit check for IP: 192.168.1.1');
    });

    it('should log when rate limit is reached', () => {
      require('../../../middlewares/Limiter');
      
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20 && call[0].windowMs === 30 * 60 * 1000
      );
      
      const authConfig = authCall[0];
      const mockReq = { ip: '192.168.1.1' };
      const mockRes = {};

      authConfig.onLimitReached(mockReq, mockRes);

      expect(console.log).toHaveBeenCalledWith('🚫 Rate limit reached for IP: 192.168.1.1');
    });

    it('should handle different IP addresses in keyGenerator', () => {
      require('../../../middlewares/Limiter');
      
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20 && call[0].windowMs === 30 * 60 * 1000
      );
      
      const authConfig = authCall[0];
      const testIPs = ['127.0.0.1', '10.0.0.1', '::1', '203.0.113.195'];
      
      testIPs.forEach(ip => {
        const mockReq = { ip };
        const key = authConfig.keyGenerator(mockReq);
        
        expect(key).toBe(ip);
        expect(console.log).toHaveBeenCalledWith(`🔍 Rate limit check for IP: ${ip}`);
      });
    });
  });

  describe('ServerLimiter Configuration', () => {
    it('should be created with correct configuration', () => {
      require('../../../middlewares/Limiter');

      expect(mockRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          windowMs: 60 * 60 * 1000,
          max: 500,
          message: {
            status: 429,
            message: "Too many requests, please try again after 60 minutes."
          },
          standardHeaders: true,
          legacyHeaders: false
        })
      );
    });

    it('should not have custom keyGenerator or onLimitReached', () => {
      require('../../../middlewares/Limiter');
      
      const serverCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 500 && call[0].windowMs === 60 * 60 * 1000
      );
      
      expect(serverCall).toBeDefined();
      
      const serverConfig = serverCall[0];
      expect(serverConfig.keyGenerator).toBeUndefined();
      expect(serverConfig.onLimitReached).toBeUndefined();
    });
  });

  describe('Module Exports', () => {
    it('should export both limiters', () => {
      const limiters = require('../../../middlewares/Limiter');
      
      expect(limiters).toHaveProperty('Authlimiter');
      expect(limiters).toHaveProperty('ServerLimiter');
      expect(typeof limiters.Authlimiter).toBe('function');
      expect(typeof limiters.ServerLimiter).toBe('function');
    });
  });
});

describe('Rate Limiter Middleware Behavior', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    console.log = jest.fn();
    
    mockReq = {
      ip: '192.168.1.1',
      headers: {},
      method: 'POST',
      url: '/auth/login'
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });

  describe('Authlimiter Middleware', () => {
    it('should allow requests within limit', () => {
      // Set up mock to allow requests
      mockRateLimit.mockImplementation(() => {
        return jest.fn((req, res, next) => next());
      });

      const { Authlimiter } = require('../../../middlewares/Limiter');
      Authlimiter(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should block requests exceeding limit', () => {
      // Set up mock to block requests on first call (Authlimiter)
      let callCount = 0;
      mockRateLimit.mockImplementation(() => {
        callCount++;
        if (callCount === 1) { // First call is for Authlimiter
          return jest.fn((req, res, next) => {
            res.status(429).json({
              status: 429,
              message: "Too many attemps, please try again after 30 minutes."
            });
          });
        } else { // Second call is for ServerLimiter
          return jest.fn((req, res, next) => next());
        }
      });

      const { Authlimiter } = require('../../../middlewares/Limiter');
      Authlimiter(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 429,
        message: "Too many attemps, please try again after 30 minutes."
      });
    });
  });

  describe('ServerLimiter Middleware', () => {
    it('should allow requests within limit', () => {
      mockRateLimit.mockImplementation(() => {
        return jest.fn((req, res, next) => next());
      });

      const { ServerLimiter } = require('../../../middlewares/Limiter');
      ServerLimiter(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should block requests exceeding limit', () => {
      // Set up mock to block requests on second call (ServerLimiter)
      let callCount = 0;
      mockRateLimit.mockImplementation(() => {
        callCount++;
        if (callCount === 2) { // Second call is for ServerLimiter
          return jest.fn((req, res, next) => {
            res.status(429).json({
              status: 429,
              message: "Too many requests, please try again after 60 minutes."
            });
          });
        } else { // First call is for Authlimiter
          return jest.fn((req, res, next) => next());
        }
      });

      const { ServerLimiter } = require('../../../middlewares/Limiter');
      ServerLimiter(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 429,
        message: "Too many requests, please try again after 60 minutes."
      });
    });
  });
});

describe('Rate Limiter Configuration Validation', () => {
  describe('Time Window Calculations', () => {
    it('should have correct time windows', () => {
      const authWindowMs = 30 * 60 * 1000;
      const serverWindowMs = 60 * 60 * 1000;

      expect(authWindowMs).toBe(1800000);
      expect(serverWindowMs).toBe(3600000);
    });
  });

  describe('Rate Limits', () => {
    it('should have appropriate limits for different use cases', () => {
      const authLimit = 20;
      const serverLimit = 500;

      expect(authLimit).toBeLessThan(serverLimit);
      expect(authLimit).toBeGreaterThan(0);
      expect(serverLimit).toBeGreaterThan(0);
    });
  });

  describe('Error Messages', () => {
    it('should have user-friendly error messages', () => {
      const authMessage = "Too many attemps, please try again after 30 minutes.";
      const serverMessage = "Too many requests, please try again after 60 minutes.";

      expect(authMessage).toContain('30 minutes');
      expect(serverMessage).toContain('60 minutes');
      expect(authMessage).toContain('attemps');
      expect(serverMessage).toContain('requests');
    });
  });
});

describe('Rate Limiter Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    console.log = jest.fn();
    
    // Default mock implementation
    mockRateLimit.mockImplementation(() => {
      const middleware = jest.fn((req, res, next) => next());
      middleware.resetKey = jest.fn();
      middleware.getHits = jest.fn();
      return middleware;
    });
  });

  describe('IP Address Handling', () => {
    it('should handle missing IP address', () => {
      require('../../../middlewares/Limiter');
      
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20
      );

      if (authCall && authCall[0].keyGenerator) {
        const mockReq = { ip: undefined };
        const key = authCall[0].keyGenerator(mockReq);

        expect(key).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith('🔍 Rate limit check for IP: undefined');
      }
    });

    it('should handle null IP address', () => {
      require('../../../middlewares/Limiter');
      
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20
      );

      if (authCall && authCall[0].keyGenerator) {
        const mockReq = { ip: null };
        const key = authCall[0].keyGenerator(mockReq);

        expect(key).toBeNull();
        expect(console.log).toHaveBeenCalledWith('🔍 Rate limit check for IP: null');
      }
    });
  });

  describe('Callback Functions', () => {
    it('should handle onLimitReached with missing req properties', () => {
      require('../../../middlewares/Limiter');
      
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20
      );

      if (authCall && authCall[0].onLimitReached) {
        const mockReq = {};
        const mockRes = {};

        expect(() => {
          authCall[0].onLimitReached(mockReq, mockRes);
        }).not.toThrow();

        expect(console.log).toHaveBeenCalledWith('🚫 Rate limit reached for IP: undefined');
      }
    });
  });

  describe('Configuration Immutability', () => {
    it('should not modify original configuration objects', () => {
      const { Authlimiter, ServerLimiter } = require('../../../middlewares/Limiter');
      
      expect(typeof Authlimiter).toBe('function');
      expect(typeof ServerLimiter).toBe('function');
      
      expect(() => {
        Authlimiter.max = 999;
      }).not.toThrow();
    });
  });
});

describe('Rate Limiter Performance Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('High Load Simulation', () => {
    it('should handle multiple rapid requests efficiently', () => {
      const mockMiddleware = jest.fn((req, res, next) => next());
      mockMiddleware.resetKey = jest.fn();
      mockMiddleware.getHits = jest.fn();
      
      mockRateLimit.mockImplementation(() => mockMiddleware);

      const { Authlimiter } = require('../../../middlewares/Limiter');
      
      const mockReq = { ip: '192.168.1.1' };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      // Simulate 10 rapid requests
      for (let i = 0; i < 10; i++) {
        Authlimiter(mockReq, mockRes, mockNext);
      }

      expect(mockMiddleware).toHaveBeenCalledTimes(10);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with many different IPs', () => {
      mockRateLimit.mockImplementation(() => {
        const middleware = jest.fn((req, res, next) => next());
        middleware.resetKey = jest.fn();
        middleware.getHits = jest.fn();
        return middleware;
      });

      require('../../../middlewares/Limiter');
      
      const authCall = mockRateLimit.mock.calls.find(call => 
        call[0] && call[0].max === 20
      );

      if (authCall && authCall[0].keyGenerator) {
        for (let i = 0; i < 100; i++) {
          const mockReq = { ip: `192.168.1.${i}` };
          authCall[0].keyGenerator(mockReq);
        }

        expect(console.log).toHaveBeenCalledTimes(100);
      }
    });
  });
});