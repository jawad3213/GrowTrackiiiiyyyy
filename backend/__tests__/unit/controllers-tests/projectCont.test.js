const projectModel = require('../../../models/studentModels/projectModel');
const {
  numberOfProdjects,
  getAllProjects,
  getMemberProject,
  addSignal,
  getSkillName,
  setEvalation
} = require('../../../controllers/studentControllers/projectController');

// Mock the project model
jest.mock('../../../models/studentModels/projectModel');

describe('Project Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock console.error to avoid console output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Basic mock request and response objects
    req = {
      params: { id_student: '123' },
      query: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();
  });

  describe('numberOfProdjects function', () => {
    describe('Success Cases', () => {
      test('should retrieve number of projects successfully', async () => {
        // Arrange
        const mockResult = { count: 5 };
        projectModel.getNombreProjets.mockResolvedValue(mockResult);

        // Act
        await numberOfProdjects(req, res);

        // Assert
        expect(projectModel.getNombreProjets).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Number of projects retrieved successfully",
          data: mockResult
        });
      });

      test('should handle zero projects count', async () => {
        // Arrange
        const mockResult = { count: 0 };
        projectModel.getNombreProjets.mockResolvedValue(mockResult);

        // Act
        await numberOfProdjects(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Number of projects retrieved successfully",
          data: mockResult
        });
      });
    });

    describe('Error Cases', () => {
      test('should handle model errors', async () => {
        // Arrange
        const mockError = new Error('Database error');
        projectModel.getNombreProjets.mockRejectedValue(mockError);

        // Act
        await numberOfProdjects(req, res);

        // Assert
        expect(console.error).toHaveBeenCalledWith("Error retrieving number of projects:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Error retrieving number of projects",
          error: mockError.message
        });
      });
    });
  });

  describe('getAllProjects function', () => {
    describe('Success Cases', () => {
      test('should retrieve all projects successfully', async () => {
        // Arrange
        const mockProjects = [
          { id: 1, name: 'Project 1', description: 'Description 1' },
          { id: 2, name: 'Project 2', description: 'Description 2' }
        ];
        projectModel.getProjects.mockResolvedValue(mockProjects);

        // Act
        await getAllProjects(req, res);

        // Assert
        expect(projectModel.getProjects).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Projects retrieved successfully",
          data: mockProjects
        });
      });

      test('should handle empty projects array', async () => {
        // Arrange
        const mockProjects = [];
        projectModel.getProjects.mockResolvedValue(mockProjects);

        // Act
        await getAllProjects(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Projects retrieved successfully",
          data: []
        });
      });
    });

    describe('Error Cases', () => {
      test('should handle model errors', async () => {
        // Arrange
        const mockError = new Error('Connection timeout');
        projectModel.getProjects.mockRejectedValue(mockError);

        // Act
        await getAllProjects(req, res);

        // Assert
        expect(console.error).toHaveBeenCalledWith("Error retrieving projects:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Error retrieving projects",
          error: mockError.message
        });
      });
    });
  });

  describe('getMemberProject function', () => {
    beforeEach(() => {
      req.query = { project: 'project_123' };
    });

    describe('Success Cases', () => {
      test('should retrieve project members successfully', async () => {
        // Arrange
        const mockMembers = [
          { id: 1, name: 'Member 1', role: 'Developer' },
          { id: 2, name: 'Member 2', role: 'Designer' }
        ];
        projectModel.getMemberProject.mockResolvedValue(mockMembers);

        // Act
        await getMemberProject(req, res);

        // Assert
        expect(projectModel.getMemberProject).toHaveBeenCalledWith('123', 'project_123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "member of Projects retrieved successfully",
          data: mockMembers
        });
      });

      test('should handle different project parameter', async () => {
        // Arrange
        req.query.project = 'different_project';
        const mockMembers = [{ id: 3, name: 'Member 3' }];
        projectModel.getMemberProject.mockResolvedValue(mockMembers);

        // Act
        await getMemberProject(req, res);

        // Assert
        expect(projectModel.getMemberProject).toHaveBeenCalledWith('123', 'different_project');
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe('Error Cases', () => {
      test('should handle model errors', async () => {
        // Arrange
        const mockError = new Error('Project not found');
        projectModel.getMemberProject.mockRejectedValue(mockError);

        // Act
        await getMemberProject(req, res);

        // Assert
        expect(console.error).toHaveBeenCalledWith("Error retrieving projects:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Error retrieving projects",
          error: mockError.message
        });
      });
    });
  });

  describe('addSignal function', () => {
    beforeEach(() => {
      req.query = { reported: 'user_456' };
      req.body = {
        title: 'Signal Title',
        description: 'Signal Description',
        anony: false
      };
    });

    describe('Success Cases', () => {
      test('should add signal successfully', async () => {
        // Arrange
        const mockResult = { id: 1, success: true };
        projectModel.addSignal.mockResolvedValue(mockResult);

        // Act
        await addSignal(req, res);

        // Assert
        expect(projectModel.addSignal).toHaveBeenCalledWith(
          '123',
          'user_456',
          'Signal Title',
          'Signal Description',
          false
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Signal added successfully",
          data: mockResult
        });
      });

      test('should handle anonymous signal', async () => {
        // Arrange
        req.body.anony = true;
        const mockResult = { id: 2, success: true };
        projectModel.addSignal.mockResolvedValue(mockResult);

        // Act
        await addSignal(req, res);

        // Assert
        expect(projectModel.addSignal).toHaveBeenCalledWith(
          '123',
          'user_456',
          'Signal Title',
          'Signal Description',
          true
        );
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });

    describe('Error Cases', () => {
      test('should handle model errors', async () => {
        // Arrange
        const mockError = new Error('Failed to add signal');
        projectModel.addSignal.mockRejectedValue(mockError);

        // Act
        await addSignal(req, res);

        // Assert
        expect(console.error).toHaveBeenCalledWith("Error adding signal:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Error adding signal",
          error: mockError.message
        });
      });
    });
  });

  describe('getSkillName function', () => {
    describe('Success Cases', () => {
      test('should retrieve skills successfully', async () => {
        // Arrange
        const mockSkills = [
          { id: 1, name: 'JavaScript', category: 'Programming' },
          { id: 2, name: 'React', category: 'Framework' }
        ];
        projectModel.getSkillName.mockResolvedValue(mockSkills);

        // Act
        await getSkillName(req, res);

        // Assert
        expect(projectModel.getSkillName).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Skills retrieved successfully",
          data: mockSkills
        });
      });

      test('should handle empty skills array', async () => {
        // Arrange
        projectModel.getSkillName.mockResolvedValue([]);

        // Act
        await getSkillName(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Skills retrieved successfully",
          data: []
        });
      });
    });

    describe('Error Cases', () => {
      test('should handle model errors', async () => {
        // Arrange
        const mockError = new Error('Skills retrieval failed');
        projectModel.getSkillName.mockRejectedValue(mockError);

        // Act
        await getSkillName(req, res);

        // Assert
        expect(console.error).toHaveBeenCalledWith("Error retrieving skills:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Error retrieving skills",
          error: mockError.message
        });
      });
    });
  });

  describe('setEvalation function', () => {
    beforeEach(() => {
      req.query = { team: 'team_123', evaluated: 'user_789' };
      req.body = {
        ratings: { technical: 4, communication: 5, teamwork: 3 },
        message: 'Good performance overall'
      };
    });

    describe('Success Cases', () => {
      test('should set evaluation successfully', async () => {
        // Arrange
        const mockResult = { id: 1, evaluation_id: 'eval_123' };
        projectModel.setEvaluation.mockResolvedValue(mockResult);

        // Act
        await setEvalation(req, res);

        // Assert
        expect(projectModel.setEvaluation).toHaveBeenCalledWith(
          '123',
          'team_123',
          { technical: 4, communication: 5, teamwork: 3 },
          'user_789',
          'Good performance overall'
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Project evaluation added successfully",
          data: mockResult
        });
      });

      test('should handle evaluation without message', async () => {
        // Arrange
        req.body.message = '';
        const mockResult = { id: 2, evaluation_id: 'eval_456' };
        projectModel.setEvaluation.mockResolvedValue(mockResult);

        // Act
        await setEvalation(req, res);

        // Assert
        expect(projectModel.setEvaluation).toHaveBeenCalledWith(
          '123',
          'team_123',
          { technical: 4, communication: 5, teamwork: 3 },
          'user_789',
          ''
        );
        expect(res.status).toHaveBeenCalledWith(201);
      });

      test('should handle different rating values', async () => {
        // Arrange
        req.body.ratings = { skill1: 1, skill2: 2, skill3: 5 };
        const mockResult = { id: 3, evaluation_id: 'eval_789' };
        projectModel.setEvaluation.mockResolvedValue(mockResult);

        // Act
        await setEvalation(req, res);

        // Assert
        expect(projectModel.setEvaluation).toHaveBeenCalledWith(
          '123',
          'team_123',
          { skill1: 1, skill2: 2, skill3: 5 },
          'user_789',
          'Good performance overall'
        );
      });
    });

    describe('Error Cases', () => {
      test('should handle model errors', async () => {
        // Arrange
        const mockError = new Error('Evaluation failed');
        projectModel.setEvaluation.mockRejectedValue(mockError);

        // Act
        await setEvalation(req, res);

        // Assert
        expect(console.error).toHaveBeenCalledWith("Error adding project evaluation:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Error adding project evaluation",
          error: mockError.message
        });
      });
    });
  });

  describe('Parameter validation across functions', () => {
    test('should handle different student IDs consistently', async () => {
      // Arrange
      req.params.id_student = 'student_abc123';
      projectModel.getNombreProjets.mockResolvedValue({ count: 3 });
      projectModel.getProjects.mockResolvedValue([]);
      projectModel.getSkillName.mockResolvedValue([]);

      // Act & Assert
      await numberOfProdjects(req, res);
      expect(projectModel.getNombreProjets).toHaveBeenCalledWith('student_abc123');

      await getAllProjects(req, res);
      expect(projectModel.getProjects).toHaveBeenCalledWith('student_abc123');
    });

    test('should handle missing query parameters gracefully', async () => {
      // Arrange
      req.query = {}; // Empty query
      const mockError = new Error('Missing required parameter');
      projectModel.getMemberProject.mockRejectedValue(mockError);

      // Act
      await getMemberProject(req, res);

      // Assert
      expect(projectModel.getMemberProject).toHaveBeenCalledWith('123', undefined);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('should handle missing body parameters gracefully', async () => {
      // Arrange
      req.body = {}; // Empty body
      req.query = { reported: 'user_123' };
      const mockError = new Error('Missing required fields');
      projectModel.addSignal.mockRejectedValue(mockError);

      // Act
      await addSignal(req, res);

      // Assert
      expect(projectModel.addSignal).toHaveBeenCalledWith(
        '123',
        'user_123',
        undefined,
        undefined,
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Response consistency', () => {
    test('all success responses should have consistent structure', async () => {
      // Test numberOfProdjects
      projectModel.getNombreProjets.mockResolvedValue({ count: 1 });
      await numberOfProdjects(req, res);
      
      let lastCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('success', true);
      expect(lastCall).toHaveProperty('message');
      expect(lastCall).toHaveProperty('data');

      // Test getAllProjects
      projectModel.getProjects.mockResolvedValue([]);
      await getAllProjects(req, res);
      
      lastCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('success', true);
      expect(lastCall).toHaveProperty('message');
      expect(lastCall).toHaveProperty('data');
    });

    test('all error responses should have consistent structure', async () => {
      const mockError = new Error('Test error');
      
      // Test numberOfProdjects error
      projectModel.getNombreProjets.mockRejectedValue(mockError);
      await numberOfProdjects(req, res);
      
      let lastCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('success', false);
      expect(lastCall).toHaveProperty('message');
      expect(lastCall).toHaveProperty('error');

      // Test getAllProjects error
      projectModel.getProjects.mockRejectedValue(mockError);
      await getAllProjects(req, res);
      
      lastCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('success', false);
      expect(lastCall).toHaveProperty('message');
      expect(lastCall).toHaveProperty('error');
    });
  });
});