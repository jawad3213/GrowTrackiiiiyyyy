const studentReportController = require('../../../controllers/profController/student_report_Controller.js'); // Adjust path as needed

// Mock the report_Model
jest.mock('../../../models/profmodels/student_report_Model.js', () => ({
  Profile_Section_Model: jest.fn(),
  Evaluation_Section_Model: jest.fn(),
  Signal_History_Model: jest.fn(),
  Comment_Section_Model: jest.fn(),
}));

const report_Model = require('../../../models/profmodels/student_report_Model.js');

describe('Student Report Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response objects
    mockReq = {
      params: { id: 'student123' },
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Profile_Section_Controller', () => {
    it('should return profile data when student exists', async () => {
      const mockResult = [
        {
          id: 'student123',
          name: 'John Doe',
          email: 'john.doe@example.com',
          cne: 'CNE123456',
          class: 'Class A',
          sector: 'Computer Science'
        }
      ];
      report_Model.Profile_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(report_Model.Profile_Section_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should return 404 when no profile data found', async () => {
      report_Model.Profile_Section_Model.mockResolvedValue([]);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(report_Model.Profile_Section_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle null result', async () => {
      report_Model.Profile_Section_Model.mockResolvedValue(null);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle undefined result', async () => {
      report_Model.Profile_Section_Model.mockResolvedValue(undefined);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle multiple profile records', async () => {
      const mockResult = [
        { id: 'student123', name: 'John Doe', current: true },
        { id: 'student123', name: 'John Doe', current: false, historical: true }
      ];
      report_Model.Profile_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should handle database errors', async () => {
      report_Model.Profile_Section_Model.mockRejectedValue(new Error('Database connection failed'));

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });

    it('should handle missing student ID', async () => {
      mockReq.params.id = undefined;
      report_Model.Profile_Section_Model.mockRejectedValue(new Error('Student ID required'));

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Evaluatuion_Section_Controller', () => {
    it('should return evaluation data when it exists', async () => {
      const mockResult = {
        student_id: 'student123',
        overall_grade: 85.5,
        subject_grades: [
          { subject: 'Mathematics', grade: 90 },
          { subject: 'Physics', grade: 81 },
          { subject: 'Chemistry', grade: 88 }
        ],
        semester: 'Fall 2024',
        gpa: 3.7
      };
      report_Model.Evaluation_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Evaluatuion_Section_Controller(mockReq, mockRes);

      expect(report_Model.Evaluation_Section_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should return 404 when no evaluation data found', async () => {
      report_Model.Evaluation_Section_Model.mockResolvedValue(null);

      await studentReportController.Evaluatuion_Section_Controller(mockReq, mockRes);

      expect(report_Model.Evaluation_Section_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should return 404 when evaluation data is undefined', async () => {
      report_Model.Evaluation_Section_Model.mockResolvedValue(undefined);

      await studentReportController.Evaluatuion_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle empty object result', async () => {
      report_Model.Evaluation_Section_Model.mockResolvedValue({});

      await studentReportController.Evaluatuion_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: {}
      });
    });

    it('should handle zero values in evaluation', async () => {
      const mockResult = {
        student_id: 'student123',
        overall_grade: 0,
        failed_subjects: 3,
        gpa: 0.0
      };
      report_Model.Evaluation_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Evaluatuion_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should handle database errors', async () => {
      report_Model.Evaluation_Section_Model.mockRejectedValue(new Error('Evaluation query failed'));

      await studentReportController.Evaluatuion_Section_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('Signal_History_Controller', () => {
    it('should return signal history when it exists', async () => {
      const mockResult = [
        {
          id: 1,
          title: 'Attendance Issue',
          description: 'Student has been absent frequently',
          status: 'resolved',
          created_at: '2024-01-15',
          resolved_at: '2024-01-20'
        },
        {
          id: 2,
          title: 'Academic Performance',
          description: 'Improvement needed in mathematics',
          status: 'in_progress',
          created_at: '2024-02-01'
        }
      ];
      report_Model.Signal_History_Model.mockResolvedValue(mockResult);

      await studentReportController.Signal_History_Controller(mockReq, mockRes);

      expect(report_Model.Signal_History_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should return 404 when no signal history found', async () => {
      report_Model.Signal_History_Model.mockResolvedValue(null);

      await studentReportController.Signal_History_Controller(mockReq, mockRes);

      expect(report_Model.Signal_History_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle empty signal history array', async () => {
      report_Model.Signal_History_Model.mockResolvedValue([]);

      await studentReportController.Signal_History_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: []
      });
    });

    it('should handle single signal in history', async () => {
      const mockResult = [
        {
          id: 1,
          title: 'Behavioral Issue',
          status: 'pending',
          created_at: '2024-03-01'
        }
      ];
      report_Model.Signal_History_Model.mockResolvedValue(mockResult);

      await studentReportController.Signal_History_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should handle database errors', async () => {
      report_Model.Signal_History_Model.mockRejectedValue(new Error('Signal history query failed'));

      await studentReportController.Signal_History_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('Comment_Section_Controller', () => {
    it('should return comments when they exist', async () => {
      const mockResult = [
        {
          id: 1,
          comment: 'Student shows great improvement in participation',
          teacher: 'Prof. Smith',
          subject: 'Mathematics',
          date: '2024-01-15',
          type: 'positive'
        },
        {
          id: 2,
          comment: 'Needs to work on homework completion',
          teacher: 'Prof. Johnson',
          subject: 'Physics',
          date: '2024-01-20',
          type: 'constructive'
        }
      ];
      report_Model.Comment_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Comment_Section_Controller(mockReq, mockRes);

      expect(report_Model.Comment_Section_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should return 404 when no comments found', async () => {
      report_Model.Comment_Section_Model.mockResolvedValue(null);

      await studentReportController.Comment_Section_Controller(mockReq, mockRes);

      expect(report_Model.Comment_Section_Model).toHaveBeenCalledWith('student123');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "something went wrong" });
    });

    it('should handle empty comments array', async () => {
      report_Model.Comment_Section_Model.mockResolvedValue([]);

      await studentReportController.Comment_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: []
      });
    });

    it('should handle single comment', async () => {
      const mockResult = [
        {
          id: 1,
          comment: 'Excellent performance this semester',
          teacher: 'Prof. Davis',
          date: '2024-02-15'
        }
      ];
      report_Model.Comment_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Comment_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should handle very long comments', async () => {
      const longComment = 'A'.repeat(1000);
      const mockResult = [
        {
          id: 1,
          comment: longComment,
          teacher: 'Prof. Wilson'
        }
      ];
      report_Model.Comment_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Comment_Section_Controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: mockResult
      });
    });

    it('should handle database errors', async () => {
      report_Model.Comment_Section_Model.mockRejectedValue(new Error('Comments query failed'));

      await studentReportController.Comment_Section_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Error, Please try again later!" });
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle missing student ID parameter', async () => {
      mockReq.params = {};
      report_Model.Profile_Section_Model.mockRejectedValue(new Error('Missing student ID'));

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle empty string as student ID', async () => {
      mockReq.params.id = '';
      report_Model.Profile_Section_Model.mockResolvedValue([]);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(report_Model.Profile_Section_Model).toHaveBeenCalledWith('');
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should handle numeric student ID', async () => {
      mockReq.params.id = '12345';
      const mockResult = [{ id: '12345', name: 'Jane Doe' }];
      report_Model.Profile_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(report_Model.Profile_Section_Model).toHaveBeenCalledWith('12345');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle special characters in student ID', async () => {
      mockReq.params.id = 'student-123_test';
      const mockResult = [{ id: 'student-123_test', name: 'Test Student' }];
      report_Model.Profile_Section_Model.mockResolvedValue(mockResult);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(report_Model.Profile_Section_Model).toHaveBeenCalledWith('student-123_test');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle very long student ID', async () => {
      const longId = 'student' + 'x'.repeat(100);
      mockReq.params.id = longId;
      report_Model.Profile_Section_Model.mockResolvedValue([]);

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(report_Model.Profile_Section_Model).toHaveBeenCalledWith(longId);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should handle null parameters object', async () => {
      mockReq.params = null;
      report_Model.Profile_Section_Model.mockRejectedValue(new Error('Cannot read property id of null'));

      await studentReportController.Profile_Section_Controller(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});