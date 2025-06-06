// auth.model.test.js
jest.mock('../../../config/db'); // Mock the database pool
const { LoginModel, FindUserByEmail, GetUserById, UpdatePassById } = require('../../../models/authModel');
const pool = require('../../../config/db');
const bcrypt = require('bcrypt');

// Mock the external dependencies

jest.mock('bcrypt'); // Mock bcrypt for password hashing and comparison

describe('Auth Model', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginModel', () => {
    test('should return member when email exists and password is valid', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: '$2y$10$hashedpassword' 
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] });
      bcrypt.compare.mockResolvedValueOnce(true);

      // Act
      const result = await LoginModel('test@example.com', 'password123');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE email=$1",
        ['test@example.com']
      );
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toEqual(mockMember);
    });

    test('should handle $2y$ to $2a$ password hash conversion correctly', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: '$2y$10$hashedpassword' 
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] });
      bcrypt.compare.mockResolvedValueOnce(true);

      // Act
      await LoginModel('test@example.com', 'password123');

      // Assert
      // Check if bcrypt.compare was called with the converted hash format
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', '$2a$10$hashedpassword');
    });

    test('should not modify $2a$ format hashes', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: '$2a$10$someHashString' 
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] });
      bcrypt.compare.mockResolvedValueOnce(true);

      // Act
      await LoginModel('test@example.com', 'password123');

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', '$2a$10$someHashString');
    });

    test('should return undefined when email exists but password is invalid', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: '$2a$10$hashedpassword' 
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] });
      bcrypt.compare.mockResolvedValueOnce(false);

      // Act
      const result = await LoginModel('test@example.com', 'wrongpassword');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE email=$1",
        ['test@example.com']
      );
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toBeUndefined(); // Function doesn't explicitly return null for invalid password
    });

    test('should return null when email does not exist', async () => {
      // Arrange
      pool.query.mockResolvedValueOnce({ rows: [] });

      // Act
      const result = await LoginModel('nonexistent@example.com', 'password123');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE email=$1",
        ['nonexistent@example.com']
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    // Test hash format conversion with different formats
    test('should handle different $2y$ hash formats', async () => {
      const testCases = [
        { original: '$2y$04$test', expected: '$2a$04$test' },
        { original: '$2y$10$longerhashstring', expected: '$2a$10$longerhashstring' },
        { original: '$2y$12$verylonghashstringwithmanycharacters', expected: '$2a$12$verylonghashstringwithmanycharacters' }
      ];

      for (const { original, expected } of testCases) {
        // Reset mocks for each test case
        jest.clearAllMocks();
        
        const mockMember = { 
          id_member: 1, 
          email: 'test@example.com', 
          password: original
        };
        
        pool.query.mockResolvedValueOnce({ rows: [mockMember] });
        bcrypt.compare.mockResolvedValueOnce(true);

        await LoginModel('test@example.com', 'password123');
        
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', expected);
      }
    });
  });

  describe('FindUserByEmail', () => {
    test('should return member when email exists', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: 'hashedpassword' 
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] });

      // Act
      const result = await FindUserByEmail('test@example.com');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE email = $1",
        ['test@example.com']
      );
      expect(result).toEqual(mockMember);
    });

    test('should return null when email does not exist', async () => {
      // Arrange
      pool.query.mockResolvedValueOnce({ rows: [] });

      // Act
      const result = await FindUserByEmail('nonexistent@example.com');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE email = $1",
        ['nonexistent@example.com']
      );
      expect(result).toBeNull();
    });
  });

  describe('GetUserById', () => {
    test('should return member when ID exists', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: 'hashedpassword' 
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] });

      // Act
      const result = await GetUserById(1);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE id_member = $1",
        [1]
      );
      expect(result).toEqual(mockMember);
    });

    test('should return null when ID does not exist', async () => {
      // Arrange
      pool.query.mockResolvedValueOnce({ rows: [] });

      // Act
      const result = await GetUserById(999);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE id_member = $1",
        [999]
      );
      expect(result).toBeNull();
    });
  });

  describe('UpdatePassById', () => {
    test('should update password and return updated member when ID exists', async () => {
      // Arrange
      const mockMember = { 
        id_member: 1, 
        email: 'test@example.com', 
        password: 'oldhash' 
      };
      
      const updatedMember = {
        id_member: 1, 
        email: 'test@example.com', 
        password: 'newhash'
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMember] }); // First query to check if user exists
      pool.query.mockResolvedValueOnce({ rows: [updatedMember] }); // Second query to update password

      // Act
      const result = await UpdatePassById(1, 'newhash');

      // Assert
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT * FROM public.member WHERE id_member=$1",
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE public.member SET password=$1 WHERE id_member=$2 RETURNING *",
        ['newhash', 1]
      );
      expect(result).toEqual(updatedMember);
    });

    test('should handle database errors', async () => {
      // Arrange
      const mockError = new Error('Database error');
      pool.query.mockRejectedValueOnce(mockError);
      
      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await UpdatePassById(1, 'newhash');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE id_member=$1",
        [1]
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
      
      // Restore console.log
      consoleLogSpy.mockRestore();
    });

    test('should do nothing when user ID does not exist', async () => {
      // Arrange
      pool.query.mockResolvedValueOnce({ rows: [] }); // Empty result means user not found
      
      // Act
      const result = await UpdatePassById(999, 'newhash');

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.member WHERE id_member=$1",
        [999]
      );
      expect(pool.query).toHaveBeenCalledTimes(1); // Should not call update query
      expect(result).toBeUndefined();
    });
  });
});
