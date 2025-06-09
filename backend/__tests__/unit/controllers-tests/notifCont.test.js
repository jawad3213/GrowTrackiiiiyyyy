const notifiModel = require('../../../models/studentModels/notifiModel');
const { allNotifications } = require('../../../controllers/studentControllers/notifiController'); 

// Mock the notification model
jest.mock('../../../models/studentModels/notifiModel');

describe('Notifications Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock console.error to avoid console output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock request object
    req = {
      params: {
        id_student: '123'
      }
    };

    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();
  });

  describe('allNotifications function - Success Cases', () => {
    test('should retrieve notifications successfully and return 200 status', async () => {
      // Arrange
      const mockNotifications = [
        { id: 1, message: 'Test notification 1', date: '2024-01-01' },
        { id: 2, message: 'Test notification 2', date: '2024-01-02' }
      ];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('123');
      expect(notifiModel.getAllNotifications).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications
      });
    });

    test('should handle empty notifications array', async () => {
      // Arrange
      const mockNotifications = [];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });

    test('should handle different student IDs correctly', async () => {
      // Arrange
      req.params.id_student = '456';
      const mockNotifications = [
        { id: 3, message: 'Notification for student 456', date: '2024-01-03' }
      ];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications
      });
    });

    test('should handle string student ID', async () => {
      // Arrange
      req.params.id_student = 'abc123';
      const mockNotifications = [
        { id: 4, message: 'Notification for student abc123', date: '2024-01-04' }
      ];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('abc123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications
      });
    });

    test('should handle null response from model', async () => {
      // Arrange
      notifiModel.getAllNotifications.mockResolvedValue(null);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null
      });
    });
  });

  describe('allNotifications function - Error Cases', () => {
    test('should handle model errors and return 500 status', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');
      notifiModel.getAllNotifications.mockRejectedValue(mockError);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('123');
      expect(console.error).toHaveBeenCalledWith('Error in allNotifications:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error"
      });
    });

    test('should handle missing student ID parameter', async () => {
      // Arrange
      req.params = {}; // No id_student parameter
      const mockError = new Error('Student ID is required');
      notifiModel.getAllNotifications.mockRejectedValue(mockError);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith(undefined);
      expect(console.error).toHaveBeenCalledWith('Error in allNotifications:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error"
      });
    });

    test('should handle undefined id_student parameter', async () => {
      // Arrange
      req.params.id_student = undefined;
      const mockError = new Error('Invalid student ID');
      notifiModel.getAllNotifications.mockRejectedValue(mockError);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith(undefined);
      expect(console.error).toHaveBeenCalledWith('Error in allNotifications:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error"
      });
    });

    test('should handle network timeout errors', async () => {
      // Arrange
      const mockError = new Error('TIMEOUT: Request timed out');
      notifiModel.getAllNotifications.mockRejectedValue(mockError);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('123');
      expect(console.error).toHaveBeenCalledWith('Error in allNotifications:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error"
      });
    });

    test('should handle validation errors from model', async () => {
      // Arrange
      const mockError = new Error('Invalid student ID format');
      notifiModel.getAllNotifications.mockRejectedValue(mockError);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('123');
      expect(console.error).toHaveBeenCalledWith('Error in allNotifications:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error"
      });
    });
  });

  describe('Function behavior validation', () => {
    test('should call getAllNotifications only once per request', async () => {
      // Arrange
      const mockNotifications = [{ id: 1, message: 'Test' }];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledTimes(1);
    });

    test('should pass correct student ID to model', async () => {
      // Arrange
      const testId = 'student_789';
      req.params.id_student = testId;
      notifiModel.getAllNotifications.mockResolvedValue([]);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith(testId);
    });

    test('should return response object correctly', async () => {
      // Arrange
      notifiModel.getAllNotifications.mockResolvedValue([]);

      // Act
      const result = await allNotifications(req, res);

      // Assert
      expect(result).toBeUndefined(); // Function doesn't explicitly return anything
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test('should handle concurrent requests properly', async () => {
      // Arrange
      const mockNotifications = [{ id: 1, message: 'Test' }];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act - Simulate multiple concurrent calls
      const promises = [
        allNotifications(req, res),
        allNotifications(req, res),
        allNotifications(req, res)
      ];
      await Promise.all(promises);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledTimes(3);
      expect(res.status).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge cases', () => {
    test('should handle very large notifications array', async () => {
      // Arrange
      const largeNotificationsArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        message: `Notification ${i + 1}`,
        date: '2024-01-01'
      }));
      notifiModel.getAllNotifications.mockResolvedValue(largeNotificationsArray);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: largeNotificationsArray
      });
    });

    test('should handle special characters in student ID', async () => {
      // Arrange
      req.params.id_student = 'student@123#$%';
      const mockNotifications = [{ id: 1, message: 'Special chars test' }];
      notifiModel.getAllNotifications.mockResolvedValue(mockNotifications);

      // Act
      await allNotifications(req, res);

      // Assert
      expect(notifiModel.getAllNotifications).toHaveBeenCalledWith('student@123#$%');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});