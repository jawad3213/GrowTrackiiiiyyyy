// Mock the EvaluationModel
jest.mock('../../../models/profmodels/evaluation_Model_classes.js');
const EvaluationModel = require('../../../models/profmodels/evaluation_Model_classes.js');
const {
  get_sector_Controller,
  get_classes_Controller,
  get_all_student_Controller,
  search_by_student_cne_Controller,
  search_by_course_statut_Controller,
  search_by_project_statut_Controller,
  new_evaluation_Controller,
  view_report_Controller
} = require('../../../controllers/profController/Evaluation_Controller_classes.js');



describe('Evaluation Controller Tests', () => {
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

  describe('get_sector_Controller', () => {
    it('should return sectors with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'IT' },
        { id: 2, name: 'Business' }
      ];
      EvaluationModel.get_sector_Model.mockResolvedValue(mockResult);

      await get_sector_Controller(req, res);

      expect(EvaluationModel.get_sector_Model).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 204 when no data exists', async () => {
      EvaluationModel.get_sector_Model.mockResolvedValue([]);

      await get_sector_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: "No data" });
    });

    it('should handle server errors', async () => {
      EvaluationModel.get_sector_Model.mockRejectedValue(new Error('Database error'));

      await get_sector_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('get_classes_Controller', () => {
    beforeEach(() => {
      req.params = { id_sector: '2' };
    });

    it('should return classes with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Class A' },
        { id: 2, name: 'Class B' }
      ];
      EvaluationModel.get_classes_Model.mockResolvedValue(mockResult);

      await get_classes_Controller(req, res);

      expect(EvaluationModel.get_classes_Model).toHaveBeenCalledWith(1, '2');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 204 when no data exists', async () => {
      EvaluationModel.get_classes_Model.mockResolvedValue([]);

      await get_classes_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should handle server errors', async () => {
      EvaluationModel.get_classes_Model.mockRejectedValue(new Error('Database error'));

      await get_classes_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('get_all_student_Controller', () => {
    beforeEach(() => {
      req.params = { id_class: '3' };
    });

    it('should return students with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Student A' },
        { id: 2, name: 'Student B' }
      ];
      EvaluationModel.get_all_student_Model.mockResolvedValue(mockResult);

      await get_all_student_Controller(req, res);

      expect(EvaluationModel.get_all_student_Model).toHaveBeenCalledWith(1, '3');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 204 when no data exists', async () => {
      EvaluationModel.get_all_student_Model.mockResolvedValue([]);

      await get_all_student_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: "No data" });
    });
  });

  describe('search_by_student_cne_Controller', () => {
    beforeEach(() => {
      req.params = { cne: 'CNE123', id_class: '3' };
    });

    it('should return student data when found', async () => {
      const mockResult = [{ id: 1, cne: 'CNE123', name: 'Student A' }];
      EvaluationModel.search_by_student_cne_Model.mockResolvedValue(mockResult);

      await search_by_student_cne_Controller(req, res);

      expect(EvaluationModel.search_by_student_cne_Model).toHaveBeenCalledWith(1, 'CNE123', '3');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });

    it('should return 204 when student not found', async () => {
      EvaluationModel.search_by_student_cne_Model.mockResolvedValue([]);

      await search_by_student_cne_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: "No data" });
    });
  });

  describe('search_by_course_statut_Controller', () => {
    beforeEach(() => {
      req.params = { statut: 'active', id_class: '3' };
    });

    it('should return courses by status', async () => {
      const mockResult = [{ id: 1, status: 'active' }];
      EvaluationModel.search_by_course_statut_Model.mockResolvedValue(mockResult);

      await search_by_course_statut_Controller(req, res);

      expect(EvaluationModel.search_by_course_statut_Model).toHaveBeenCalledWith(1, 'active', '3');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });
  });

  describe('search_by_project_statut_Controller', () => {
    beforeEach(() => {
      req.params = { statut: 'completed' };
    });

    it('should return projects by status', async () => {
      const mockResult = [{ id: 1, status: 'completed' }];
      EvaluationModel.search_by_project_statut_Model.mockResolvedValue(mockResult);

      await search_by_project_statut_Controller(req, res);

      expect(EvaluationModel.search_by_project_statut_Model).toHaveBeenCalledWith(1, 'completed');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 1,
        result: mockResult
      });
    });
  });

  describe('new_evaluation_Controller', () => {
    beforeEach(() => {
      req.params = { id_student: '5' };
      req.body = {
        skill1: 'Programming',
        rate1_skill1: 4,
        rate2_skill1: 3,
        rate3_skill1: 5,
        skill2: 'Communication',
        rate1_skill2: 3,
        rate2_skill2: 4,
        rate3_skill2: 4,
        skill3: 'Teamwork',
        rate1_skill3: 5,
        rate2_skill3: 4,
        rate3_skill3: 3,
        skill4: 'Problem Solving',
        rate1_skill4: 4,
        rate2_skill4: 4,
        rate3_skill4: 4,
        skill5: 'Creativity',
        rate1_skill5: 3,
        rate2_skill5: 3,
        rate3_skill5: 4,
        skill6: 'Leadership',
        rate1_skill6: 2,
        rate2_skill6: 3,
        rate3_skill6: 3,
        comment: 'Good performance overall'
      };
    });

    it('should create new evaluation successfully', async () => {
      EvaluationModel.new_evaluation_Model.mockResolvedValue(true);

      await new_evaluation_Controller(req, res);

      expect(EvaluationModel.new_evaluation_Model).toHaveBeenCalledWith(
        'Programming', 4,
        'Communication', 3.67,
        'Teamwork', 4,
        'Problem Solving', 4,
        'Creativity', 3.33,
        'Leadership', 2.67,
        'Good performance overall',
        1,
        '5'
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        skill1: 'Programming',
        note1: 4,
        skill2: 'Communication',
        note2: 3.67,
        skill3: 'Teamwork',
        note3: 4,
        skill4: 'Problem Solving',
        note4: 4,
        skill5: 'Creativity',
        note5: 3.33,
        skill6: 'Leadership',
        note6: 2.67
      });
    });

    it('should return error when student already evaluated', async () => {
      EvaluationModel.new_evaluation_Model.mockResolvedValue(false);

      await new_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'This student has already been evaluated by this professor for this month.'
      });
    });

    it('should calculate averages correctly', async () => {
      EvaluationModel.new_evaluation_Model.mockResolvedValue(true);

      await new_evaluation_Controller(req, res);

      // Verify that the averages are calculated correctly
      // skill1: (4+3+5)/3 = 4
      // skill2: (3+4+4)/3 = 3.67
      // skill3: (5+4+3)/3 = 4
      // skill4: (4+4+4)/3 = 4
      // skill5: (3+3+4)/3 = 3.33
      // skill6: (2+3+3)/3 = 2.67

      const call = EvaluationModel.new_evaluation_Model.mock.calls[0];
      expect(call[1]).toBe(4); // note1
      expect(call[3]).toBe(3.67); // note2
      expect(call[5]).toBe(4); // note3
      expect(call[7]).toBe(4); // note4
      expect(call[9]).toBe(3.33); // note5
      expect(call[11]).toBe(2.67); // note6
    });

    it('should handle server errors', async () => {
      EvaluationModel.new_evaluation_Model.mockRejectedValue(new Error('Database error'));

      await new_evaluation_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('view_report_Controller', () => {
    beforeEach(() => {
      req.params = { id_student: '5' };
    });

    it('should return report when data exists', async () => {
      const mockResult = { studentId: 5, evaluations: [] };
      EvaluationModel.view_report_Model.mockResolvedValue(mockResult);

      await view_report_Controller(req, res);

      expect(EvaluationModel.view_report_Model).toHaveBeenCalledWith(1, '5');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should return error when no data exists', async () => {
      EvaluationModel.view_report_Model.mockResolvedValue(null);

      await view_report_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'There is no data.' });
    });

    it('should handle server errors', async () => {
      EvaluationModel.view_report_Model.mockRejectedValue(new Error('Database error'));

      await view_report_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });
});