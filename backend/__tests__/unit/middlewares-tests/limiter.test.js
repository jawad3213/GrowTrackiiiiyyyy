// limiter.test.js
const mockRateLimitFn = jest.fn().mockImplementation(config => {
    return { __rateLimit_config: config };
  });
  
  jest.mock('express-rate-limit', () => {
    return mockRateLimitFn;
  });
  
  const rateLimit = require('express-rate-limit');
  const { Authlimiter, ServerLimiter } = require('../../../middlewares/Limiter');
  
  describe('Rate Limiters', () => {
    beforeEach(() => {
      // Clear mock calls between tests
      rateLimit.mockClear();
    });
  
    describe('Authlimiter', () => {
      test('should be configured with correct window time (30 minutes)', () => {
        expect(Authlimiter.__rateLimit_config.windowMs).toBe(30 * 60 * 1000);
      });
  
      test('should be configured with max 20 requests', () => {
        expect(Authlimiter.__rateLimit_config.max).toBe(20);
      });
  
      test('should use IP as key generator', () => {
        const mockReq = { ip: '127.0.0.1' };
        expect(Authlimiter.__rateLimit_config.keyGenerator(mockReq)).toBe('127.0.0.1');
      });
  
      test('should have correct error message', () => {
        expect(Authlimiter.__rateLimit_config.message).toEqual({
          status: 429,
          message: "Too many attemps, please try again after 30 minutes."
        });
      });
  
      test('should have standardHeaders enabled', () => {
        expect(Authlimiter.__rateLimit_config.standardHeaders).toBe(true);
      });
  
      test('should have legacyHeaders disabled', () => {
        expect(Authlimiter.__rateLimit_config.legacyHeaders).toBe(false);
      });
    });
  
    describe('ServerLimiter', () => {
      test('should be configured with correct window time (60 minutes)', () => {
        expect(ServerLimiter.__rateLimit_config.windowMs).toBe(60 * 60 * 1000);
      });
  
      test('should be configured with max 250 requests', () => {
        expect(ServerLimiter.__rateLimit_config.max).toBe(250);
      });
  
      test('should have correct error message', () => {
        expect(ServerLimiter.__rateLimit_config.message).toEqual({
          status: 429,
          message: "Too many requests, please try again after 60 minutes."
        });
      });
  
      test('should have standardHeaders enabled', () => {
        expect(ServerLimiter.__rateLimit_config.standardHeaders).toBe(true);
      });
  
      test('should have legacyHeaders disabled', () => {
        expect(ServerLimiter.__rateLimit_config.legacyHeaders).toBe(false);
      });
    });
  });