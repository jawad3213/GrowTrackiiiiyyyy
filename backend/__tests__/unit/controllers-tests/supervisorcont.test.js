const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const supervisorController = require("../../../controllers/adminControllers/supervisorController"); 
const supervisorModel = require("../../../models/adminModels/supervisorModel");

// Mock dependencies
jest.mock("bcrypt");
jest.mock("uuid");
jest.mock("../../../models/adminModels/supervisorModel");

describe("Supervisor Controller", () => {
  let req, res;
  const mockUuid = "123e4567-e89b-12d3-a456-426614174000";
  const mockHashedPassword = "$2b$10$hashedPassword";

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    uuidv4.mockReturnValue(mockUuid);
    bcrypt.hash.mockResolvedValue(mockHashedPassword);
    
    // Mock request and response objects
    req = {
      body: {},
      params: {},
      file: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("generateImageUrl helper", () => {
    // Test the helper function indirectly through the controller methods
    it("should generate correct image URL", () => {
      const path = "uploads\\profile\\image.jpg";
      const expectedUrl = "http://localhost:3000/uploads/profile/image.jpg";
      
      // This will be tested indirectly through getAllSupervisors
    });

    it("should return null for empty path", () => {
      // This will be tested indirectly through getAllSupervisors
    });
  });

  describe("createSupervisor", () => {
    beforeEach(() => {
      req.body = {
        name: "John Doe",
        cin_sepervisor: "AB123456",
        email: "john@example.com",
        pass: "password123",
        company: "Tech Corp",
        number: "123456789",
        position: "Senior Developer",
        cin_student: "ST789012",
        date_start: "2024-01-01",
        date_done: "2024-06-01",
        subject: "Web Development",
        note: "Excellent supervisor"
      };
    });

    it("should create supervisor successfully without image", async () => {
      const mockSupervisor = { 
        id_user: mockUuid, 
        name: "John Doe", 
        email: "john@example.com",
        role: "Supervisor"
      };
      supervisorModel.createSupervisor.mockResolvedValue(mockSupervisor);

      await supervisorController.createSupervisor(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(uuidv4).toHaveBeenCalled();
      expect(supervisorModel.createSupervisor).toHaveBeenCalledWith(
        mockUuid,
        "John Doe",
        "AB123456",
        "john@example.com",
        mockHashedPassword,
        "Tech Corp",
        "123456789",
        "Senior Developer",
        "ST789012",
        "2024-01-01",
        "2024-06-01",
        "Web Development",
        "Excellent supervisor",
        "Supervisor",
        null
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisor added successfully.",
        data: mockSupervisor
      });
    });

    it("should create supervisor successfully with image", async () => {
      req.file = { path: "uploads/profile/image.jpg" };
      const mockSupervisor = { 
        id_user: mockUuid, 
        name: "John Doe",
        profile_picture: "uploads/profile/image.jpg"
      };
      supervisorModel.createSupervisor.mockResolvedValue(mockSupervisor);

      await supervisorController.createSupervisor(req, res);

      expect(supervisorModel.createSupervisor).toHaveBeenCalledWith(
        mockUuid,
        "John Doe",
        "AB123456",
        "john@example.com",
        mockHashedPassword,
        "Tech Corp",
        "123456789",
        "Senior Developer",
        "ST789012",
        "2024-01-01",
        "2024-06-01",
        "Web Development",
        "Excellent supervisor",
        "Supervisor",
        "uploads/profile/image.jpg"
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle duplicate email error", async () => {
      const duplicateError = { code: '23505' };
      supervisorModel.createSupervisor.mockRejectedValue(duplicateError);

      await supervisorController.createSupervisor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "The email address already exists. Please use a different email."
      });
    });

    it("should handle bcrypt hashing error", async () => {
      const hashError = new Error("Hashing failed");
      bcrypt.hash.mockRejectedValue(hashError);

      await supervisorController.createSupervisor(req, res);

      expect(console.error).toHaveBeenCalledWith("Error while adding supervisor:", "Hashing failed");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });

    it("should handle general server error", async () => {
      const error = new Error("Database connection failed");
      supervisorModel.createSupervisor.mockRejectedValue(error);

      await supervisorController.createSupervisor(req, res);

      expect(console.error).toHaveBeenCalledWith("Error while adding supervisor:", "Database connection failed");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("getAllSupervisors", () => {
    it("should retrieve all supervisors successfully", async () => {
      const mockSupervisors = [
        { 
          id: 1, 
          name: "John Doe", 
          profile_picture: "uploads\\profile\\john.jpg" 
        },
        { 
          id: 2, 
          name: "Jane Smith", 
          profile_picture: null 
        }
      ];
      supervisorModel.getAllSupervisors.mockResolvedValue(mockSupervisors);

      await supervisorController.getAllSupervisors(req, res);

      expect(supervisorModel.getAllSupervisors).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisors retrieved successfully.",
        data: [
          {
            id: 1,
            name: "John Doe",
            profile_picture: "uploads\\profile\\john.jpg",
            profile_picture_url: "http://localhost:3000/uploads/profile/john.jpg"
          },
          {
            id: 2,
            name: "Jane Smith",
            profile_picture: null,
            profile_picture_url: null
          }
        ]
      });
    });

    it("should handle empty supervisors array", async () => {
      supervisorModel.getAllSupervisors.mockResolvedValue([]);

      await supervisorController.getAllSupervisors(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "No supervisors found.",
        data: []
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Database error");
      supervisorModel.getAllSupervisors.mockRejectedValue(error);

      await supervisorController.getAllSupervisors(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving supervisors:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error. Please try again later."
      });
    });
  });

  describe("getSupervisorByCin", () => {
    beforeEach(() => {
      req.body = { cin: "AB123456" };
    });

    it("should retrieve supervisor by CIN successfully", async () => {
      const mockSupervisor = {
        id: 1,
        name: "John Doe",
        cin_sepervisor: "AB123456",
        profile_picture: "uploads/profile/john.jpg"
      };
      supervisorModel.getSupervisorByCin.mockResolvedValue(mockSupervisor);

      await supervisorController.getSupervisorByCin(req, res);

      expect(supervisorModel.getSupervisorByCin).toHaveBeenCalledWith("AB123456");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisor retrieved successfully.",
        data: {
          ...mockSupervisor,
          profile_picture_url: "http://localhost:3000/uploads/profile/john.jpg"
        }
      });
    });

    it("should handle supervisor not found", async () => {
      supervisorModel.getSupervisorByCin.mockResolvedValue(null);

      await supervisorController.getSupervisorByCin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisor not found.",
        data: null
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Database error");
      supervisorModel.getSupervisorByCin.mockRejectedValue(error);

      await supervisorController.getSupervisorByCin(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving supervisor by CIN:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error. Please try again later."
      });
    });
  });

  describe("updateSupervisor", () => {
    beforeEach(() => {
      req.params = { id_supervisor: mockUuid };
      req.body = {
        name: "Updated John Doe",
        company: "Updated Tech Corp"
      };
    });

    it("should update supervisor successfully without image", async () => {
      const mockUpdatedSupervisor = {
        id_user: mockUuid,
        name: "Updated John Doe",
        company: "Updated Tech Corp"
      };
      supervisorModel.updateSupervisorById.mockResolvedValue(mockUpdatedSupervisor);

      await supervisorController.updateSupervisor(req, res);

      expect(supervisorModel.updateSupervisorById).toHaveBeenCalledWith(mockUuid, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully.",
        data: mockUpdatedSupervisor
      });
    });

    it("should update supervisor successfully with image", async () => {
      req.file = { path: "uploads/profile/updated.jpg" };
      const expectedUpdates = {
        ...req.body,
        profile_picture: "uploads/profile/updated.jpg"
      };
      const mockUpdatedSupervisor = {
        id_user: mockUuid,
        name: "Updated John Doe",
        profile_picture: "uploads/profile/updated.jpg"
      };
      supervisorModel.updateSupervisorById.mockResolvedValue(mockUpdatedSupervisor);

      await supervisorController.updateSupervisor(req, res);

      expect(supervisorModel.updateSupervisorById).toHaveBeenCalledWith(mockUuid, expectedUpdates);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle supervisor not found", async () => {
      supervisorModel.updateSupervisorById.mockResolvedValue(null);

      await supervisorController.updateSupervisor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found or no fields provided."
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Update failed");
      supervisorModel.updateSupervisorById.mockRejectedValue(error);

      await supervisorController.updateSupervisor(req, res);

      expect(console.error).toHaveBeenCalledWith("Error while updating supervisor:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("deleteSupervisor", () => {
    beforeEach(() => {
      req.params = { id_member: mockUuid };
    });

    it("should delete supervisor successfully", async () => {
      const mockResult = { rowCount: 1 };
      supervisorModel.deleteSupervisorById.mockResolvedValue(mockResult);

      await supervisorController.deleteSupervisor(req, res);

      expect(supervisorModel.deleteSupervisorById).toHaveBeenCalledWith(mockUuid);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisor deleted successfully."
      });
    });

    it("should handle supervisor not found", async () => {
      const mockResult = { rowCount: 0 };
      supervisorModel.deleteSupervisorById.mockResolvedValue(mockResult);

      await supervisorController.deleteSupervisor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisor not found."
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Delete failed");
      supervisorModel.deleteSupervisorById.mockRejectedValue(error);

      await supervisorController.deleteSupervisor(req, res);

      expect(console.error).toHaveBeenCalledWith("Error deleting supervisor:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("getTotalSupervisors", () => {
    it("should get total supervisors successfully", async () => {
      const mockTotal = 15;
      supervisorModel.total.mockResolvedValue(mockTotal);

      await supervisorController.getTotalSupervisors(req, res);

      expect(supervisorModel.total).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of supervisors retrieved successfully.",
        data: mockTotal
      });
    });

    it("should handle zero total", async () => {
      supervisorModel.total.mockResolvedValue(0);

      await supervisorController.getTotalSupervisors(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of supervisors retrieved successfully.",
        data: 0
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Count failed");
      supervisorModel.total.mockRejectedValue(error);

      await supervisorController.getTotalSupervisors(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving total number of supervisors:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("getSupervisorsByPosition", () => {
    beforeEach(() => {
      req.body = { position: "Senior Developer" };
    });

    it("should retrieve supervisors by position successfully", async () => {
      const mockSupervisors = [
        { 
          id: 1, 
          name: "John Doe", 
          position: "Senior Developer",
          profile_picture: "uploads/profile/john.jpg" 
        },
        { 
          id: 2, 
          name: "Jane Smith", 
          position: "Senior Developer",
          profile_picture: null 
        }
      ];
      supervisorModel.getSupervisorsByPosition.mockResolvedValue(mockSupervisors);

      await supervisorController.getSupervisorsByPosition(req, res);

      expect(supervisorModel.getSupervisorsByPosition).toHaveBeenCalledWith("Senior Developer");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisors retrieved successfully by position.",
        data: [
          {
            ...mockSupervisors[0],
            profile_picture_url: "http://localhost:3000/uploads/profile/john.jpg"
          },
          {
            ...mockSupervisors[1],
            profile_picture_url: null
          }
        ]
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Database error");
      supervisorModel.getSupervisorsByPosition.mockRejectedValue(error);

      await supervisorController.getSupervisorsByPosition(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving supervisors by position:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("getSupervisorsByCompany", () => {
    beforeEach(() => {
      req.body = { company: "Tech Corp" };
    });

    it("should retrieve supervisors by company successfully", async () => {
      const mockSupervisors = [
        { 
          id: 1, 
          name: "John Doe", 
          company: "Tech Corp",
          profile_picture: "uploads\\profile\\john.jpg" 
        }
      ];
      supervisorModel.getSupervisorsByCompany.mockResolvedValue(mockSupervisors);

      await supervisorController.getSupervisorsByCompany(req, res);

      expect(supervisorModel.getSupervisorsByCompany).toHaveBeenCalledWith("Tech Corp");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisors retrieved successfully by company.",
        data: [
          {
            ...mockSupervisors[0],
            profile_picture_url: "http://localhost:3000/uploads/profile/john.jpg"
          }
        ]
      });
    });

    it("should handle empty results", async () => {
      supervisorModel.getSupervisorsByCompany.mockResolvedValue([]);

      await supervisorController.getSupervisorsByCompany(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisors retrieved successfully by company.",
        data: []
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Database error");
      supervisorModel.getSupervisorsByCompany.mockRejectedValue(error);

      await supervisorController.getSupervisorsByCompany(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving supervisors by company:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });
});

// Additional edge case tests
describe("Supervisor Controller Edge Cases", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {},
      params: {},
      file: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("Image URL generation edge cases", () => {
    it("should handle Windows-style paths correctly", async () => {
      const mockSupervisors = [
        { 
          id: 1, 
          name: "John Doe", 
          profile_picture: "uploads\\profile\\subfolder\\john.jpg" 
        }
      ];
      supervisorModel.getAllSupervisors.mockResolvedValue(mockSupervisors);

      await supervisorController.getAllSupervisors(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisors retrieved successfully.",
        data: [
          {
            id: 1,
            name: "John Doe",
            profile_picture: "uploads\\profile\\subfolder\\john.jpg",
            profile_picture_url: "http://localhost:3000/uploads/profile/subfolder/john.jpg"
          }
        ]
      });
    });

    it("should handle null profile picture paths", async () => {
      const mockSupervisors = [
        { 
          id: 1, 
          name: "John Doe", 
          profile_picture: null 
        }
      ];
      supervisorModel.getAllSupervisors.mockResolvedValue(mockSupervisors);

      await supervisorController.getAllSupervisors(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Supervisors retrieved successfully.",
        data: [
          {
            id: 1,
            name: "John Doe",
            profile_picture: null,
            profile_picture_url: null
          }
        ]
      });
    });
  });

  describe("Parameter validation edge cases", () => {
    it("should handle missing CIN in getSupervisorByCin", async () => {
      req.body = {}; // Missing cin
      supervisorModel.getSupervisorByCin.mockResolvedValue(null);

      await supervisorController.getSupervisorByCin(req, res);

      expect(supervisorModel.getSupervisorByCin).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle missing position in getSupervisorsByPosition", async () => {
      req.body = {}; // Missing position
      supervisorModel.getSupervisorsByPosition.mockResolvedValue([]);

      await supervisorController.getSupervisorsByPosition(req, res);

      expect(supervisorModel.getSupervisorsByPosition).toHaveBeenCalledWith(undefined);
    });

    it("should handle missing company in getSupervisorsByCompany", async () => {
      req.body = {}; // Missing company
      supervisorModel.getSupervisorsByCompany.mockResolvedValue([]);

      await supervisorController.getSupervisorsByCompany(req, res);

      expect(supervisorModel.getSupervisorsByCompany).toHaveBeenCalledWith(undefined);
    });
  });
});