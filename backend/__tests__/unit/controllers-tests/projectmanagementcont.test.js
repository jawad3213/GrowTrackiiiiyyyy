const project_Model = require('../../../models/profmodels/project_management_Model.js');
const {
  all_project_Controller,
  delete_project_Controller,
  add_project_Controller,
  add_group_Controller,
  delete_group_Controller,
  add_member_Controller,
  update_project_Controller,
  all_group_Controller,
  delete_team_Controller,
  all_member_Controller
} = require('../../../controllers/profController/project_management_Controller.js'); // Update this path

// Mock the project_Model
jest.mock('../../../models/profmodels/project_management_Model.js');

describe('Project Management Controller Tests', () => {
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

  describe('all_project_Controller', () => {
    it('should return all projects with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Project A', description: 'Description A' },
        { id: 2, name: 'Project B', description: 'Description B' }
      ];
      project_Model.all_project_Model.mockResolvedValue(mockResult);

      await all_project_Controller(req, res);

      expect(project_Model.all_project_Model).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no projects exist', async () => {
      project_Model.all_project_Model.mockResolvedValue([]);

      await all_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle server errors', async () => {
      project_Model.all_project_Model.mockRejectedValue(new Error('Database error'));

      await all_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('delete_project_Controller', () => {
    beforeEach(() => {
      req.params = { id_project: '123' };
    });

    it('should delete project successfully', async () => {
      const mockResult = { id: 123, deleted: true };
      project_Model.delete_project_Model.mockResolvedValue(mockResult);

      await delete_project_Controller(req, res);

      expect(project_Model.delete_project_Model).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "deleted successfully!",
        deleted: mockResult
      });
    });

    it('should return 404 when project not found', async () => {
      project_Model.delete_project_Model.mockResolvedValue(null);

      await delete_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No content to delete." });
    });

    it('should handle non-numeric ID parameter', async () => {
      req.params.id_project = 'abc';
      project_Model.delete_project_Model.mockResolvedValue(null);

      await delete_project_Controller(req, res);

      expect(project_Model.delete_project_Model).toHaveBeenCalledWith(NaN);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle server errors', async () => {
      project_Model.delete_project_Model.mockRejectedValue(new Error('Database error'));

      await delete_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('add_project_Controller', () => {
    beforeEach(() => {
      req.body = {
        name: 'New Project',
        month_start: '03/2024',
        month_number: '6',
        description: 'Project description',
        level: 'intermediate',
        field: 'IT'
      };
    });

    it('should add project successfully with correct date calculations', async () => {
      const mockResult = { id: 1, name: 'New Project' };
      project_Model.add_project_Model.mockResolvedValue(mockResult);

      await add_project_Controller(req, res);

      const expectedStartDate = new Date('2024-03-01');
      const expectedEndDate = new Date('2024-09-30'); // 6 months after March

      expect(project_Model.add_project_Model).toHaveBeenCalledWith(
        1,
        'New Project',
        expectedStartDate,
        expectedEndDate,
        'Project description',
        'intermediate',
        'IT'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: mockResult });
    });

    it('should handle different month calculations correctly', async () => {
      req.body.month_start = '10/2024';
      req.body.month_number = '3';
      const mockResult = { id: 1, name: 'New Project' };
      project_Model.add_project_Model.mockResolvedValue(mockResult);

      await add_project_Controller(req, res);

      const expectedStartDate = new Date('2024-10-01');
      const expectedEndDate = new Date('2025-01-31'); // 3 months after October

      expect(project_Model.add_project_Model).toHaveBeenCalledWith(
        1,
        'New Project',
        expectedStartDate,
        expectedEndDate,
        'Project description',
        'intermediate',
        'IT'
      );
    });

    it('should return 404 when project creation fails', async () => {
      project_Model.add_project_Model.mockResolvedValue(null);

      await add_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: " something went wrong " });
    });

    it('should handle server errors', async () => {
      project_Model.add_project_Model.mockRejectedValue(new Error('Database error'));

      await add_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle invalid date format', async () => {
      req.body.month_start = 'invalid-date';

      await add_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('add_group_Controller', () => {
    beforeEach(() => {
      req.params = { project_id: '456' };
      req.body = { name: 'Team Alpha' };
    });

    it('should add group successfully', async () => {
      const mockResult = { id: 1, name: 'Team Alpha' };
      project_Model.add_group_Model.mockResolvedValue(mockResult);

      await add_group_Controller(req, res);

      expect(project_Model.add_group_Model).toHaveBeenCalledWith(1, 'Team Alpha', 456);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: mockResult });
    });

    it('should return 404 when group creation fails', async () => {
      project_Model.add_group_Model.mockResolvedValue(null);

      await add_group_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong." });
    });

    it('should handle server errors', async () => {
      project_Model.add_group_Model.mockRejectedValue(new Error('Database error'));

      await add_group_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('delete_group_Controller', () => {
    beforeEach(() => {
      req.params = { id_group: '789' };
    });

    it('should delete group successfully', async () => {
      const mockResult = { deleted: true };
      project_Model.delete_group_Model.mockResolvedValue(mockResult);

      await delete_group_Controller(req, res);

      expect(project_Model.delete_group_Model).toHaveBeenCalledWith(789);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: mockResult });
    });

    it('should return 404 when group deletion fails', async () => {
      project_Model.delete_group_Model.mockResolvedValue(null);

      await delete_group_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong." });
    });
  });

  describe('add_member_Controller', () => {
    beforeEach(() => {
      req.params = { id_group: '123' };
      req.body = { cne: 'CNE12345' };
    });

    it('should add member successfully', async () => {
      const mockResult = { id: 1, cne: 'CNE12345' };
      project_Model.add_member_Model.mockResolvedValue(mockResult);

      await add_member_Controller(req, res);

      expect(project_Model.add_member_Model).toHaveBeenCalledWith('CNE12345', 123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: mockResult });
    });

    it('should return 404 when member addition fails', async () => {
      project_Model.add_member_Model.mockResolvedValue(null);

      await add_member_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong." });
    });
  });

  describe('update_project_Controller', () => {
    beforeEach(() => {
      req.params = { id: '456' };
    });

    it('should update project successfully with both fields', async () => {
      req.body = { start_date: '2024-04-01', month_number: 8 };
      const mockResult = { updated: true };
      project_Model.update_project_Model.mockResolvedValue(mockResult);

      await update_project_Controller(req, res);

      expect(project_Model.update_project_Model).toHaveBeenCalledWith('456', '2024-04-01', 8);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Project updated successfully",
        result: mockResult
      });
    });

    it('should update project with only start_date', async () => {
      req.body = { start_date: '2024-04-01' };
      const mockResult = { updated: true };
      project_Model.update_project_Model.mockResolvedValue(mockResult);

      await update_project_Controller(req, res);

      expect(project_Model.update_project_Model).toHaveBeenCalledWith('456', '2024-04-01', undefined);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update project with only month_number', async () => {
      req.body = { month_number: 12 };
      const mockResult = { updated: true };
      project_Model.update_project_Model.mockResolvedValue(mockResult);

      await update_project_Controller(req, res);

      expect(project_Model.update_project_Model).toHaveBeenCalledWith('456', undefined, 12);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when no fields provided', async () => {
      req.body = {};

      await update_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Provide at least one field to update." });
      expect(project_Model.update_project_Model).not.toHaveBeenCalled();
    });

    it('should handle server errors', async () => {
      req.body = { start_date: '2024-04-01' };
      project_Model.update_project_Model.mockRejectedValue(new Error('Database error'));

      await update_project_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('all_group_Controller', () => {
    beforeEach(() => {
      req.params = { id_project: '789' };
    });

    it('should return all groups with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Group A' },
        { id: 2, name: 'Group B' }
      ];
      project_Model.all_group_Model.mockResolvedValue(mockResult);

      await all_group_Controller(req, res);

      expect(project_Model.all_group_Model).toHaveBeenCalledWith('789');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no groups exist', async () => {
      project_Model.all_group_Model.mockResolvedValue([]);

      await all_group_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });
  });

  describe('delete_team_Controller', () => {
    beforeEach(() => {
      req.params = { id: '999' };
    });

    it('should delete team successfully', async () => {
      project_Model.delete_team_Model.mockResolvedValue(1); // 1 row affected

      await delete_team_Controller(req, res);

      expect(project_Model.delete_team_Model).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Team deleted successfully." });
    });

    it('should return 404 when team not found', async () => {
      project_Model.delete_team_Model.mockResolvedValue(0); // 0 rows affected

      await delete_team_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Team not found." });
    });

    it('should handle server errors', async () => {
      project_Model.delete_team_Model.mockRejectedValue(new Error('Database error'));

      await delete_team_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error. Please try again later." });
    });
  });

  describe('all_member_Controller', () => {
    beforeEach(() => {
      req.params = { id_group: '555' };
    });

    it('should return all members with count when data exists', async () => {
      const mockResult = [
        { id: 1, name: 'Member A', cne: 'CNE001' },
        { id: 2, name: 'Member B', cne: 'CNE002' }
      ];
      project_Model.all_member_Model.mockResolvedValue(mockResult);

      await all_member_Controller(req, res);

      expect(project_Model.all_member_Model).toHaveBeenCalledWith('555');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        number: 2,
        result: mockResult
      });
    });

    it('should return 404 when no members exist', async () => {
      project_Model.all_member_Model.mockResolvedValue([]);

      await all_member_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle server errors', async () => {
      project_Model.all_member_Model.mockRejectedValue(new Error('Database error'));

      await all_member_Controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });
});