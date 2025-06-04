jest.mock('../../config/db'); // Mock the database pool
const {
  Total_User,
  differenceUserController,
  Total_Evaluation,
  differenceEvaluationController,
  InvolvementController,
  Involvement_target_Controller,
  flagged_evaluation_Controller,
  evaluation_source_overtime_Controller,
  user_distribution_by_role_Controller,
  news_admin_Controller,
  news_professor_Controller
} = require('../../controllers/adminControllers/AdminDashboardController'); // Adjust path as needed

// Mock the DashModel
jest.mock('../../models/adminModels/AdminDashboardModel', () => ({
  TotalUserModel: jest.fn(),
  differenceUserModel: jest.fn(),
  TotalEvaluationModel: jest.fn(),
  differenceEvaluationModel: jest.fn(),
  InvolvementModel_current: jest.fn(),
  InvolvementModel_previous: jest.fn(),
  flagged_evaluation_Model: jest.fn(),
  evaluation_source_overtime_Model: jest.fn(),
  user_distribution_by_role_Model: jest.fn(),
  news_admin_Model: jest.fn(),
  news_professor_Model: jest.fn(),
}));

const DashModel = require('../../models/adminModels/AdminDashboardModel');

describe('AdminDashboardController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Total_User', () => {
    it('should return total users successfully', async () => {
      const mockUserData = { totalUsers: 100 };
      DashModel.TotalUserModel.mockResolvedValue(mockUserData);

      await Total_User[0](req, res);

      expect(DashModel.TotalUserModel).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserData);
    });

    it('should handle errors and return 500', async () => {
      const mockError = new Error('Database error');
      DashModel.TotalUserModel.mockRejectedValue(mockError);
      console.error = jest.fn();

      await Total_User[0](req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('differenceUserController', () => {
    it('should calculate percentage when previous > 0', async () => {
      const mockResult = {
        previous: 50,
        current: 75,
        difference: 25,
        trend: 'increased'
      };
      DashModel.differenceUserModel.mockResolvedValue(mockResult);

      await differenceUserController[0](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        percentage: 50, // (25/50) * 100 = 50
        trend: 'increased' 
      });
    });

    it('should return 0% when both previous and current are 0', async () => {
      const mockResult = {
        previous: 0,
        current: 0,
        difference: 0,
        trend: 'no change'
      };
      DashModel.differenceUserModel.mockResolvedValue(mockResult);

      await differenceUserController[0](req, res);

      expect(res.json).toHaveBeenCalledWith({ 
        percentage: 0,
        trend: 'no change' 
      });
    });

    it('should return 100% when previous is 0 but current > 0', async () => {
      const mockResult = {
        previous: 0,
        current: 10,
        difference: 10,
        trend: 'increased'
      };
      DashModel.differenceUserModel.mockResolvedValue(mockResult);

      await differenceUserController[0](req, res);

      expect(res.json).toHaveBeenCalledWith({ 
        percentage: 100,
        trend: 'increased' 
      });
    });

    it('should handle errors', async () => {
      DashModel.differenceUserModel.mockRejectedValue(new Error('DB Error'));
      console.error = jest.fn();

      await differenceUserController[0](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('Total_Evaluation', () => {
    it('should return total evaluations successfully', async () => {
      const mockEvaluationData = { totalEvaluations: 250 };
      DashModel.TotalEvaluationModel.mockResolvedValue(mockEvaluationData);

      await Total_Evaluation[0](req, res);

      expect(DashModel.TotalEvaluationModel).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvaluationData);
    });

    it('should handle errors', async () => {
      DashModel.TotalEvaluationModel.mockRejectedValue(new Error('Error'));
      console.error = jest.fn();

      await Total_Evaluation[0](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('differenceEvaluationController', () => {
    it('should calculate evaluation percentage correctly', async () => {
      const mockResult = {
        previous: 100,
        current: 120,
        difference: 20,
        trend: 'increased'
      };
      DashModel.differenceEvaluationModel.mockResolvedValue(mockResult);

      await differenceEvaluationController[0](req, res);

      expect(res.json).toHaveBeenCalledWith({ 
        percentage: 20, // (20/100) * 100 = 20
        trend: 'increased' 
      });
    });

    it('should handle zero previous value', async () => {
      const mockResult = {
        previous: 0,
        current: 50,
        difference: 50,
        trend: 'increased'
      };
      DashModel.differenceEvaluationModel.mockResolvedValue(mockResult);

      await differenceEvaluationController[0](req, res);

      expect(res.json).toHaveBeenCalledWith({ 
        percentage: 100,
        trend: 'increased' 
      });
    });
  });

  describe('InvolvementController', () => {
    it('should return involvement percentage', async () => {
      const mockPercentage = { percentage: 75.5 };
      DashModel.InvolvementModel_current.mockResolvedValue(mockPercentage);

      await InvolvementController[0](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPercentage);
    });
  });

  describe('Involvement_target_Controller', () => {
    it('should calculate involvement trend as increased', async () => {
      const mockPrevious = { percentage: 60 };
      const mockCurrent = { percentage: 80 };
      
      DashModel.InvolvementModel_previous.mockResolvedValue(mockPrevious);
      DashModel.InvolvementModel_current.mockResolvedValue(mockCurrent);

      await Involvement_target_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({
        trend: 'increased',
        percentage: 33.33 // |60-80|/60 * 100 = 33.33
      });
    });

    it('should calculate involvement trend as decreased', async () => {
      const mockPrevious = { percentage: 80 };
      const mockCurrent = { percentage: 60 };
      
      DashModel.InvolvementModel_previous.mockResolvedValue(mockPrevious);
      DashModel.InvolvementModel_current.mockResolvedValue(mockCurrent);

      await Involvement_target_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({
        trend: 'decreased',
        percentage: 25 // |80-60|/80 * 100 = 25
      });
    });

    it('should handle no change in involvement', async () => {
      const mockSame = { percentage: 70 };
      
      DashModel.InvolvementModel_previous.mockResolvedValue(mockSame);
      DashModel.InvolvementModel_current.mockResolvedValue(mockSame);

      await Involvement_target_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({
        trend: 'no change',
        percentage: 0
      });
    });

    it('should handle zero previous percentage', async () => {
      const mockPrevious = { percentage: 0 };
      const mockCurrent = { percentage: 50 };
      
      DashModel.InvolvementModel_previous.mockResolvedValue(mockPrevious);
      DashModel.InvolvementModel_current.mockResolvedValue(mockCurrent);

      await Involvement_target_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({
        trend: 'increased',
        percentage: 0 // Division by zero handled
      });
    });
  });

  describe('flagged_evaluation_Controller', () => {
    it('should return flagged evaluation data', async () => {
      const mockData = { data: [{ id: 1, flagged: true }] };
      DashModel.flagged_evaluation_Model.mockResolvedValue(mockData);

      await flagged_evaluation_Controller[0](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockData.data });
    });
  });

  describe('evaluation_source_overtime_Controller', () => {
    it('should return evaluation source overtime data', async () => {
      const mockData = { data: [{ month: 'Jan', count: 10 }] };
      DashModel.evaluation_source_overtime_Model.mockResolvedValue(mockData);

      await evaluation_source_overtime_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({ data: mockData.data });
    });
  });

  describe('user_distribution_by_role_Controller', () => {
    it('should calculate role distribution percentages', async () => {
      // Mock data: [students, supervisors, professors, total]
      const mockData = { data: [60, 30, 10, 100] };
      DashModel.user_distribution_by_role_Model.mockResolvedValue(mockData);

      await user_distribution_by_role_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({
        student: 60.00, // (60/100)*100
        Supervisor: 30.00, // (30/100)*100
        Professor: 10.00 // (10/100)*100
      });
    });

    it('should handle division by zero', async () => {
      const mockData = { data: [0, 0, 0, 0] };
      DashModel.user_distribution_by_role_Model.mockResolvedValue(mockData);

      await user_distribution_by_role_Controller[0](req, res);

      expect(res.json).toHaveBeenCalledWith({
        student: NaN,
        Supervisor: NaN,
        Professor: NaN
      });
    });
  });

  describe('news_admin_Controller', () => {
    it('should return admin news', async () => {
      const mockNews = [{ id: 1, title: 'Admin News' }];
      DashModel.news_admin_Model.mockResolvedValue(mockNews);

      await news_admin_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ news: mockNews });
    });

    it('should handle errors', async () => {
      DashModel.news_admin_Model.mockRejectedValue(new Error('Error'));
      console.error = jest.fn();

      await news_admin_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('news_professor_Controller', () => {
    it('should return professor news', async () => {
      const mockNews = [{ id: 1, title: 'Professor News' }];
      DashModel.news_professor_Model.mockResolvedValue(mockNews);

      await news_professor_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ news: mockNews });
    });

    it('should handle errors', async () => {
      DashModel.news_professor_Model.mockRejectedValue(new Error('Error'));
      console.error = jest.fn();

      await news_professor_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});