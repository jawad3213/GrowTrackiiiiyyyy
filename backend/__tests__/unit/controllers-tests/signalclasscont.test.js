const signalController = require('../../../controllers/profController/signal_classes_Controller.js');

// Mock the signal_Model
jest.mock('../../../models/profmodels/signal_classes_Model.js', () => ({
  get_sector_Model: jest.fn(),
  get_classes_Model: jest.fn(),
  get_all_student_Model: jest.fn(),
  search_cne_student_Model: jest.fn(),
  filter_student_Model: jest.fn(),
  new_signal_Model: jest.fn(),
  signal_history_Model: jest.fn(),
}));

const signal_Model = require('../../../models/profmodels/signal_classes_Model.js');

describe('Signal Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response objects
    mockReq = {
      user: { id: 'user123' },
      params: {},
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('get_sector_Controller', () => {
    it('should return sectors with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Sector 1' },
        { id: 2, name: 'Sector 2' }
      ];
      signal_Model.get_sector_Model.mockResolvedValue(mockResult);

      await signalController.get_sector_Controller(mockReq, mockRes);

      expect(signal_Model.get_sector_Model).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 204 when no data exists', async () => {
      signal_Model.get_sector_Model.mockResolvedValue([]);

      await signalController.get_sector_Controller(mockReq, mockRes);

      expect(signal_Model.get_sector_Model).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle database errors', async () => {
      signal_Model.get_sector_Model.mockRejectedValue(new Error('Database error'));

      await signalController.get_sector_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('get_classes_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_sector: 'sector123' };
    });

    it('should return classes with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Class A' },
        { id: 2, name: 'Class B' },
        { id: 3, name: 'Class C' }
      ];
      signal_Model.get_classes_Model.mockResolvedValue(mockResult);

      await signalController.get_classes_Controller(mockReq, mockRes);

      expect(signal_Model.get_classes_Model).toHaveBeenCalledWith('user123', 'sector123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 3,
        result: mockResult
      });
    });

    it('should return 204 when no classes found', async () => {
      signal_Model.get_classes_Model.mockResolvedValue([]);

      await signalController.get_classes_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      // Note: The original code has incomplete .json() call, assuming it should return no data message
    });

    it('should handle errors properly', async () => {
      signal_Model.get_classes_Model.mockRejectedValue(new Error('Database connection failed'));

      await signalController.get_classes_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('get_student_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_class: 'class123' };
    });

    it('should return students with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Student 1', cne: 'CNE001' },
        { id: 2, name: 'Student 2', cne: 'CNE002' }
      ];
      signal_Model.get_all_student_Model.mockResolvedValue(mockResult);

      await signalController.get_student_Controller(mockReq, mockRes);

      expect(signal_Model.get_all_student_Model).toHaveBeenCalledWith('user123', 'class123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 204 when no students found', async () => {
      signal_Model.get_all_student_Model.mockResolvedValue([]);

      await signalController.get_student_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle errors properly', async () => {
      signal_Model.get_all_student_Model.mockRejectedValue(new Error('Query failed'));

      await signalController.get_student_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('search_cne_student_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_class: 'class123', cne: 'CNE001' };
    });

    it('should return student when CNE is found', async () => {
      const mockResult = [{ id: 1, name: 'John Doe', cne: 'CNE001' }];
      signal_Model.search_cne_student_Model.mockResolvedValue(mockResult);

      await signalController.search_cne_student_Controller(mockReq, mockRes);

      expect(signal_Model.search_cne_student_Model).toHaveBeenCalledWith('user123', 'class123', 'CNE001');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });

    it('should return 204 when CNE not found', async () => {
      signal_Model.search_cne_student_Model.mockResolvedValue([]);

      await signalController.search_cne_student_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle search errors', async () => {
      signal_Model.search_cne_student_Model.mockRejectedValue(new Error('Search failed'));

      await signalController.search_cne_student_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('filter_student_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_class: 'class123', choice: 'active' };
    });

    it('should return filtered students when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Active Student 1', status: 'active' },
        { id: 2, name: 'Active Student 2', status: 'active' }
      ];
      signal_Model.filter_student_Model.mockResolvedValue(mockResult);

      await signalController.filter_student_Controller(mockReq, mockRes);

      expect(signal_Model.filter_student_Model).toHaveBeenCalledWith('user123', 'class123', 'active');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 204 when no filtered results', async () => {
      signal_Model.filter_student_Model.mockResolvedValue([]);

      await signalController.filter_student_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle filter errors', async () => {
      signal_Model.filter_student_Model.mockRejectedValue(new Error('Filter operation failed'));

      await signalController.filter_student_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('new_signal_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_student: 'student123' };
      mockReq.body = {
        Title: 'Test Signal',
        Description: 'This is a test signal',
        Anonyme: false
      };
    });

    it('should create new signal successfully', async () => {
      const mockResult = [{ id: 1, title: 'Test Signal', created: true }];
      signal_Model.new_signal_Model.mockResolvedValue(mockResult);

      await signalController.new_signal_Controller(mockReq, mockRes);

      expect(signal_Model.new_signal_Model).toHaveBeenCalledWith(
        'user123',
        'student123',
        'Test Signal',
        'This is a test signal',
        false
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });

    it('should return 204 when signal creation fails', async () => {
      signal_Model.new_signal_Model.mockResolvedValue([]);

      await signalController.new_signal_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle signal creation errors', async () => {
      signal_Model.new_signal_Model.mockRejectedValue(new Error('Signal creation failed'));

      await signalController.new_signal_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle anonymous signals', async () => {
      mockReq.body.Anonyme = true;
      const mockResult = [{ id: 1, title: 'Test Signal', anonymous: true }];
      signal_Model.new_signal_Model.mockResolvedValue(mockResult);

      await signalController.new_signal_Controller(mockReq, mockRes);

      expect(signal_Model.new_signal_Model).toHaveBeenCalledWith(
        'user123',
        'student123',
        'Test Signal',
        'This is a test signal',
        true
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('signal_history_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_student: 'student123' };
    });

    it('should return signal history when data exists', async () => {
      const mockResult = [
        { id: 1, title: 'Signal 1', date: '2024-01-01' },
        { id: 2, title: 'Signal 2', date: '2024-01-02' },
        { id: 3, title: 'Signal 3', date: '2024-01-03' }
      ];
      signal_Model.signal_history_Model.mockResolvedValue(mockResult);

      await signalController.signal_history_Controller(mockReq, mockRes);

      expect(signal_Model.signal_history_Model).toHaveBeenCalledWith('user123', 'student123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 3,
        result: mockResult
      });
    });

    it('should return 204 when no signal history found', async () => {
      signal_Model.signal_history_Model.mockResolvedValue([]);

      await signalController.signal_history_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle history retrieval errors', async () => {
      signal_Model.signal_history_Model.mockRejectedValue(new Error('History query failed'));

      await signalController.signal_history_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle missing user ID', async () => {
      mockReq.user = {};
      signal_Model.get_sector_Model.mockRejectedValue(new Error('User ID required'));

      await signalController.get_sector_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle missing request parameters', async () => {
      mockReq.params = {};
      signal_Model.get_classes_Model.mockRejectedValue(new Error('Missing parameters'));

      await signalController.get_classes_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle incomplete request body for new signal', async () => {
      mockReq.params = { id_student: 'student123' };
      mockReq.body = { Title: 'Incomplete' }; // Missing Description and Anonyme
      signal_Model.new_signal_Model.mockRejectedValue(new Error('Missing required fields'));

      await signalController.new_signal_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});