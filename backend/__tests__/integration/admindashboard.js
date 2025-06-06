const request = require('supertest');
const app = require('../../server'); // Adjust path to your main app file
const testDB = require('../../config/skills'); // Your test database connection

// Mock the authentication middleware for testing
jest.mock('../../middlewares/VerifyToken', () => ({
  verifyToken: (req, res, next) => {
    // Mock successful token verification
    req.user = { id: 1, role: 'admin' }; // Add mock user data
    next();
  }
}));

jest.mock('../../middlewares/verificationRole', () => {
  return (role) => (req, res, next) => {
    // Mock successful role verification
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
});

describe('Admin Dashboard Controller Integration Tests', () => {
  
  beforeAll(async () => {
    // Ensure we're using the test environment
    process.env.NODE_ENV = 'test';
    
    // Wait for database connection to be ready
    try {
      await testDB.query('SELECT NOW()');
      console.log('✅ Test database connected successfully');
    } catch (error) {
      console.error('❌ Test database connection failed:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Optional: Clean up or seed data before each test
    // await seedTestData();
  });

  afterEach(async () => {
    // Optional: Clean up data after each test
    // await cleanupTestData();
  });

  afterAll(async () => {
    // Close database connection after all tests
    await testDB.end();
    
    // Close the app if it has a close method
    if (app.close) {
      await app.close();
    }
  });

  describe('GET /Total_User', () => {
    it('should return total users from real database', async () => {
      const response = await request(app)
        .get('/Total_User') // Your actual endpoint
        .expect(200);

      // Verify the response structure
      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
      
      // Add more specific assertions based on your expected data structure
      // For example:
      // expect(response.body).toHaveProperty('total');
      // expect(typeof response.body.total).toBe('number');
    });

    it('should handle database connection errors', async () => {
      // Simulate a database error by temporarily breaking the connection
      const originalQuery = testDB.query;
      testDB.query = jest.fn().mockRejectedValue(new Error('Connection lost'));

      const response = await request(app)
        .get('/Total_User')
        .expect(500);

      expect(response.body).toEqual({
        message: "Server Error, Please try again later!"
      });

      // Restore the original query method
      testDB.query = originalQuery;
    });
  });

  describe('GET /Stat_User', () => {
    it('should calculate user difference percentage from real data', async () => {
      const response = await request(app)
        .get('/Stat_User')
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('percentage');
      expect(response.body).toHaveProperty('trend');
      expect(typeof response.body.percentage).toBe('number');
      expect(['increased', 'decreased', 'no change']).toContain(response.body.trend);
    });

    it('should handle edge cases in percentage calculation', async () => {
      const response = await request(app)
        .get('/Stat_User')
        .expect(200);

      // Percentage should be a valid number (not NaN or Infinity)
      expect(Number.isFinite(response.body.percentage)).toBe(true);
    });
  });

  describe('GET /Total_Evaluation', () => {
    it('should return total evaluations from real database', async () => {
      const response = await request(app)
        .get('/Total_Evaluation')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });
  });

  describe('GET /Stat_Evaluation', () => {
    it('should calculate evaluation difference percentage', async () => {
      const response = await request(app)
        .get('/Stat_Evaluation')
        .expect(200);

      expect(response.body).toHaveProperty('percentage');
      expect(response.body).toHaveProperty('trend');
      expect(typeof response.body.percentage).toBe('number');
      expect(['increased', 'decreased', 'no change']).toContain(response.body.trend);
    });
  });

  describe('GET /Stat_Involvement', () => {
    it('should return current involvement data', async () => {
      const response = await request(app)
        .get('/Stat_Involvement')
        .expect(200);

      expect(response.body).toBeDefined();
      // Add specific assertions based on your data structure
    });
  });

  describe('GET /Stat_Involvement_target', () => {
    it('should return involvement target with trend and percentage', async () => {
      const response = await request(app)
        .get('/Stat_Involvement_target')
        .expect(200);

      expect(response.body).toHaveProperty('trend');
      expect(response.body).toHaveProperty('percentage');
      expect(['increased', 'decreased', 'no change']).toContain(response.body.trend);
      expect(typeof response.body.percentage).toBe('number');
    });
  });

  describe('GET /flagged_evaluation', () => {
    it('should return flagged evaluations data', async () => {
      const response = await request(app)
        .get('/flagged_evaluation')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /evaluation_source_overtime', () => {
    it('should return evaluation source overtime data', async () => {
      const response = await request(app)
        .get('/evaluation_source_overtime')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /user_distribution_by_role', () => {
    it('should return user distribution percentages', async () => {
      const response = await request(app)
        .get('/user_distribution_by_role')
        .expect(200);

      expect(response.body).toHaveProperty('student');
      expect(response.body).toHaveProperty('Supervisor');
      expect(response.body).toHaveProperty('Professor');
      
      expect(typeof response.body.student).toBe('number');
      expect(typeof response.body.Supervisor).toBe('number');
      expect(typeof response.body.Professor).toBe('number');

      // Percentages should add up to approximately 100% (allowing for rounding)
      const total = response.body.student + response.body.Supervisor + response.body.Professor;
      expect(total).toBeCloseTo(100, 1);
    });

    it('should handle edge cases with valid percentage calculations', async () => {
      const response = await request(app)
        .get('/user_distribution_by_role')
        .expect(200);

      // All percentages should be finite numbers
      expect(Number.isFinite(response.body.student)).toBe(true);
      expect(Number.isFinite(response.body.Supervisor)).toBe(true);
      expect(Number.isFinite(response.body.Professor)).toBe(true);

      // Percentages should be non-negative
      expect(response.body.student).toBeGreaterThanOrEqual(0);
      expect(response.body.Supervisor).toBeGreaterThanOrEqual(0);
      expect(response.body.Professor).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /news_admin', () => {
    it('should return admin news', async () => {
      const response = await request(app)
        .get('/news_admin')
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(Array.isArray(response.body.news)).toBe(true);
    });
  });

  describe('GET /news_prof', () => {
    it('should return professor news', async () => {
      const response = await request(app)
        .get('/news_prof')
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(Array.isArray(response.body.news)).toBe(true);
    });
  });

  // Test authentication and authorization
  describe('Authentication & Authorization Tests', () => {
    beforeEach(() => {
      // Remove mocks to test real authentication
      jest.restoreAllMocks();
    });

    it('should require authentication token', async () => {
      const response = await request(app)
        .get('/Total_User')
        .expect(401); // Assuming your auth middleware returns 401 for missing token

      // Add specific assertion based on your auth implementation
      // expect(response.body).toHaveProperty('message');
    });

    it('should require admin role', async () => {
      // This test depends on how you handle non-admin users
      // You might need to create a mock token for a non-admin user
      
      // Mock a non-admin user token
      const mockToken = 'mock-non-admin-token';
      
      const response = await request(app)
        .get('/Total_User')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(403); // Assuming 403 for insufficient permissions

      // Add specific assertion based on your auth implementation
    });
  });

  // Test error handling across all endpoints
  describe('Error Handling Tests', () => {
    const endpoints = [
      '/Total_User',
      '/Stat_User',
      '/Total_Evaluation',
      '/Stat_Evaluation',
      '/Stat_Involvement',
      '/Stat_Involvement_target',
      '/flagged_evaluation',
      '/evaluation_source_overtime',
      '/user_distribution_by_role',
      '/news_admin',
      '/news_prof'
    ];

    it.each(endpoints)('should handle server errors gracefully for %s', async (endpoint) => {
      // Temporarily break the database connection
      const originalQuery = testDB.query;
      testDB.query = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(endpoint)
        .expect(500);

      expect(response.body).toEqual({
        message: "Server Error, Please try again later!"
      });

      // Restore the connection
      testDB.query = originalQuery;
    });
  });

  // Helper functions for test data management
  async function seedTestData() {
    // Add test data to your database if needed
    // Example:
    // await testDB.query('INSERT INTO users (name, email, role) VALUES ($1, $2, $3)', ['Test User', 'test@example.com', 'student']);
  }

  async function cleanupTestData() {
    // Clean up test data after each test if needed
    // Example:
    // await testDB.query('DELETE FROM users WHERE email LIKE $1', ['%test%']);
  }
});

// Database connection tests
describe('Database Connection Tests', () => {
  it('should connect to test database successfully', async () => {
    const result = await testDB.query('SELECT NOW() as current_time');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toHaveProperty('current_time');
  });

  it('should be using the test database', async () => {
    const result = await testDB.query('SELECT current_database()');
    expect(result.rows[0].current_database).toBe('skills');
  });
});