jest.mock('../../../config/db'); // Mock the database pool
const {
  picture_controller,
  personnal_information_controller
} = require('../../../controllers/adminControllers/AdminProfile_Controller.js'); 

// Mock the ProfileModel
jest.mock('../../../models/adminModels/AdminProfile_Model.js', () => ({
  picture_model: jest.fn(),
  personnal_information_model: jest.fn(),
}));

const ProfileModel = require('../../../models/adminModels/AdminProfile_Model.js');

describe('AdminProfileController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: 'test-user-id-123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to avoid noise in tests
  });

  describe('picture_controller', () => {
    it('should return picture URL successfully when picture exists', async () => {
      const mockPictureURL = 'https://example.com/profile-picture.jpg';
      ProfileModel.picture_model.mockResolvedValue(mockPictureURL);

      await picture_controller(req, res);

      expect(ProfileModel.picture_model).toHaveBeenCalledTimes(1);
      expect(ProfileModel.picture_model).toHaveBeenCalledWith('test-user-id-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ picture_URL: mockPictureURL });
    });

    it('should return 404 when no picture URL is found', async () => {
      ProfileModel.picture_model.mockResolvedValue(null);

      await picture_controller(req, res);

      expect(ProfileModel.picture_model).toHaveBeenCalledWith('test-user-id-123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "No picture url found for this id." 
      });
    });

    it('should return 404 when picture URL is undefined', async () => {
      ProfileModel.picture_model.mockResolvedValue(undefined);

      await picture_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "No picture url found for this id." 
      });
    });

    it('should return 404 when picture URL is empty string', async () => {
      ProfileModel.picture_model.mockResolvedValue('');

      await picture_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "No picture url found for this id." 
      });
    });

    it('should handle database errors and return 500', async () => {
      const mockError = new Error('Database connection failed');
      ProfileModel.picture_model.mockRejectedValue(mockError);

      await picture_controller(req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Server Error, Please try again later!" 
      });
    });

    it('should handle missing user ID in request', async () => {
      req.user.id = undefined;
      ProfileModel.picture_model.mockResolvedValue(null);

      await picture_controller(req, res);

      expect(ProfileModel.picture_model).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle model throwing error with specific message', async () => {
      const specificError = new Error('User not found in database');
      ProfileModel.picture_model.mockRejectedValue(specificError);

      await picture_controller(req, res);

      expect(console.error).toHaveBeenCalledWith(specificError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Server Error, Please try again later!" 
      });
    });
  });

  describe('personnal_information_controller', () => {
    const mockPersonalInfo = {
      id: 'test-user-id-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      department: 'Computer Science',
      position: 'Administrator'
    };

    it('should return personal information successfully when data exists', async () => {
      ProfileModel.personnal_information_model.mockResolvedValue(mockPersonalInfo);

      await personnal_information_controller(req, res);

      expect(ProfileModel.personnal_information_model).toHaveBeenCalledTimes(1);
      expect(ProfileModel.personnal_information_model).toHaveBeenCalledWith('test-user-id-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        personnal_information: mockPersonalInfo 
      });
    });

    it('should return 404 when no personal information is found', async () => {
      ProfileModel.personnal_information_model.mockResolvedValue(null);

      await personnal_information_controller(req, res);

      expect(ProfileModel.personnal_information_model).toHaveBeenCalledWith('test-user-id-123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "No data found for this id." 
      });
    });

    it('should return 404 when personal information is undefined', async () => {
      ProfileModel.personnal_information_model.mockResolvedValue(undefined);

      await personnal_information_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "No data found for this id." 
      });
    });

    it('should return 200 when personal information is empty object', async () => {
      const emptyInfo = {};
      ProfileModel.personnal_information_model.mockResolvedValue(emptyInfo);

      await personnal_information_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        personnal_information: emptyInfo 
      });
    });

    it('should handle database errors and return 500', async () => {
      const mockError = new Error('Database query failed');
      ProfileModel.personnal_information_model.mockRejectedValue(mockError);

      await personnal_information_controller(req, res);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Server Error, Please try again later!" 
      });
    });

    it('should handle missing user ID in request', async () => {
      req.user.id = null;
      ProfileModel.personnal_information_model.mockResolvedValue(null);

      await personnal_information_controller(req, res);

      expect(ProfileModel.personnal_information_model).toHaveBeenCalledWith(null);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle partial personal information data', async () => {
      const partialInfo = {
        firstName: 'Jane',
        email: 'jane@example.com'
        // Missing other fields
      };
      ProfileModel.personnal_information_model.mockResolvedValue(partialInfo);

      await personnal_information_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        personnal_information: partialInfo 
      });
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('ETIMEDOUT');
      timeoutError.code = 'ETIMEDOUT';
      ProfileModel.personnal_information_model.mockRejectedValue(timeoutError);

      await personnal_information_controller(req, res);

      expect(console.error).toHaveBeenCalledWith(timeoutError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Server Error, Please try again later!" 
      });
    });
  });

  describe('Edge Cases and Integration Scenarios', () => {
    it('should handle missing req.user object gracefully in picture_controller', async () => {
      req.user = undefined;
      
      // This will cause an error when trying to access req.user.id
      await picture_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Server Error, Please try again later!" 
      });
    });

    it('should handle missing req.user object gracefully in personnal_information_controller', async () => {
      req.user = undefined;
      
      await personnal_information_controller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Server Error, Please try again later!" 
      });
    });

    it('should handle different data types returned from picture_model', async () => {
      // Test with boolean false
      ProfileModel.picture_model.mockResolvedValue(false);
      await picture_controller(req, res);
      expect(res.status).toHaveBeenCalledWith(404);

      // Test with number 0
      ProfileModel.picture_model.mockResolvedValue(0);
      await picture_controller(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle different data types returned from personnal_information_model', async () => {
      // Test with boolean false
      ProfileModel.personnal_information_model.mockResolvedValue(false);
      await personnal_information_controller(req, res);
      expect(res.status).toHaveBeenCalledWith(404);

      // Test with number 0
      ProfileModel.personnal_information_model.mockResolvedValue(0);
      await personnal_information_controller(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Response Format Validation', () => {
    it('should ensure picture_controller response has correct structure', async () => {
      const mockURL = 'https://example.com/pic.jpg';
      ProfileModel.picture_model.mockResolvedValue(mockURL);

      await picture_controller(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          picture_URL: expect.any(String)
        })
      );
    });

    it('should ensure personnal_information_controller response has correct structure', async () => {
      const mockInfo = { name: 'Test User' };
      ProfileModel.personnal_information_model.mockResolvedValue(mockInfo);

      await personnal_information_controller(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          personnal_information: expect.any(Object)
        })
      );
    });
  });
});