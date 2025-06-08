const signalHistoryController = require('../../../controllers/profController/signal_history_Controller.js'); 

// Mock the project_Model
jest.mock('../../../models/profmodels/signal_history_Model.js', () => ({
  all_signal_Model: jest.fn(),
  search_signal_id_Model: jest.fn(),
  filtre_signal_state_Model: jest.fn(),
  filtre_solution_state_Model: jest.fn(),
  view_solution_Model: jest.fn(),
}));

const project_Model = require('../../../models/profmodels/signal_history_Model.js');

describe('Signal History Controller Tests', () => {
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

  describe('all_signal_Controller', () => {
    it('should return all signals with count when data exists', async () => {
      const mockResult = [
        { id: 1, title: 'Signal 1', status: 'pending' },
        { id: 2, title: 'Signal 2', status: 'resolved' },
        { id: 3, title: 'Signal 3', status: 'in_progress' }
      ];
      project_Model.all_signal_Model.mockResolvedValue(mockResult);

      await signalHistoryController.all_signal_Controller(mockReq, mockRes);

      expect(project_Model.all_signal_Model).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 3,
        result: mockResult
      });
    });

    it('should return 204 when no signals exist', async () => {
      project_Model.all_signal_Model.mockResolvedValue([]);

      await signalHistoryController.all_signal_Controller(mockReq, mockRes);

      expect(project_Model.all_signal_Model).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "no data to sent" });
    });

    it('should handle database errors', async () => {
      project_Model.all_signal_Model.mockRejectedValue(new Error('Database connection failed'));

      await signalHistoryController.all_signal_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle single signal result', async () => {
      const mockResult = [{ id: 1, title: 'Single Signal', status: 'pending' }];
      project_Model.all_signal_Model.mockResolvedValue(mockResult);

      await signalHistoryController.all_signal_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });
  });

  describe('search_signal_id_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_signal: '123' };
    });

    it('should return signal when found by ID', async () => {
      const mockResult = [{ id: 123, title: 'Found Signal', status: 'pending' }];
      project_Model.search_signal_id_Model.mockResolvedValue(mockResult);

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(project_Model.search_signal_id_Model).toHaveBeenCalledWith('user123', 123);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });

    it('should return 404 when signal not found', async () => {
      project_Model.search_signal_id_Model.mockResolvedValue(null);

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(project_Model.search_signal_id_Model).toHaveBeenCalledWith('user123', 123);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: "there is no signal with this id for this professor!" 
      });
    });

    it('should return 404 when result is undefined', async () => {
      project_Model.search_signal_id_Model.mockResolvedValue(undefined);

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: "there is no signal with this id for this professor!" 
      });
    });

    it('should handle string ID conversion to integer', async () => {
      mockReq.params.id_signal = '456';
      const mockResult = [{ id: 456, title: 'Signal with string ID' }];
      project_Model.search_signal_id_Model.mockResolvedValue(mockResult);

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(project_Model.search_signal_id_Model).toHaveBeenCalledWith('user123', 456);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle invalid ID format', async () => {
      mockReq.params.id_signal = 'invalid';
      project_Model.search_signal_id_Model.mockRejectedValue(new Error('Invalid ID format'));

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle database errors', async () => {
      project_Model.search_signal_id_Model.mockRejectedValue(new Error('Query failed'));

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('filtre_signal_state_Controller', () => {
    beforeEach(() => {
      mockReq.params = { statut: 'pending' };
    });

    it('should return filtered signals by status', async () => {
      const mockResult = [
        { id: 1, title: 'Pending Signal 1', status: 'pending' },
        { id: 2, title: 'Pending Signal 2', status: 'pending' }
      ];
      project_Model.filtre_signal_state_Model.mockResolvedValue(mockResult);

      await signalHistoryController.filtre_signal_state_Controller(mockReq, mockRes);

      expect(project_Model.filtre_signal_state_Model).toHaveBeenCalledWith('user123', 'pending');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no signals match the status filter', async () => {
      project_Model.filtre_signal_state_Model.mockResolvedValue(null);

      await signalHistoryController.filtre_signal_state_Controller(mockReq, mockRes);

      expect(project_Model.filtre_signal_state_Model).toHaveBeenCalledWith('user123', 'pending');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: "there is no signal with this id for this professor!" 
      });
    });

    it('should handle different status values', async () => {
      const testStatuses = ['resolved', 'in_progress', 'closed', 'rejected'];
      
      for (const status of testStatuses) {
        mockReq.params.statut = status;
        const mockResult = [{ id: 1, status }];
        project_Model.filtre_signal_state_Model.mockResolvedValue(mockResult);

        await signalHistoryController.filtre_signal_state_Controller(mockReq, mockRes);

        expect(project_Model.filtre_signal_state_Model).toHaveBeenCalledWith('user123', status);
      }
    });

    it('should handle empty result array', async () => {
      project_Model.filtre_signal_state_Model.mockResolvedValue([]);

      await signalHistoryController.filtre_signal_state_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 0,
        result: []
      });
    });

    it('should handle database errors', async () => {
      project_Model.filtre_signal_state_Model.mockRejectedValue(new Error('Filter operation failed'));

      await signalHistoryController.filtre_signal_state_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('filtre_solution_state_Controller', () => {
    beforeEach(() => {
      mockReq.params = { statut: 'implemented' };
    });

    it('should return filtered solutions by status', async () => {
      const mockResult = [
        { id: 1, solution: 'Solution 1', status: 'implemented' },
        { id: 2, solution: 'Solution 2', status: 'implemented' }
      ];
      project_Model.filtre_solution_state_Model.mockResolvedValue(mockResult);

      await signalHistoryController.filtre_solution_state_Controller(mockReq, mockRes);

      expect(project_Model.filtre_solution_state_Model).toHaveBeenCalledWith('user123', 'implemented');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no solutions match the status filter', async () => {
      project_Model.filtre_solution_state_Model.mockResolvedValue(null);

      await signalHistoryController.filtre_solution_state_Controller(mockReq, mockRes);

      expect(project_Model.filtre_solution_state_Model).toHaveBeenCalledWith('user123', 'implemented');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: "there is no signal with this id for this professor!" 
      });
    });

    it('should handle different solution status values', async () => {
      const testStatuses = ['pending', 'approved', 'rejected', 'implemented'];
      
      for (const status of testStatuses) {
        mockReq.params.statut = status;
        const mockResult = [{ id: 1, solution_status: status }];
        project_Model.filtre_solution_state_Model.mockResolvedValue(mockResult);

        await signalHistoryController.filtre_solution_state_Controller(mockReq, mockRes);

        expect(project_Model.filtre_solution_state_Model).toHaveBeenCalledWith('user123', status);
      }
    });

    it('should handle empty result array', async () => {
      project_Model.filtre_solution_state_Model.mockResolvedValue([]);

      await signalHistoryController.filtre_solution_state_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 0,
        result: []
      });
    });

    it('should handle database errors', async () => {
      project_Model.filtre_solution_state_Model.mockRejectedValue(new Error('Solution filter failed'));

      await signalHistoryController.filtre_solution_state_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('view_solution_Controller', () => {
    beforeEach(() => {
      mockReq.params = { id_signal: '789' };
    });

    it('should return solution details when signal exists', async () => {
      const mockResult = [
        { 
          id: 789, 
          solution: 'Detailed solution description',
          status: 'implemented',
          created_at: '2024-01-01'
        }
      ];
      project_Model.view_solution_Model.mockResolvedValue(mockResult);

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(project_Model.view_solution_Model).toHaveBeenCalledWith(789);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });

    it('should return 404 when solution not found', async () => {
      project_Model.view_solution_Model.mockResolvedValue(null);

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(project_Model.view_solution_Model).toHaveBeenCalledWith(789);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: "there is no signal with this id for this professor!" 
      });
    });

    it('should handle string ID conversion to integer', async () => {
      mockReq.params.id_signal = '999';
      const mockResult = [{ id: 999, solution: 'Test solution' }];
      project_Model.view_solution_Model.mockResolvedValue(mockResult);

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(project_Model.view_solution_Model).toHaveBeenCalledWith(999);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle multiple solutions for a signal', async () => {
      const mockResult = [
        { id: 1, solution: 'Solution 1', version: 1 },
        { id: 2, solution: 'Solution 2', version: 2 },
        { id: 3, solution: 'Solution 3', version: 3 }
      ];
      project_Model.view_solution_Model.mockResolvedValue(mockResult);

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 3,
        result: mockResult
      });
    });

    it('should handle invalid signal ID format', async () => {
      mockReq.params.id_signal = 'invalid';
      project_Model.view_solution_Model.mockRejectedValue(new Error('Invalid signal ID'));

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle database errors', async () => {
      project_Model.view_solution_Model.mockRejectedValue(new Error('Database query failed'));

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle empty result array', async () => {
      project_Model.view_solution_Model.mockResolvedValue([]);

      await signalHistoryController.view_solution_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        number: 0,
        result: []
      });
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle missing user ID in request', async () => {
      mockReq.user = {};
      project_Model.all_signal_Model.mockRejectedValue(new Error('User ID required'));

      await signalHistoryController.all_signal_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle missing parameters in request', async () => {
      mockReq.params = {};
      project_Model.search_signal_id_Model.mockRejectedValue(new Error('Missing signal ID'));

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle null user object', async () => {
      mockReq.user = null;
      project_Model.all_signal_Model.mockRejectedValue(new Error('User not authenticated'));

      await signalHistoryController.all_signal_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle zero as valid signal ID', async () => {
      mockReq.params.id_signal = '0';
      const mockResult = [{ id: 0, title: 'Signal with ID 0' }];
      project_Model.search_signal_id_Model.mockResolvedValue(mockResult);

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(project_Model.search_signal_id_Model).toHaveBeenCalledWith('user123', 0);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle negative signal ID', async () => {
      mockReq.params.id_signal = '-1';
      project_Model.search_signal_id_Model.mockResolvedValue(null);

      await signalHistoryController.search_signal_id_Controller(mockReq, mockRes);

      expect(project_Model.search_signal_id_Model).toHaveBeenCalledWith('user123', -1);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});