const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const professorController = require("../../controllers/adminControllers/professorController");
const professorModel = require("../../models/adminModels/professorModel");

// Mock dependencies
jest.mock("bcrypt");
jest.mock("uuid");
jest.mock("../../models/adminModels/professorModel");

// Mock the database connection to prevent actual DB connections during tests
jest.mock("../../config/db", () => ({
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn()
}));

describe("Professor Controller", () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup console mocks to avoid test output pollution
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createProfessor", () => {
    const validProfessorData = {
      name: "John Doe",
      cin: "AB123456",
      email: "john.doe@university.edu",
      pass: "password123",
      departement: "Computer Science",
      course: ["Math", "Physics"],
      code: "CS101",
      classe: ["Class A", "Class B"],
      note: "Excellent teacher"
    };

    beforeEach(() => {
      uuidv4.mockReturnValue("test-uuid-123");
      bcrypt.hash.mockResolvedValue("hashed-password");
      professorModel.createProfessor.mockResolvedValue({
        id_user: "test-uuid-123",
        ...validProfessorData
      });
    });

    describe("Happy Path", () => {
      test("should create professor successfully with valid data", async () => {
        req.body = validProfessorData;

        await professorController.createProfessor(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        expect(professorModel.createProfessor).toHaveBeenCalledWith(
          "test-uuid-123",
          "John Doe",
          "AB123456",
          "john.doe@university.edu",
          "hashed-password",
          "Computer Science",
          ["Math", "Physics"],
          "CS101",
          ["Class A", "Class B"],
          "Excellent teacher",
          "Professor",
          null
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor added successfully.",
          professor: expect.any(Object)
        });
      });

      test("should create professor with file upload", async () => {
        req.body = validProfessorData;
        req.file = { path: "uploads/profile.jpg" };

        await professorController.createProfessor(req, res);

        expect(professorModel.createProfessor).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(Array),
          expect.any(String),
          expect.any(Array),
          expect.any(String),
          "Professor",
          "uploads/profile.jpg"
        );
        expect(res.status).toHaveBeenCalledWith(201);
      });

      test("should parse string arrays correctly", async () => {
        req.body = {
          ...validProfessorData,
          course: JSON.stringify(["Math", "Physics"]),
          classe: JSON.stringify(["Class A", "Class B"])
        };

        await professorController.createProfessor(req, res);

        expect(professorModel.createProfessor).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          ["Math", "Physics"],
          expect.any(String),
          ["Class A", "Class B"],
          expect.any(String),
          "Professor",
          null
        );
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });

    describe("Unhappy Path", () => {
      test("should return 500 when course JSON parsing fails", async () => {
        req.body = {
          ...validProfessorData,
          course: "not-valid-json"
        };

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });

      test("should return 500 when classe JSON parsing fails", async () => {
        req.body = {
          ...validProfessorData,
          classe: "not-valid-json"
        };

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });

      test("should return 400 when course and classe have different lengths", async () => {
        req.body = {
          ...validProfessorData,
          course: ["Math", "Physics"],
          classe: ["Class A"]
        };

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "Classes and courses must have the same length."
        });
      });

      test("should handle duplicate email error (23505)", async () => {
        req.body = validProfessorData;
        const duplicateError = new Error("Duplicate key value");
        duplicateError.code = '23505';
        professorModel.createProfessor.mockRejectedValue(duplicateError);

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: "The email address already exists. Please use a different email."
        });
      });

      test("should handle general server error", async () => {
        req.body = validProfessorData;
        professorModel.createProfessor.mockRejectedValue(new Error("Database error"));

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });
    });

    describe("Edge Cases", () => {
      test("should handle invalid JSON parsing gracefully", async () => {
        req.body = {
          ...validProfessorData,
          course: "{invalid-json}",
          classe: ["Class A"]
        };

        await professorController.createProfessor(req, res);

        // Since JSON.parse fails, it throws SyntaxError caught by general handler
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });

      test("should validate arrays when provided as objects", async () => {
        req.body = {
          ...validProfessorData,
          course: { not: "array" }, // This will fail Array.isArray check
          classe: ["Class A"]
        };

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "course and classe must be arrays."
        });
      });

      test("should handle empty arrays", async () => {
        req.body = {
          ...validProfessorData,
          course: [],
          classe: []
        };

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
      });

      test("should handle bcrypt hashing failure", async () => {
        req.body = validProfessorData;
        bcrypt.hash.mockRejectedValue(new Error("Bcrypt error"));

        await professorController.createProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe("getAllProfessor", () => {
    describe("Happy Path", () => {
      test("should return all professors successfully", async () => {
        const mockProfessors = [
          { id: 1, name: "John Doe", profile_picture: "uploads/john.jpg" },
          { id: 2, name: "Jane Smith", profile_picture: null }
        ];
        professorModel.getAllProfessor.mockResolvedValue(mockProfessors);

        await professorController.getAllProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professors retrieved successfully.",
          data: [
            { 
              id: 1, 
              name: "John Doe", 
              profile_picture: "uploads/john.jpg",
              profile_picture_url: "http://localhost:3000/uploads/john.jpg"
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

      test("should return empty array when no professors found", async () => {
        professorModel.getAllProfessor.mockResolvedValue([]);

        await professorController.getAllProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "No professor found.",
          data: []
        });
      });
    });

    describe("Unhappy Path", () => {
      test("should handle database error", async () => {
        professorModel.getAllProfessor.mockRejectedValue(new Error("Database error"));

        await professorController.getAllProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: "Internal server error. Please try again later."
        });
      });
    });
  });

  describe("getProfessorByCin", () => {
    describe("Happy Path", () => {
      test("should return professor by CIN successfully", async () => {
        const mockProfessor = {
          id: 1,
          name: "John Doe",
          cin: "AB123456",
          profile_picture: "uploads/john.jpg"
        };
        professorModel.getProfessorByCin.mockResolvedValue(mockProfessor);
        req.body = { cin: "AB123456" };

        await professorController.getProfessorByCin(req, res);

        expect(professorModel.getProfessorByCin).toHaveBeenCalledWith("AB123456");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor retrieved successfully.",
          data: {
            ...mockProfessor,
            profile_picture_url: "http://localhost:3000/uploads/john.jpg"
          }
        });
      });
    });

    describe("Unhappy Path", () => {
      test("should return 404 when professor not found", async () => {
        professorModel.getProfessorByCin.mockResolvedValue(null);
        req.body = { cin: "NOTFOUND" };

        await professorController.getProfessorByCin(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor not found.",
          data: null
        });
      });

      test("should handle database error", async () => {
        professorModel.getProfessorByCin.mockRejectedValue(new Error("Database error"));
        req.body = { cin: "AB123456" };

        await professorController.getProfessorByCin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: "Internal server error. Please try again later."
        });
      });
    });

    describe("Edge Cases", () => {
      test("should handle undefined CIN", async () => {
        req.body = {};

        await professorController.getProfessorByCin(req, res);

        expect(professorModel.getProfessorByCin).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe("updateProfessor", () => {
    describe("Happy Path", () => {
      test("should update professor successfully", async () => {
        const mockUpdatedProfessor = { id: 1, name: "Updated Name" };
        professorModel.updateProfessorById.mockResolvedValue(mockUpdatedProfessor);
        req.params = { id_professor: "prof123" };
        req.body = { name: "Updated Name" };

        await professorController.updateProfessor(req, res);

        expect(professorModel.updateProfessorById).toHaveBeenCalledWith("prof123", {
          name: "Updated Name"
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor updated successfully.",
          data: mockUpdatedProfessor
        });
      });

      test("should update professor with new profile picture", async () => {
        const mockUpdatedProfessor = { id: 1, name: "John Doe" };
        professorModel.updateProfessorById.mockResolvedValue(mockUpdatedProfessor);
        req.params = { id_professor: "prof123" };
        req.body = { name: "John Doe" };
        req.file = { path: "uploads/new-picture.jpg" };

        await professorController.updateProfessor(req, res);

        expect(professorModel.updateProfessorById).toHaveBeenCalledWith("prof123", {
          name: "John Doe",
          profile_picture: "uploads/new-picture.jpg"
        });
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe("Unhappy Path", () => {
      test("should return 404 when professor not found", async () => {
        professorModel.updateProfessorById.mockResolvedValue(null);
        req.params = { id_professor: "nonexistent" };
        req.body = { name: "Updated Name" };

        await professorController.updateProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor not found or no fields provided."
        });
      });

      test("should handle database error", async () => {
        professorModel.updateProfessorById.mockRejectedValue(new Error("Database error"));
        req.params = { id_professor: "prof123" };
        req.body = { name: "Updated Name" };

        await professorController.updateProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error."
        });
      });
    });
  });

  describe("deleteProfessor", () => {
    describe("Happy Path", () => {
      test("should delete professor successfully", async () => {
        professorModel.deleteProfessorById.mockResolvedValue({ rowCount: 1 });
        req.params = { id_member: "prof123" };

        await professorController.deleteProfessor(req, res);

        expect(professorModel.deleteProfessorById).toHaveBeenCalledWith("prof123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor deleted successfully."
        });
      });
    });

    describe("Unhappy Path", () => {
      test("should return 404 when professor not found", async () => {
        professorModel.deleteProfessorById.mockResolvedValue({ rowCount: 0 });
        req.params = { id_member: "nonexistent" };

        await professorController.deleteProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professor not found."
        });
      });

      test("should handle database error", async () => {
        professorModel.deleteProfessorById.mockRejectedValue(new Error("Database error"));
        req.params = { id_member: "prof123" };

        await professorController.deleteProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });
    });
  });

  describe("getTotalProfessors", () => {
    describe("Happy Path", () => {
      test("should return total count successfully", async () => {
        professorModel.total.mockResolvedValue(25);

        await professorController.getTotalProfessors(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Total number of professors retrieved successfully.",
          data: 25
        });
      });
    });

    describe("Unhappy Path", () => {
      test("should handle database error", async () => {
        professorModel.total.mockRejectedValue(new Error("Database error"));

        await professorController.getTotalProfessors(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });
    });

    describe("Edge Cases", () => {
      test("should handle zero count", async () => {
        professorModel.total.mockResolvedValue(0);

        await professorController.getTotalProfessors(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Total number of professors retrieved successfully.",
          data: 0
        });
      });
    });
  });

  describe("getProfessorsByClass", () => {
    describe("Happy Path", () => {
      test("should return professors by class successfully", async () => {
        const mockProfessors = [
          { id: 1, name: "John Doe", profile_picture: "uploads/john.jpg" }
        ];
        professorModel.getProfessorsByClass.mockResolvedValue(mockProfessors);
        req.body = { classe: "Class A" };

        await professorController.getProfessorsByClass(req, res);

        expect(professorModel.getProfessorsByClass).toHaveBeenCalledWith("Class A");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professors retrieved successfully by class.",
          data: [{
            id: 1,
            name: "John Doe",
            profile_picture: "uploads/john.jpg",
            profile_picture_url: "http://localhost:3000/uploads/john.jpg"
          }]
        });
      });
    });

    describe("Unhappy Path", () => {
      test("should handle database error", async () => {
        professorModel.getProfessorsByClass.mockRejectedValue(new Error("Database error"));
        req.body = { classe: "Class A" };

        await professorController.getProfessorsByClass(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });
    });
  });

  describe("getProfessorsBySector", () => {
    describe("Happy Path", () => {
      test("should return professors by sector successfully", async () => {
        const mockProfessors = [
          { id: 1, name: "John Doe", profile_picture: null }
        ];
        professorModel.getStudentsBySector.mockResolvedValue(mockProfessors);
        req.body = { sector: "Engineering" };

        await professorController.getProfessorsBySector(req, res);

        expect(professorModel.getStudentsBySector).toHaveBeenCalledWith("Engineering");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "Professors retrieved successfully by sector.",
          data: [{
            id: 1,
            name: "John Doe",
            profile_picture: null,
            profile_picture_url: null
          }]
        });
      });
    });

    describe("Unhappy Path", () => {
      test("should handle database error", async () => {
        professorModel.getStudentsBySector.mockRejectedValue(new Error("Database error"));
        req.body = { sector: "Engineering" };

        await professorController.getProfessorsBySector(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error. Please try again later."
        });
      });
    });
  });

  describe("generateImageUrl helper function", () => {
    // Note: This function is not exported, but we can test its behavior through other functions
    test("should generate correct URL format through getAllProfessor", async () => {
      const mockProfessors = [
        { id: 1, profile_picture: "uploads\\windows\\path.jpg" }
      ];
      professorModel.getAllProfessor.mockResolvedValue(mockProfessors);

      await professorController.getAllProfessor(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Professors retrieved successfully.",
        data: [{
          id: 1,
          profile_picture: "uploads\\windows\\path.jpg",
          profile_picture_url: "http://localhost:3000/uploads/windows/path.jpg"
        }]
      });
    });
  });
});