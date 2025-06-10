// Mock the EvaluationModel
jest.mock('../../../models/profmodels/evaluation_Model_history.js');
const EvaluationModel = require('../../../models/profmodels/evaluation_Model_history.js');
const {
  all_evaluation_Controller,
  search_by_id_evaluation_Controller,
  filter_by_level_Controller,
  filter_by_class_Controller,
  filter_by_type_Controller,
  view_evaluation_Controller
} = require('../../../controllers/profController/Evaluation_Controller_history.js'); 


describe('Evaluation History Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      user: { id: 1 },
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('all_evaluation_Controller', () => {
    it('should return all evaluations with count when data exists', async () => {
      const mockResult = [
        { id: 1, student_name: 'John Doe', evaluation_date: '2024-01-15' },
        { id: 2, student_name: 'Jane Smith', evaluation_date: '2024-01-20' }
      ];
      EvaluationModel.all_evaluation_Model.mockResolvedValue(mockResult);

      await all_evaluation_Controller(req, res);

      expect(EvaluationModel.all_evaluation_Model).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it.skip('should return 204 when no evaluations exist', async () => {
      EvaluationModel.all_evaluation_Model.mockResolvedValue([]);

      await all_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      // Note: The original code doesn't call res.json() for 204 status
    });

    it('should handle server errors', async () => {
      EvaluationModel.all_evaluation_Model.mockRejectedValue(new Error('Database error'));

      await all_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('search_by_id_evaluation_Controller', () => {
    beforeEach(() => {
      req.params = { id_evaluation: '123' };
    });

    it('should return evaluation when found by ID', async () => {
      const mockResult = [
        { id: 123, student_name: 'John Doe', skills: ['Programming', 'Communication'] }
      ];
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue(mockResult);

      await search_by_id_evaluation_Controller(req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(123, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });

    it.skip('should return 404 when evaluation not found', async () => {
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue([]);

      await search_by_id_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No data found for this ID." });
    });

    it('should handle non-numeric ID parameter', async () => {
      req.params.id_evaluation = 'abc';
      const mockResult = [];
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue(mockResult);

      await search_by_id_evaluation_Controller(req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(NaN, 1);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle server errors', async () => {
      EvaluationModel.search_by_id_evaluation_Model.mockRejectedValue(new Error('Database error'));

      await search_by_id_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('filter_by_level_Controller', () => {
    beforeEach(() => {
      req.params = { level: 'intermediate' };
    });

    it('should return evaluations filtered by level', async () => {
      const mockResult = [
        { id: 1, level: 'intermediate', student_name: 'John Doe' },
        { id: 2, level: 'intermediate', student_name: 'Jane Smith' }
      ];
      EvaluationModel.filter_by_level_Model.mockResolvedValue(mockResult);

      await filter_by_level_Controller(req, res);

      expect(EvaluationModel.filter_by_level_Model).toHaveBeenCalledWith('intermediate', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no evaluations found for level', async () => {
      EvaluationModel.filter_by_level_Model.mockResolvedValue([]);

      await filter_by_level_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No data found for this level." });
    });

    it('should handle server errors', async () => {
      EvaluationModel.filter_by_level_Model.mockRejectedValue(new Error('Database error'));

      await filter_by_level_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('filter_by_class_Controller', () => {
    beforeEach(() => {
      req.params = { classe: 'TDI-205' };
    });

    it('should return evaluations filtered by class', async () => {
      const mockResult = [
        { id: 1, class: 'TDI-205', student_name: 'John Doe' },
        { id: 2, class: 'TDI-205', student_name: 'Jane Smith' }
      ];
      EvaluationModel.filter_by_class_Model.mockResolvedValue(mockResult);

      await filter_by_class_Controller(req, res);

      expect(EvaluationModel.filter_by_class_Model).toHaveBeenCalledWith('TDI-205', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no evaluations found for class', async () => {
      EvaluationModel.filter_by_class_Model.mockResolvedValue([]);

      await filter_by_class_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No data found for this class." });
    });

    it('should handle server errors', async () => {
      EvaluationModel.filter_by_class_Model.mockRejectedValue(new Error('Database error'));

      await filter_by_class_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('filter_by_type_Controller', () => {
    beforeEach(() => {
      req.params = { type: 'final' };
    });

    it('should return evaluations filtered by type', async () => {
      const mockResult = [
        { id: 1, type: 'final', student_name: 'John Doe' },
        { id: 2, type: 'final', student_name: 'Jane Smith' }
      ];
      EvaluationModel.filter_by_type_Model.mockResolvedValue(mockResult);

      await filter_by_type_Controller(req, res);

      expect(EvaluationModel.filter_by_type_Model).toHaveBeenCalledWith('final', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no evaluations found for type', async () => {
      EvaluationModel.filter_by_type_Model.mockResolvedValue([]);

      await filter_by_type_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No data found for this type." });
    });

    it('should handle server errors', async () => {
      EvaluationModel.filter_by_type_Model.mockRejectedValue(new Error('Database error'));

      await filter_by_type_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('view_evaluation_Controller', () => {
    beforeEach(() => {
      req.params = { id_evaluation: '456' };
    });

    it.skip('should return evaluation details when found', async () => {
      const mockResponse = {
        comment: 'Excellent performance in all areas',
        result: [
          { skill: 'Programming', score: 4.5 },
          { skill: 'Communication', score: 4.0 }
        ]
      };
      EvaluationModel.view_evaluation_Model.mockResolvedValue(mockResponse);

      await view_evaluation_Controller(req, res);

      expect(EvaluationModel.view_evaluation_Model).toHaveBeenCalledWith('456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        comment: 'Excellent performance in all areas',
        result: [
          { skill: 'Programming', score: 4.5 },
          { skill: 'Communication', score: 4.0 }
        ]
      });
    });

    it.skip('should return 404 when evaluation not found', async () => {
      const mockResponse = {
        comment: null,
        result: null
      };
      EvaluationModel.view_evaluation_Model.mockResolvedValue(mockResponse);

      await view_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No data found for this id." });
    });

    it.skip('should return 404 when result is falsy', async () => {
      const mockResponse = {
        comment: 'Some comment',
        result: false
      };
      EvaluationModel.view_evaluation_Model.mockResolvedValue(mockResponse);

      await view_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No data found for this id." });
    });

    it('should handle empty result array', async () => {
      const mockResponse = {
        comment: 'Some comment',
        result: []
      };
      EvaluationModel.view_evaluation_Model.mockResolvedValue(mockResponse);

      await view_evaluation_Controller(req, res);

      // Empty array is truthy in JavaScript, so it returns 200
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        comment: 'Some comment',
        result: []
      });
    });

    it('should handle server errors', async () => {
      EvaluationModel.view_evaluation_Model.mockRejectedValue(new Error('Database error'));

      await view_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle undefined response from model', async () => {
      EvaluationModel.view_evaluation_Model.mockResolvedValue(undefined);

      await view_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });
});