jest.mock('../../../config/db'); // Mock the database pool
const studentController = require("../../../controllers/adminControllers/studentController");
const studentModel = require("../../../models/adminModels/studentModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

jest.mock("../../../models/adminModels/studentModel");
jest.mock("bcrypt");
jest.mock("uuid");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Student Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("createStudent", () => {
    it("should create a student successfully (happy path)", async () => {
      const req = {
        body: {
          full_name: "Jane Doe",
          cin: "C123456",
          cne: "E789012",
          email: "jane.doe@example.com",
          pass: "securePass123",
          field: "Informatics",
          note: "Good student",
        },
        file: { path: "uploads/profile.jpg" },
      };
      const res = mockResponse();

      uuidv4.mockReturnValue("generated-uuid");
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed-password");
      studentModel.createStudent.mockResolvedValue({ id_user: "generated-uuid" });

      await studentController.createStudent(req, res);

      expect(uuidv4).toHaveBeenCalled();
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("securePass123", "salt");
      expect(studentModel.createStudent).toHaveBeenCalledWith(
        "generated-uuid",
        "Jane Doe",
        "C123456",
        "E789012",
        "jane.doe@example.com",
        "hashed-password",
        "Informatics",
        "Good student",
        "student",
        "uploads/profile.jpg"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student added successfully.",
        student: { id_user: "generated-uuid" },
      });
    });

    it("should return 400 if email already exists (error code 23505)", async () => {
      const req = {
        body: {
          full_name: "John Smith",
          cin: "C000001",
          cne: "E000002",
          email: "john.smith@example.com",
          pass: "anotherPass",
          field: "Cybersecurity",
          note: "Average",
        },
        file: null,
      };
      const res = mockResponse();
      const uniqueError = new Error();
      uniqueError.code = "23505";
      studentModel.createStudent.mockRejectedValue(uniqueError);

      await studentController.createStudent(req, res);

      expect(studentModel.createStudent).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "The email address already exists. Please use a different email.",
      });
    });

    it("should return 500 if bcrypt.hash throws (missing required fields or other error)", async () => {
      const req = {
        body: {
          // missing pass field
          full_name: "No Password",
          cin: "C111111",
          cne: "E222222",
          email: "nopass@example.com",
          field: "Industrial",
          note: "N/A",
        },
        file: null,
      };
      const res = mockResponse();

      bcrypt.genSalt.mockResolvedValue("salt");
      // Simulate hash throwing because pass is undefined
      bcrypt.hash.mockRejectedValue(new Error("Hash error"));

      await studentController.createStudent(req, res);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(undefined, "salt");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });

    it("should return 500 if studentModel.createStudent throws unexpected error", async () => {
      const req = {
        body: {
          full_name: "Error Student",
          cin: "C222222",
          cne: "E333333",
          email: "error@student.com",
          pass: "pass123",
          field: "Telecommunications",
          note: "Edge case",
        },
        file: null,
      };
      const res = mockResponse();
      uuidv4.mockReturnValue("some-uuid");
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed-pass");
      studentModel.createStudent.mockRejectedValue(new Error("DB down"));

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("getAllStudents", () => {
    it("should return list of students with image URLs (happy path)", async () => {
      const req = {};
      const res = mockResponse();
      const mockStudents = [
        {
          id_user: "1",
          full_name: "Alice",
          profile_picture: "photos/alice.jpg",
        },
        {
          id_user: "2",
          full_name: "Bob",
          profile_picture: null,
        },
      ];
      studentModel.getAllStudents.mockResolvedValue(mockStudents);

      await studentController.getAllStudents(req, res);

      expect(studentModel.getAllStudents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Students retrieved successfully.",
        data: [
          {
            id_user: "1",
            full_name: "Alice",
            profile_picture: "photos/alice.jpg",
            profile_picture_url: "http://localhost:3000/photos/alice.jpg",
          },
          {
            id_user: "2",
            full_name: "Bob",
            profile_picture: null,
            profile_picture_url: null,
          },
        ],
      });
    });

    it("should return empty array if no students found", async () => {
      const req = {};
      const res = mockResponse();
      studentModel.getAllStudents.mockResolvedValue([]);

      await studentController.getAllStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "No students found.",
        data: [],
      });
    });

    it("should return 500 if studentModel.getAllStudents throws", async () => {
      const req = {};
      const res = mockResponse();
      studentModel.getAllStudents.mockRejectedValue(new Error("DB error"));

      await studentController.getAllStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error. Please try again later.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("getStudentByCin", () => {
    it("should return student when found (happy path)", async () => {
      const req = { query: { cin: "C123456" } };
      const res = mockResponse();
      const mockStudent = {
        id_user: "3",
        full_name: "Charles",
        profile_picture: "avatars/charles.png",
      };
      studentModel.getStudentByCin.mockResolvedValue(mockStudent);

      await studentController.getStudentByCin(req, res);

      expect(studentModel.getStudentByCin).toHaveBeenCalledWith("C123456");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student retrieved successfully.",
        data: {
          id_user: "3",
          full_name: "Charles",
          profile_picture: "avatars/charles.png",
          profile_picture_url: "http://localhost:3000/avatars/charles.png",
        },
      });
    });

    it("should return 404 if student not found", async () => {
      const req = { query: { cin: "UNKNOWN" } };
      const res = mockResponse();
      studentModel.getStudentByCin.mockResolvedValue(null);

      await studentController.getStudentByCin(req, res);

      expect(studentModel.getStudentByCin).toHaveBeenCalledWith("UNKNOWN");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student not found.",
        data: null,
      });
    });

    it("should return 404 if CIN is missing or empty", async () => {
      const req = { query: { cin: "" } };
      const res = mockResponse();
      studentModel.getStudentByCin.mockResolvedValue(null);

      await studentController.getStudentByCin(req, res);

      expect(studentModel.getStudentByCin).toHaveBeenCalledWith("");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student not found.",
        data: null,
      });
    });

    it("should return 500 if studentModel.getStudentByCin throws", async () => {
      const req = { query: { cin: "CERROR" } };
      const res = mockResponse();
      studentModel.getStudentByCin.mockRejectedValue(new Error("DB failure"));

      await studentController.getStudentByCin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error. Please try again later.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("updateStudent", () => {
    it("should update a student with new body fields and file (happy path)", async () => {
      const req = {
        params: { id_student: "abc-123" },
        body: { full_name: "Updated Name", note: "Excellent" },
        file: { path: "photos/new.jpg" },
      };
      const res = mockResponse();
      const updatedMock = { id_student: "abc-123", full_name: "Updated Name", note: "Excellent", profile_picture: "photos/new.jpg" };
      studentModel.updateStudentById.mockResolvedValue(updatedMock);

      await studentController.updateStudent(req, res);

      expect(studentModel.updateStudentById).toHaveBeenCalledWith("abc-123", {
        full_name: "Updated Name",
        note: "Excellent",
        profile_picture: "photos/new.jpg",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur mis à jour avec succès.",
        data: updatedMock,
      });
    });

    it("should update a student with only body fields (no file)", async () => {
      const req = {
        params: { id_student: "xyz-789" },
        body: { field: "Eco-Energy" },
        file: null,
      };
      const res = mockResponse();
      const updatedMock = { id_student: "xyz-789", field: "Eco-Energy" };
      studentModel.updateStudentById.mockResolvedValue(updatedMock);

      await studentController.updateStudent(req, res);

      expect(studentModel.updateStudentById).toHaveBeenCalledWith("xyz-789", {
        field: "Eco-Energy",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur mis à jour avec succès.",
        data: updatedMock,
      });
    });

    it("should return 404 if no fields provided (body empty, no file) and updateStudentById returns null", async () => {
      const req = {
        params: { id_student: "no-fields" },
        body: {},
        file: null,
      };
      const res = mockResponse();
      studentModel.updateStudentById.mockResolvedValue(null);

      await studentController.updateStudent(req, res);

      expect(studentModel.updateStudentById).toHaveBeenCalledWith("no-fields", {});
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur introuvable ou aucun champ fourni.",
      });
    });

    it("should return 500 if updateStudentById throws", async () => {
      const req = {
        params: { id_student: "err-456" },
        body: { full_name: "Error Update" },
        file: null,
      };
      const res = mockResponse();
      studentModel.updateStudentById.mockRejectedValue(new Error("DB crash"));

      await studentController.updateStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur." });
    });

    it("should return 500 if ID is missing (id_student undefined)", async () => {
      const req = {
        params: {}, // no id_student key
        body: { full_name: "No ID" },
        file: null,
      };
      const res = mockResponse();
      studentModel.updateStudentById.mockResolvedValue(null);

      await studentController.updateStudent(req, res);

      // Since studentModel.updateStudentById is called with undefined, the controller catches the null and returns 404.
      expect(studentModel.updateStudentById).toHaveBeenCalledWith(undefined, { full_name: "No ID" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur introuvable ou aucun champ fourni.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("deleteStudent", () => {
    it("should delete a student successfully (happy path)", async () => {
      const req = { params: { id_member: "del-123" } };
      const res = mockResponse();
      studentModel.deleteStudentById.mockResolvedValue({ rowCount: 1 });

      await studentController.deleteStudent(req, res);

      expect(studentModel.deleteStudentById).toHaveBeenCalledWith("del-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student deleted successfully.",
      });
    });

    it("should return 404 if student not found (rowCount = 0)", async () => {
      const req = { params: { id_member: "nonexistent" } };
      const res = mockResponse();
      studentModel.deleteStudentById.mockResolvedValue({ rowCount: 0 });

      await studentController.deleteStudent(req, res);

      expect(studentModel.deleteStudentById).toHaveBeenCalledWith("nonexistent");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student not found.",
      });
    });

    it("should return 404 if id_member is missing or empty", async () => {
      const req = { params: { id_member: "" } };
      const res = mockResponse();
      studentModel.deleteStudentById.mockResolvedValue({ rowCount: 0 });

      await studentController.deleteStudent(req, res);

      expect(studentModel.deleteStudentById).toHaveBeenCalledWith("");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Student not found.",
      });
    });

    it("should return 500 if deleteStudentById throws", async () => {
      const req = { params: { id_member: "err-789" } };
      const res = mockResponse();
      studentModel.deleteStudentById.mockRejectedValue(new Error("DB fail"));

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("getTotalStudents", () => {
    it("should return total number of students (happy path)", async () => {
      const req = {};
      const res = mockResponse();
      studentModel.total.mockResolvedValue(42);

      await studentController.getTotalStudents(req, res);

      expect(studentModel.total).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Total number of students retrieved successfully.",
        data: 42,
      });
    });

    it("should return 500 if total throws", async () => {
      const req = {};
      const res = mockResponse();
      studentModel.total.mockRejectedValue(new Error("Count fail"));

      await studentController.getTotalStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("getStudentsByClass", () => {
    it("should return students by class with image URLs (happy path)", async () => {
      const req = { body: { classe: "A1" } };
      const res = mockResponse();
      const mockStudents = [
        { id_user: "5", full_name: "Eve", profile_picture: "img/eve.jpg" },
      ];
      studentModel.getStudentsByClass.mockResolvedValue(mockStudents);

      await studentController.getStudentsByClass(req, res);

      expect(studentModel.getStudentsByClass).toHaveBeenCalledWith("A1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Students retrieved successfully by class.",
        data: [
          {
            id_user: "5",
            full_name: "Eve",
            profile_picture: "img/eve.jpg",
            profile_picture_url: "http://localhost:3000/img/eve.jpg",
          },
        ],
      });
    });

    it("should return empty array if no class provided or no students found", async () => {
      const req = { body: { classe: "" } };
      const res = mockResponse();
      studentModel.getStudentsByClass.mockResolvedValue([]);

      await studentController.getStudentsByClass(req, res);

      expect(studentModel.getStudentsByClass).toHaveBeenCalledWith("");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Students retrieved successfully by class.",
        data: [],
      });
    });

    it("should return 500 if getStudentsByClass throws", async () => {
      const req = { body: { classe: "B2" } };
      const res = mockResponse();
      studentModel.getStudentsByClass.mockRejectedValue(new Error("DB glitch"));

      await studentController.getStudentsByClass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });

  //──────────────────────────────────────────────────────────────────────────────
  describe("getStudentsBySector", () => {
    it("should return students by sector with image URLs (happy path)", async () => {
      const req = { body: { sector: "Engineering" } };
      const res = mockResponse();
      const mockStudents = [
        { id_user: "6", full_name: "Frank", profile_picture: "img/frank.png" },
      ];
      studentModel.getStudentsBySector.mockResolvedValue(mockStudents);

      await studentController.getStudentsBySector(req, res);

      expect(studentModel.getStudentsBySector).toHaveBeenCalledWith("Engineering");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Students retrieved successfully by sector.",
        data: [
          {
            id_user: "6",
            full_name: "Frank",
            profile_picture: "img/frank.png",
            profile_picture_url: "http://localhost:3000/img/frank.png",
          },
        ],
      });
    });

    it("should return empty array if no sector provided or no students found", async () => {
      const req = { body: { sector: "" } };
      const res = mockResponse();
      studentModel.getStudentsBySector.mockResolvedValue([]);

      await studentController.getStudentsBySector(req, res);

      expect(studentModel.getStudentsBySector).toHaveBeenCalledWith("");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Students retrieved successfully by sector.",
        data: [],
      });
    });

    it("should return 500 if getStudentsBySector throws", async () => {
      const req = { body: { sector: "Arts" } };
      const res = mockResponse();
      studentModel.getStudentsBySector.mockRejectedValue(new Error("Sector DB fail"));

      await studentController.getStudentsBySector(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });
});
