const skillController = require("../../../controllers/adminControllers/skillController");
const skillModel = require("../../../models/adminModels/skillModel");

// Mock the skillModel
jest.mock("../../../models/adminModels/skillModel");

describe("Skill Controller", () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock console methods to avoid cluttering test output
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("createSkill", () => {
    beforeEach(() => {
      req.body = {
        skill_name: "JavaScript",
        question1: "What is a closure?",
        question2: "Explain hoisting",
        question3: "What is the event loop?",
        description_skill: "Programming language for web development",
        id_admin: 1
      };
    });

    it("should create a skill successfully", async () => {
      const mockSkill = { id: 1, skill_name: "JavaScript", ...req.body };
      skillModel.createSkill.mockResolvedValue(mockSkill);

      await skillController.createSkill(req, res);

      expect(skillModel.createSkill).toHaveBeenCalledWith(
        "JavaScript",
        "What is a closure?",
        "Explain hoisting",
        "What is the event loop?",
        "Programming language for web development",
        1
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skill created successfully.",
        data: mockSkill
      });
    });

    it("should handle duplicate skill error", async () => {
      const duplicateError = { code: '23505' };
      skillModel.createSkill.mockRejectedValue(duplicateError);

      await skillController.createSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Skill already exists. Please choose a different skill name."
      });
    });

    it("should handle general server error", async () => {
      const error = new Error("Database connection failed");
      skillModel.createSkill.mockRejectedValue(error);

      await skillController.createSkill(req, res);

      expect(console.error).toHaveBeenCalledWith("Error creating skill:", "Database connection failed");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("getAllSkills", () => {
    it("should retrieve all skills successfully", async () => {
      const mockSkills = [
        { id: 1, skill_name: "JavaScript" },
        { id: 2, skill_name: "Python" }
      ];
      skillModel.getAllSkills.mockResolvedValue(mockSkills);

      await skillController.getAllSkills(req, res);

      expect(skillModel.getAllSkills).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skills retrieved successfully.",
        data: mockSkills
      });
    });

    it("should handle empty skills array", async () => {
      skillModel.getAllSkills.mockResolvedValue([]);

      await skillController.getAllSkills(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "No skills found.",
        data: []
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Database error");
      skillModel.getAllSkills.mockRejectedValue(error);

      await skillController.getAllSkills(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving skills:", "Database error");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("updateSkill", () => {
    beforeEach(() => {
      req.params = { skill_name: "JavaScript" };
      req.body = {
        question1: "Updated question 1",
        description_skill: "Updated description"
      };
    });

    it("should update skill successfully", async () => {
      const mockUpdatedSkill = { 
        id: 1, 
        skill_name: "JavaScript", 
        question1: "Updated question 1",
        description_skill: "Updated description"
      };
      skillModel.updateSkillById.mockResolvedValue(mockUpdatedSkill);

      await skillController.updateSkill(req, res);

      expect(skillModel.updateSkillById).toHaveBeenCalledWith("JavaScript", req.body);
      expect(console.log).toHaveBeenCalledWith("Update fields:", req.body);
      expect(console.log).toHaveBeenCalledWith(mockUpdatedSkill);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skill updated successfully.",
        data: mockUpdatedSkill
      });
    });

    it("should handle skill not found", async () => {
      skillModel.updateSkillById.mockResolvedValue(null);

      await skillController.updateSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skill not found or no fields provided for update."
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Update failed");
      skillModel.updateSkillById.mockRejectedValue(error);

      await skillController.updateSkill(req, res);

      expect(console.error).toHaveBeenCalledWith("Error updating skill:", "Update failed");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("deleteSkill", () => {
    beforeEach(() => {
      req.params = { skill_name: "JavaScript" };
    });

    it("should delete skill successfully", async () => {
      const mockResult = { rowCount: 1 };
      skillModel.deleteSkillById.mockResolvedValue(mockResult);

      await skillController.deleteSkill(req, res);

      expect(skillModel.deleteSkillById).toHaveBeenCalledWith("JavaScript");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skill deleted successfully."
      });
    });

    it("should handle skill not found", async () => {
      const mockResult = { rowCount: 0 };
      skillModel.deleteSkillById.mockResolvedValue(mockResult);

      await skillController.deleteSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skill not found."
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Delete failed");
      skillModel.deleteSkillById.mockRejectedValue(error);

      await skillController.deleteSkill(req, res);

      expect(console.error).toHaveBeenCalledWith("Error deleting skill:", "Delete failed");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("getTotalSkills", () => {
    it("should get total skills successfully", async () => {
      const mockTotal = 5;
      skillModel.total.mockResolvedValue(mockTotal);

      await skillController.getTotalSkills(req, res);

      expect(skillModel.total).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of skills retrieved successfully.",
        data: mockTotal
      });
    });

    it("should handle zero total", async () => {
      skillModel.total.mockResolvedValue(0);

      await skillController.getTotalSkills(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of skills retrieved successfully.",
        data: 0
      });
    });

    it("should handle server error", async () => {
      const error = new Error("Count failed");
      skillModel.total.mockRejectedValue(error);

      await skillController.getTotalSkills(req, res);

      expect(console.error).toHaveBeenCalledWith("Error retrieving total number of skills:", "Count failed");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });
});

// Additional integration-style tests for edge cases
describe("Skill Controller Edge Cases", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("createSkill with missing fields", () => {
    it("should handle missing required fields", async () => {
      req.body = { skill_name: "JavaScript" }; // Missing other required fields
      
      const error = new Error("Missing required fields");
      skillModel.createSkill.mockRejectedValue(error);

      await skillController.createSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later."
      });
    });
  });

  describe("updateSkill with empty updates", () => {
    it("should handle empty update object", async () => {
      req.params = { skill_name: "JavaScript" };
      req.body = {}; // Empty updates
      
      skillModel.updateSkillById.mockResolvedValue(null);

      await skillController.updateSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skill not found or no fields provided for update."
      });
    });
  });

  describe("Error handling with undefined error messages", () => {
    it("should handle errors without message property", async () => {
      const error = { code: 'UNKNOWN_ERROR' }; // No message property
      skillModel.createSkill.mockRejectedValue(error);

      req.body = {
        skill_name: "JavaScript",
        question1: "Q1",
        question2: "Q2",
        question3: "Q3",
        description_skill: "Desc",
        id_admin: 1
      };

      await skillController.createSkill(req, res);

      expect(console.error).toHaveBeenCalledWith("Error creating skill:", undefined);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});