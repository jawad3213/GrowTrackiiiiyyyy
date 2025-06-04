const {
  createClass,
  getAllSectors,
  getClassByName,
  updateField,
  deleteClass,
  getTotalfield
} = require('../../controllers/adminControllers/classController'); // Adjust path as needed

// Mock the classModel
jest.mock('../../models/adminModels/classModel', () => ({
  createClass: jest.fn(),
  getAllSectors: jest.fn(),
  getClassByName: jest.fn(),
  updateFieldById: jest.fn(),
  deleteClassById: jest.fn(),
  totalClasses: jest.fn(),
}));

const classModel = require('../../models/adminModels/classModel');

describe('ClassController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to avoid noise in tests
  });

  describe('createClass', () => {
    beforeEach(() => {
      req.body = {
        field: 'Computer Science',
        description: 'CS field description',
        classe: ['CS101', 'CS201', 'CS301'],
        id_admin: 'admin-123'
      };
    });

    it('should create class successfully with valid data', async () => {
      const mockNewClass = {
        id: 'class-123',
        field: 'Computer Science',
        description: 'CS field description',
        classe: ['CS101', 'CS201', 'CS301'],
        id_admin: 'admin-123'
      };
      classModel.createClass.mockResolvedValue(mockNewClass);

      await createClass(req, res);

      expect(classModel.createClass).toHaveBeenCalledWith(
        'Computer Science',
        'CS field description',
        ['CS101', 'CS201', 'CS301'],
        'admin-123'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class created successfully.",
        data: mockNewClass,
      });
    });

    it('should return 400 when classe is not an array', async () => {
      req.body.classe = 'not-an-array';

      await createClass(req, res);

      expect(classModel.createClass).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classe must be an array."
      });
    });

    it('should return 400 when classe is null', async () => {
      req.body.classe = null;

      await createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classe must be an array."
      });
    });

    it('should return 400 when classe is undefined', async () => {
      delete req.body.classe;

      await createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classe must be an array."
      });
    });

    it('should handle empty array for classe', async () => {
      req.body.classe = [];
      const mockNewClass = { id: 'class-123' };
      classModel.createClass.mockResolvedValue(mockNewClass);

      await createClass(req, res);

      expect(classModel.createClass).toHaveBeenCalledWith(
        'Computer Science',
        'CS field description',
        [],
        'admin-123'
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      classModel.createClass.mockRejectedValue(mockError);

      await createClass(req, res);

      expect(console.error).toHaveBeenCalledWith("Error creating class:", mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error."
      });
    });

    it('should handle missing required fields', async () => {
      req.body = { classe: ['CS101'] }; // Missing other required fields
      const mockNewClass = { id: 'class-123' };
      classModel.createClass.mockResolvedValue(mockNewClass);

      await createClass(req, res);

      expect(classModel.createClass).toHaveBeenCalledWith(
        undefined,
        undefined,
        ['CS101'],
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getAllSectors', () => {
    it('should retrieve all sectors successfully', async () => {
      const mockClasses = [
        { id: 1, field: 'Computer Science', description: 'CS field' },
        { id: 2, field: 'Mathematics', description: 'Math field' }
      ];
      classModel.getAllSectors.mockResolvedValue(mockClasses);

      await getAllSectors(req, res);

      expect(classModel.getAllSectors).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classes retrieved successfully.",
        data: mockClasses,
      });
    });

    it('should handle empty result from database', async () => {
      classModel.getAllSectors.mockResolvedValue([]);

      await getAllSectors(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classes retrieved successfully.",
        data: [],
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database query failed');
      classModel.getAllSectors.mockRejectedValue(mockError);

      await getAllSectors(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving classes:", mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error."
      });
    });
  });

  describe('getClassByName', () => {
    beforeEach(() => {
      req.body = { name: 'Computer Science' };
    });

    it('should retrieve class by name successfully', async () => {
      const mockClass = {
        id: 1,
        field: 'Computer Science',
        description: 'CS field',
        classe: ['CS101', 'CS201']
      };
      classModel.getClassByName.mockResolvedValue(mockClass);

      await getClassByName(req, res);

      expect(classModel.getClassByName).toHaveBeenCalledWith('Computer Science');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class retrieved successfully.",
        data: mockClass,
      });
    });

    it('should return 404 when class is not found', async () => {
      classModel.getClassByName.mockResolvedValue(null);

      await getClassByName(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class not found."
      });
    });

    it('should return 404 when class is undefined', async () => {
      classModel.getClassByName.mockResolvedValue(undefined);

      await getClassByName(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class not found."
      });
    });

    it('should handle missing name in request body', async () => {
      req.body = {};
      classModel.getClassByName.mockResolvedValue(null);

      await getClassByName(req, res);

      expect(classModel.getClassByName).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database query failed');
      classModel.getClassByName.mockRejectedValue(mockError);

      await getClassByName(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving class:", mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error."
      });
    });
  });

  describe('updateField', () => {
    beforeEach(() => {
      req.params = { id_field: 'field-123' };
      req.body = {
        field: 'Updated Computer Science',
        description: 'Updated description'
      };
    });

    it('should update field successfully', async () => {
      const mockUpdatedClass = {
        id: 'field-123',
        field: 'Updated Computer Science',
        description: 'Updated description'
      };
      classModel.updateFieldById.mockResolvedValue(mockUpdatedClass);

      await updateField(req, res);

      expect(classModel.updateFieldById).toHaveBeenCalledWith('field-123', {
        field: 'Updated Computer Science',
        description: 'Updated description'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Field updated successfully.",
        data: mockUpdatedClass,
      });
    });

    it('should return 404 when field is not found', async () => {
      classModel.updateFieldById.mockResolvedValue(null);

      await updateField(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Field not found or no data provided."
      });
    });

    it('should return 404 when field is undefined', async () => {
      classModel.updateFieldById.mockResolvedValue(undefined);

      await updateField(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Field not found or no data provided."
      });
    });

    it('should handle empty updates object', async () => {
      req.body = {};
      classModel.updateFieldById.mockResolvedValue(null);

      await updateField(req, res);

      expect(classModel.updateFieldById).toHaveBeenCalledWith('field-123', {});
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database update failed');
      classModel.updateFieldById.mockRejectedValue(mockError);

      await updateField(req, res);

      expect(console.error).toHaveBeenCalledWith("Error updating class:", mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error."
      });
    });
  });

  describe('deleteClass', () => {
    beforeEach(() => {
      req.params = { id_class: 'class-123' };
    });

    it('should delete class successfully', async () => {
      // PostgreSQL returns { rows: [], rowCount: 1 } for successful DELETE
      const mockResult = { rows: [], rowCount: 1 };
      classModel.deleteClassById.mockResolvedValue(mockResult);

      await deleteClass(req, res);

      expect(classModel.deleteClassById).toHaveBeenCalledWith('class-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class deleted successfully."
      });
    });

    it('should return 404 when class is not found (rowCount = 0)', async () => {
      // PostgreSQL returns { rows: [], rowCount: 0 } when no rows are affected
      const mockResult = { rows: [], rowCount: 0 };
      classModel.deleteClassById.mockResolvedValue(mockResult);

      await deleteClass(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class not found."
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database delete failed');
      classModel.deleteClassById.mockRejectedValue(mockError);

      await deleteClass(req, res);

      expect(console.error).toHaveBeenCalledWith("Error deleting class:", mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error."
      });
    });

    it('should handle successful deletion with multiple affected rows', async () => {
      // Edge case: if somehow multiple rows are deleted
      const mockResult = { rows: [], rowCount: 2 };
      classModel.deleteClassById.mockResolvedValue(mockResult);

      await deleteClass(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class deleted successfully."
      });
    });
  });

  describe('getTotalfield', () => {
    it('should retrieve total field count successfully', async () => {
      const mockTotal = { count: 25 };
      classModel.totalClasses.mockResolvedValue(mockTotal);

      await getTotalfield(req, res);

      expect(classModel.totalClasses).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of classes retrieved successfully.",
        data: mockTotal,
      });
    });

    it('should handle zero count', async () => {
      const mockTotal = { count: 0 };
      classModel.totalClasses.mockResolvedValue(mockTotal);

      await getTotalfield(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of classes retrieved successfully.",
        data: mockTotal,
      });
    });

    it('should handle null result from database', async () => {
      classModel.totalClasses.mockResolvedValue(null);

      await getTotalfield(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of classes retrieved successfully.",
        data: null,
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database count query failed');
      classModel.totalClasses.mockRejectedValue(mockError);

      await getTotalfield(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving total classes:", mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error."
      });
    });
  });

  describe('Edge Cases and Integration Tests', () => {
    it('should handle PostgreSQL-specific edge cases', async () => {
      // Test case where PostgreSQL might return an empty result set
      const mockClasses = [];
      classModel.getAllSectors.mockResolvedValue(mockClasses);

      await getAllSectors(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classes retrieved successfully.",
        data: [],
      });
    });

    it('should validate array types correctly in createClass', async () => {
      req.body = {
        field: 'Test',
        description: 'Test',
        classe: ['valid', 'array', 'items'],
        id_admin: 'admin-123'
      };
      const mockNewClass = { id: 'test' };
      classModel.createClass.mockResolvedValue(mockNewClass);

      await createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle concurrent delete operations', async () => {
      // Simulate scenario where class was already deleted by another process
      req.params = { id_class: 'class-123' };
      const mockResult = { rows: [], rowCount: 0 };
      classModel.deleteClassById.mockResolvedValue(mockResult);

      await deleteClass(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class not found."
      });
    });
  });

  describe('Response Format Validation', () => {
    it('should ensure consistent response format for successful operations', async () => {
      const mockClass = { id: 1, field: 'Test' };
      classModel.getClassByName.mockResolvedValue(mockClass);
      req.body = { name: 'Test' };

      await getClassByName(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          data: expect.any(Object)
        })
      );
    });

    it('should ensure consistent error response format', async () => {
      classModel.getAllSectors.mockRejectedValue(new Error('Test error'));

      await getAllSectors(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String)
        })
      );
    });
  });
});