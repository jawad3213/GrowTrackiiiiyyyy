const {
  number_of_evaluation_submitted_Controller,
  search_by_id_evaluation_Controller,
  filter_by_type_Controller,
  all_evaluation_Controller
} = require('../../../controllers/adminControllers/GlobalOverView_Controller.js');

jest.mock('../../../models/adminModels/GlobalOverView_Model.js', () => ({
  number_of_evaluation_submitted_Model: jest.fn(),
  search_by_id_evaluation_Model: jest.fn(),
  filter_by_type_Model: jest.fn(),
  all_evaluation_Model: jest.fn()
}));

const EvaluationModel = require('../../../models/adminModels/GlobalOverView_Model.js');

describe('Evaluation Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('number_of_evaluation_submitted_Controller', () => {
    test('should return evaluation data successfully', async () => {
      const mockData = { count: 5, evaluations: ['eval1', 'eval2'] };
      EvaluationModel.number_of_evaluation_submitted_Model.mockResolvedValue({ data: mockData });

      await number_of_evaluation_submitted_Controller[0](req, res);

      expect(EvaluationModel.number_of_evaluation_submitted_Model).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    test('should handle server error', async () => {
      const mockError = new Error('Database connection failed');
      EvaluationModel.number_of_evaluation_submitted_Model.mockRejectedValue(mockError);

      await number_of_evaluation_submitted_Controller[0](req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });
  });

  describe('search_by_id_evaluation_Controller', () => {
    beforeEach(() => {
      req.params = { id_evaluation: '123' };
    });

    test.skip('should return evaluation data when found', async () => {
      const mockResult = [
        { id: 1, name: 'Evaluation 1' },
        { id: 2, name: 'Evaluation 2' }
      ];
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue(mockResult);

      await search_by_id_evaluation_Controller[0](req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    test.skip('should return 404 when no data found', async () => {
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue([]);

      await search_by_id_evaluation_Controller[0](req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No data found for this ID."
      });
    });

    test.skip('should handle invalid ID parameter', async () => {
      req.params.id_evaluation = 'invalid';

      await search_by_id_evaluation_Controller[0](req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(NaN);
    });

    test.skip('should handle server error', async () => {
      const mockError = new Error('Database error');
      EvaluationModel.search_by_id_evaluation_Model.mockRejectedValue(mockError);

      await search_by_id_evaluation_Controller[0](req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });
  });

  describe('filter_by_type_Controller', () => {
    beforeEach(() => {
      req.params = { type: 'survey' };
    });

    test('should return filtered evaluation data when found', async () => {
      const mockResult = [
        { id: 1, type: 'survey', name: 'Survey 1' },
        { id: 2, type: 'survey', name: 'Survey 2' }
      ];
      EvaluationModel.filter_by_type_Model.mockResolvedValue(mockResult);

      await filter_by_type_Controller[0](req, res);

      expect(EvaluationModel.filter_by_type_Model).toHaveBeenCalledWith('survey');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    test('should return 404 when no data found for type', async () => {
      EvaluationModel.filter_by_type_Model.mockResolvedValue([]);

      await filter_by_type_Controller[0](req, res);

      expect(EvaluationModel.filter_by_type_Model).toHaveBeenCalledWith('survey');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No data found for this type."
      });
    });

    test('should handle special characters in type parameter', async () => {
      req.params.type = 'test@type';
      const mockResult = [{ id: 1, type: 'test@type' }];
      EvaluationModel.filter_by_type_Model.mockResolvedValue(mockResult);

      await filter_by_type_Controller[0](req, res);

      expect(EvaluationModel.filter_by_type_Model).toHaveBeenCalledWith('test@type');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should handle server error', async () => {
      const mockError = new Error('Database error');
      EvaluationModel.filter_by_type_Model.mockRejectedValue(mockError);

      await filter_by_type_Controller[0](req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });
  });

  describe('all_evaluation_Controller', () => {
    test('should return all evaluation data when found', async () => {
      const mockResult = [
        { id: 1, name: 'Evaluation 1' },
        { id: 2, name: 'Evaluation 2' },
        { id: 3, name: 'Evaluation 3' }
      ];
      EvaluationModel.all_evaluation_Model.mockResolvedValue(mockResult);

      await all_evaluation_Controller[0](req, res);

      expect(EvaluationModel.all_evaluation_Model).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 3,
        result: mockResult
      });
    });

    test('should return 204 when no data found', async () => {
      EvaluationModel.all_evaluation_Model.mockResolvedValue([]);

      await all_evaluation_Controller[0](req, res);

      expect(EvaluationModel.all_evaluation_Model).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should handle server error', async () => {
      const mockError = new Error('Database connection failed');
      EvaluationModel.all_evaluation_Model.mockRejectedValue(mockError);

      await all_evaluation_Controller[0](req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server Error, Please try again later!"
      });
    });
  });

  describe('Edge Cases and Integration Tests', () => {
    test.skip('should handle null response from model', async () => {
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue(null);
      req.params = { id_evaluation: '123' };

      await search_by_id_evaluation_Controller[0](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('should handle undefined response from model', async () => {
      EvaluationModel.filter_by_type_Model.mockResolvedValue(undefined);
      req.params = { type: 'survey' };

      await filter_by_type_Controller[0](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('should handle empty string parameters', async () => {
      req.params = { type: '' };
      EvaluationModel.filter_by_type_Model.mockResolvedValue([]);

      await filter_by_type_Controller[0](req, res);

      expect(EvaluationModel.filter_by_type_Model).toHaveBeenCalledWith('');
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test.skip('should handle zero ID parameter', async () => {
      req.params = { id_evaluation: '0' };
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue([]);

      await search_by_id_evaluation_Controller[0](req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(0);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test.skip('should handle negative ID parameter', async () => {
      req.params = { id_evaluation: '-1' };
      EvaluationModel.search_by_id_evaluation_Model.mockResolvedValue([]);

      await search_by_id_evaluation_Controller[0](req, res);

      expect(EvaluationModel.search_by_id_evaluation_Model).toHaveBeenCalledWith(-1);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
