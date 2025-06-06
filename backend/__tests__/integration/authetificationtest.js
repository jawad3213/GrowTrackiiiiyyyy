const request = require('supertest');
const app = require('../../server');
const testDB = require('../../config/skills');
const bcrypt = require('bcrypt');

describe('Authentication Integration Tests', () => {
  
  // Test data
  let testUser;
  let validTokens = {};
  
  beforeAll(async () => {
    // Ensure we're using test environment
    process.env.NODE_ENV = 'test';
    
    // Wait for database connection
    await testDB.query('SELECT NOW()');
    
    // Create users table if it doesn't exist
    await createUsersTable();
  });

  beforeEach(async () => {
    // Clean up and create fresh test data
    await cleanupTestData();
    testUser = await createTestUser();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await testDB.end();
  });

  // ==================== LOGIN TESTS ====================
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Connected Successfully !');
      
      // Verify cookies are set
      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = response.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('access_token'))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('refresh_token'))).toBe(true);
    });

    it('should reject invalid email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Email or Password is incorrect');
    });

    it('should reject invalid password', async () => {
      const loginData = {
        email: testUser.email,
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Email or Password is incorrect');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });

    it('should handle malformed email', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);
    });
  });

  // ==================== PROTECTED ROUTES TESTS ====================
  describe('Protected Routes Authentication', () => {
    
    beforeEach(async () => {
      // Login and get valid tokens
      validTokens = await loginAndGetTokens(testUser.email, 'TestPassword123');
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/validate-reset-token')
        .set('Cookie', [`access_token=${validTokens.accessToken}`])
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.id).toBe(testUser.id);
      expect(response.body.role).toBe(testUser.role);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/validate-reset-token')
        .expect(401);

      expect(response.body.message).toMatch(/token|authentication/i);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/validate-reset-token')
        .set('Cookie', ['access_token=invalid_token_here'])
        .expect(401);
    });

    it('should reject request with expired token', async () => {
      // Create an expired token (you'd need to modify your JWT creation for testing)
      const expiredToken = 'expired_jwt_token_here';
      
      const response = await request(app)
        .get('/api/validate-reset-token')
        .set('Cookie', [`access_token=${expiredToken}`])
        .expect(401);
    });
  });

  // ==================== ROLE-BASED ACCESS TESTS ====================
  describe('Role-Based Access Control', () => {
    
    let adminTokens, studentTokens, professorTokens;

    beforeEach(async () => {
      // Create users with different roles
      const adminUser = await createTestUser('admin@test.com', 'admin');
      const studentUser = await createTestUser('student@test.com', 'student');
      const professorUser = await createTestUser('professor@test.com', 'professor');

      // Get tokens for each role
      adminTokens = await loginAndGetTokens(adminUser.email, 'TestPassword123');
      studentTokens = await loginAndGetTokens(studentUser.email, 'TestPassword123');
      professorTokens = await loginAndGetTokens(professorUser.email, 'TestPassword123');
    });

    it('should allow admin access to admin routes', async () => {
      const response = await request(app)
        .get('/admin/students')
        .set('Cookie', [`access_token=${adminTokens.accessToken}`])
        .expect(200);
    });

    it('should deny student access to admin routes', async () => {
      const response = await request(app)
        .get('/admin/students')
        .set('Cookie', [`access_token=${studentTokens.accessToken}`])
        .expect(403);

      expect(response.body.message).toMatch(/access denied|forbidden/i);
    });

    it('should allow professor access to professor routes', async () => {
      const response = await request(app)
        .get('/prof/dashboard')
        .set('Cookie', [`access_token=${professorTokens.accessToken}`])
        .expect(200);
    });

    it('should deny student access to professor routes', async () => {
      const response = await request(app)
        .get('/prof/dashboard')
        .set('Cookie', [`access_token=${studentTokens.accessToken}`])
        .expect(403);
    });
  });

  // ==================== TOKEN REFRESH TESTS ====================
  describe('POST /api/auth/refresh', () => {
    
    beforeEach(async () => {
      validTokens = await loginAndGetTokens(testUser.email, 'TestPassword123');
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${validTokens.refreshToken}`])
        .expect(201);

      expect(response.body.message).toBe('The new access token is set!');
      
      // Verify new access token is set in cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('access_token'))).toBe(true);
    });

    it('should reject refresh without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .expect(401);

      expect(response.body.message).toBe('No token refresh was found, Please login again!');
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refresh_token=invalid_refresh_token'])
        .expect(401);

      expect(response.body.message).toBe('Invalid or expired refresh token!');
    });
  });

  // ==================== LOGOUT TESTS ====================
  describe('POST /api/auth/logout', () => {
    
    beforeEach(async () => {
      validTokens = await loginAndGetTokens(testUser.email, 'TestPassword123');
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', [
          `access_token=${validTokens.accessToken}`,
          `refresh_token=${validTokens.refreshToken}`
        ])
        .expect(200);

      expect(response.body.message).toBe('Logout successful');
      
      // Verify cookies are cleared
      const cookies = response.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('access_token=;'))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('refresh_token=;'))).toBe(true);
    });

    it('should handle logout without tokens', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.message).toBe('Logout successful');
    });
  });

  // ==================== PASSWORD RESET TESTS ====================
  describe('Password Reset Flow', () => {
    
    it('should initiate password reset for valid email', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body.message).toMatch(/password reset email has been sent/i);
    });

    it('should reject password reset for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'nonexistent@test.com' })
        .expect(400);

      expect(response.body.message).toBe('User not found with this email ❌');
    });

    it('should reset password with valid reset token', async () => {
      // First, initiate password reset to get token
      const resetToken = await generateResetToken(testUser.id);
      
      const newPassword = 'NewPassword123';
      const response = await request(app)
        .post('/api/resetpass')
        .set('Cookie', [`reset_token=${resetToken}`])
        .send({ password: newPassword })
        .expect(201);

      expect(response.body.message).toBe('The password was updated successfully!');
      
      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: newPassword
        })
        .expect(200);
    });
  });

  // ==================== SECURITY TESTS ====================
  describe('Security Tests', () => {
    
    it('should prevent SQL injection in login', async () => {
      const maliciousLogin = {
        email: "admin@test.com'; DROP TABLE users; --",
        password: 'password'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(maliciousLogin)
        .expect(401);

      // Verify table still exists
      const result = await testDB.query('SELECT COUNT(*) FROM users');
      expect(result.rows[0].count).toBeGreaterThan(0);
    });

    it('should hash passwords in database', async () => {
      // Verify password is not stored in plain text
      const user = await testDB.query('SELECT password FROM users WHERE email = $1', [testUser.email]);
      expect(user.rows[0].password).not.toBe('TestPassword123');
      expect(user.rows[0].password.length).toBeGreaterThan(50); // Bcrypt hash length
    });

    it('should rate limit login attempts', async () => {
      const loginData = {
        email: testUser.email,
        password: 'WrongPassword'
      };

      // Make multiple failed attempts
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(loginData);
      }

      // Should be rate limited now
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(429);
    });
  });

  // ==================== HELPER FUNCTIONS ====================
  
  async function createUsersTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id_member SERIAL PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await testDB.query(createTableQuery);
      console.log('✅ Users table created/verified');
    } catch (error) {
      console.error('❌ Error creating users table:', error);
      throw error;
    }
  }
  
  async function createTestUser(email = 'test@example.com', role = 'student') {
    const hashedPassword = await bcrypt.hash('TestPassword123', 10);
    
    const result = await testDB.query(`
      INSERT INTO users (fullname, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id_member as id, email, role, fullname
    `, ['Test User', email, hashedPassword, role]);
    
    return result.rows[0];
  }

  async function loginAndGetTokens(email, password) {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    const cookies = response.headers['set-cookie'];
    const accessToken = extractTokenFromCookie(cookies, 'access_token');
    const refreshToken = extractTokenFromCookie(cookies, 'refresh_token');

    return { accessToken, refreshToken };
  }

  function extractTokenFromCookie(cookies, tokenName) {
    const cookie = cookies.find(c => c.includes(tokenName));
    if (!cookie) return null;
    
    const match = cookie.match(new RegExp(`${tokenName}=([^;]+)`));
    return match ? match[1] : null;
  }

  async function generateResetToken(userId) {
    const JWT = require('jsonwebtoken');
    return JWT.sign(
      { id: userId },
      process.env.RESET_SECRET,
      { expiresIn: '15m' }
    );
  }

  async function cleanupTestData() {
    try {
      await testDB.query('DELETE FROM users WHERE email LIKE $1', ['%test.com']);
    } catch (error) {
      // If table doesn't exist, that's okay for cleanup
      if (!error.message.includes('does not exist')) {
        throw error;
      }
    }
  }
});