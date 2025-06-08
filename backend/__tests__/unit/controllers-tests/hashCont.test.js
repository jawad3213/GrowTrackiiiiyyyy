const bcrypt = require('bcrypt');
const { hachage } = require('../../../controllers/HashController'); // Adjust the path

// Mock bcrypt module
jest.mock('bcrypt');

describe('Password Hashing Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request object
    req = {
      body: {
        password: 'testPassword123'
      }
    };

    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('hachage function - Success Cases', () => {
    test('should hash password successfully and return 201 status', async () => {
      // Arrange
      const mockHashedPassword = '$2b$10$hashedPasswordExample';
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      // Act
      await hachage(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword123', 10);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        succes: true,
        message: "Mot de passe haché avec succès !",
        motDePasseHache: mockHashedPassword
      });
    });

    test('should handle different password inputs correctly', async () => {
      // Arrange
      req.body.password = 'anotherPassword456!@#';
      const mockHashedPassword = '$2b$10$anotherHashedPasswordExample';
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      // Act
      await hachage(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('anotherPassword456!@#', 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        succes: true,
        message: "Mot de passe haché avec succès !",
        motDePasseHache: mockHashedPassword
      });
    });

    test('should handle empty password string', async () => {
      // Arrange
      req.body.password = '';
      const mockHashedPassword = '$2b$10$emptyPasswordHash';
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      // Act
      await hachage(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        succes: true,
        message: "Mot de passe haché avec succès !",
        motDePasseHache: mockHashedPassword
      });
    });
  });

  describe('hachage function - Error Cases', () => {
    test('should handle bcrypt.hash errors and return 500 status', async () => {
      // Arrange
      const mockError = new Error('Bcrypt hashing failed');
      bcrypt.hash.mockRejectedValue(mockError);

      // Act
      await hachage(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword123', 10);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        succes: false,
        message: "Erreur lors du hachage du mot de passe",
        error: mockError
      });
    });

    test('should handle missing password in request body', async () => {
      // Arrange
      req.body = {}; // No password provided
      const mockError = new Error('Cannot read property password');
      bcrypt.hash.mockRejectedValue(mockError);

      // Act
      await hachage(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        succes: false,
        message: "Erreur lors du hachage du mot de passe",
        error: mockError
      });
    });

    test('should handle undefined password', async () => {
      // Arrange
      req.body.password = undefined;
      const mockError = new Error('Password is undefined');
      bcrypt.hash.mockRejectedValue(mockError);

      // Act
      await hachage(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        succes: false,
        message: "Erreur lors du hachage du mot de passe",
        error: mockError
      });
    });
  });

  describe('Function behavior validation', () => {
    test('should use salt rounds of 10', async () => {
      // Arrange
      const mockHashedPassword = '$2b$10$testHash';
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      // Act
      await hachage(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(
        expect.any(String),
        10 // Verify salt rounds
      );
    });

    test('should call bcrypt.hash only once per request', async () => {
      // Arrange
      const mockHashedPassword = '$2b$10$testHash';
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      // Act
      await hachage(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    });

    test('should return response object correctly', async () => {
      // Arrange
      const mockHashedPassword = '$2b$10$testHash';
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      // Act
      const result = await hachage(req, res);

      // Assert
      expect(result).toBe(res); // Should return the response object
    });
  });
});