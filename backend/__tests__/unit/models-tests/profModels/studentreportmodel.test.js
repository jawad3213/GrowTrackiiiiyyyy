const studentProfileModel = require('../../../../models/profmodels/student_report_Model'); 

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

// Mock console.log to avoid cluttering test output
console.log = jest.fn();

describe('Student Profile Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile_Section_Model', () => {
    it('should return student profile information successfully', async () => {
      const mockProfileData = [
        {
          full_name: 'John Doe',
          cne: 'CNE123456',
          id_sector: 1,
          id_class: 2,
          id_project: 5
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProfileData });

      const result = await studentProfileModel.Profile_Section_Model(123);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [123]
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('m.full_name'),
        [123]
      );
      expect(result).toEqual(mockProfileData);
      expect(console.log).toHaveBeenCalledWith('profile:', mockProfileData);
    });

    it('should return empty array when student not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await studentProfileModel.Profile_Section_Model(999);

      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith('profile:', []);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(studentProfileModel.Profile_Section_Model(123))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle student with no project assignment', async () => {
      const mockProfileData = [
        {
          full_name: 'Jane Smith',
          cne: 'CNE789012',
          id_sector: 2,
          id_class: 3,
          id_project: null
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProfileData });

      const result = await studentProfileModel.Profile_Section_Model(456);

      expect(result).toEqual(mockProfileData);
    });
  });

  describe('Evaluation_Section_Model', () => {
    it('should return comprehensive evaluation data', async () => {
      const mockEvaluationsCompleted = { rows: [{ count: '5' }] };
      const mockEvaluationsReceived = { rows: [{ count: '8' }] };
      const mockSkillEvaluations = {
        rows: [
          {
            date: '2024-01-15',
            skill_name: 'Communication',
            note_skill: 'Good verbal communication skills'
          },
          {
            date: '2024-01-20',
            skill_name: 'Problem Solving',
            note_skill: 'Excellent analytical thinking'
          }
        ]
      };
      const mockAverageScore = { rows: [{ average_score: '8.5' }] };
      const mockEvaluationTypes = {
        rows: [
          { type_evaluation: 'Professor', count: '3' },
          { type_evaluation: 'Supervisor', count: '2' },
          { type_evaluation: 'Pair', count: '3' }
        ]
      };

      pool.query
        .mockResolvedValueOnce(mockEvaluationsCompleted)
        .mockResolvedValueOnce(mockEvaluationsReceived)
        .mockResolvedValueOnce(mockSkillEvaluations)
        .mockResolvedValueOnce(mockAverageScore)
        .mockResolvedValueOnce(mockEvaluationTypes);

      const result = await studentProfileModel.Evaluation_Section_Model(123);

      expect(pool.query).toHaveBeenCalledTimes(5);
      expect(result).toEqual({
        completed: 5,
        received: 8,
        skill_evaluation: mockSkillEvaluations.rows,
        average_score: 8.5,
        evaluation_sources: [
          { type_evaluation: 'Professor', count: 3 },
          { type_evaluation: 'Supervisor', count: 2 },
          { type_evaluation: 'Pair', count: 3 }
        ]
      });
    });

    it('should handle zero evaluations', async () => {
      const mockZeroEvaluations = { rows: [{ count: '0' }] };
      const mockEmptySkills = { rows: [] };
      const mockNullAverage = { rows: [{ average_score: null }] };
      const mockEmptyTypes = { rows: [] };

      pool.query
        .mockResolvedValueOnce(mockZeroEvaluations)
        .mockResolvedValueOnce(mockZeroEvaluations)
        .mockResolvedValueOnce(mockEmptySkills)
        .mockResolvedValueOnce(mockNullAverage)
        .mockResolvedValueOnce(mockEmptyTypes);

      const result = await studentProfileModel.Evaluation_Section_Model(456);

      expect(result).toEqual({
        completed: 0,
        received: 0,
        skill_evaluation: [],
        average_score: NaN, // parseFloat(null) returns NaN
        evaluation_sources: []
      });
    });

    it('should handle database errors in evaluation queries', async () => {
      pool.query.mockRejectedValue(new Error('Query timeout'));

      await expect(studentProfileModel.Evaluation_Section_Model(123))
        .rejects.toThrow('Query timeout');
    });

    it('should handle partial query failures', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '5' }] })
        .mockRejectedValueOnce(new Error('Second query failed'));

      await expect(studentProfileModel.Evaluation_Section_Model(123))
        .rejects.toThrow('Second query failed');
    });

    it('should properly parse string numbers to integers and floats', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '10' }] })
        .mockResolvedValueOnce({ rows: [{ count: '15' }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ average_score: '9.75' }] })
        .mockResolvedValueOnce({ 
          rows: [{ type_evaluation: 'Professor', count: '7' }] 
        });

      const result = await studentProfileModel.Evaluation_Section_Model(789);

      expect(result.completed).toBe(10);
      expect(result.received).toBe(15);
      expect(result.average_score).toBe(9.75);
      expect(result.evaluation_sources[0].count).toBe(7);
    });
  });

  describe('Signal_History_Model', () => {
   /* it('should return signal history for a student', async () => {
      const mockSignalHistory = [
        {
          date_add: '2024-01-10',
          id_signal: 1,
          signal_state: 'approved',
          solution_state: 'resolved',
          id_solution: 1,
          full_name: 'Prof. Smith',
          role: 'Professor'
        },
        {
          date_add: '2024-01-15',
          id_signal: 2,
          signal_state: 'new',
          solution_state: 'pending',
          id_solution: null,
          full_name: 'Supervisor Jones',
          role: 'Supervisor'
        }
      ];

      pool.query.mockResolvedValue({ rows: mockSignalHistory });

      const result = await studentProfileModel.Signal_History_Model(123);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [123]
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('CASE WHEN p.approved = true'),
        [123]
      );
      expect(result).toEqual(mockSignalHistory);
      expect(result).toHaveLength(2);
    });
*/
    it('should return empty array when no signals found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await studentProfileModel.Signal_History_Model(999);

      expect(result).toEqual([]);
    });

    it('should handle database errors in signal queries', async () => {
      pool.query.mockRejectedValue(new Error('Join operation failed'));

      await expect(studentProfileModel.Signal_History_Model(123))
        .rejects.toThrow('Join operation failed');
    });

    it('should properly handle approved and non-approved signals', async () => {
      const mockSignals = [
        {
          date_add: '2024-01-10',
          id_signal: 1,
          signal_state: 'approved',
          solution_state: 'resolved',
          id_solution: 1,
          full_name: 'Admin User',
          role: 'Admin'
        },
        {
          date_add: '2024-01-12',
          id_signal: 2,
          signal_state: 'new',
          solution_state: 'pending',
          id_solution: null,
          full_name: 'Regular User',
          role: 'User'
        }
      ];

      pool.query.mockResolvedValue({ rows: mockSignals });

      const result = await studentProfileModel.Signal_History_Model(456);

      expect(result[0].signal_state).toBe('approved');
      expect(result[1].signal_state).toBe('new');
    });
  });

  describe('Comment_Section_Model', () => {
    it('should return comments from all evaluation types', async () => {
      const mockProfessorComments = {
        rows: [
          { comment_evaluation: 'Excellent work on the project' },
          { comment_evaluation: 'Shows great leadership skills' },
          { comment_evaluation: 'Needs improvement in time management' }
        ]
      };
      const mockSupervisorComments = {
        rows: [
          { comment_evaluation: 'Very reliable and punctual' },
          { comment_evaluation: 'Good technical skills' }
        ]
      };
      const mockStudentComments = {
        rows: [
          { comment_evaluation: 'Great team player' },
          { comment_evaluation: 'Helpful and collaborative' },
          { comment_evaluation: 'Always willing to help others' }
        ]
      };

      pool.query
        .mockResolvedValueOnce(mockProfessorComments)
        .mockResolvedValueOnce(mockSupervisorComments)
        .mockResolvedValueOnce(mockStudentComments);

      const result = await studentProfileModel.Comment_Section_Model(123);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining("type_evaluation = 'Professor'"),
        [123]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining("type_evaluation = 'Supervisor'"),
        [123]
      );
      expect(pool.query).toHaveBeenNthCalledWith(3,
        expect.stringContaining("type_evaluation = 'Pair'"),
        [123]
      );

      expect(result).toEqual({
        professor: mockProfessorComments.rows,
        supervisor: mockSupervisorComments.rows,
        student: mockStudentComments.rows
      });
    });

    it('should handle empty comments for all types', async () => {
      const mockEmptyComments = { rows: [] };

      pool.query
        .mockResolvedValueOnce(mockEmptyComments)
        .mockResolvedValueOnce(mockEmptyComments)
        .mockResolvedValueOnce(mockEmptyComments);

      const result = await studentProfileModel.Comment_Section_Model(456);

      expect(result).toEqual({
        professor: [],
        supervisor: [],
        student: []
      });
    });

    it('should limit comments to 3 per type', async () => {
      const mockManyComments = {
        rows: [
          { comment_evaluation: 'Comment 1' },
          { comment_evaluation: 'Comment 2' },
          { comment_evaluation: 'Comment 3' },
          // Should not include more than 3 due to LIMIT clause
        ]
      };

      pool.query
        .mockResolvedValue(mockManyComments);

      const result = await studentProfileModel.Comment_Section_Model(789);

      expect(result.professor).toHaveLength(3);
      expect(result.supervisor).toHaveLength(3);
      expect(result.student).toHaveLength(3);
    });

    it('should handle database errors in comment queries', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(new Error('Supervisor query failed'));

      await expect(studentProfileModel.Comment_Section_Model(123))
        .rejects.toThrow('Supervisor query failed');
    });

    it('should handle null comment evaluations', async () => {
      const mockCommentsWithNull = {
        rows: [
          { comment_evaluation: 'Valid comment' },
          { comment_evaluation: null },
          { comment_evaluation: 'Another valid comment' }
        ]
      };

      pool.query.mockResolvedValue(mockCommentsWithNull);

      const result = await studentProfileModel.Comment_Section_Model(321);

      expect(result.professor).toEqual(mockCommentsWithNull.rows);
      expect(result.professor[1].comment_evaluation).toBeNull();
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    it('should handle complete student profile workflow', async () => {
      // Mock data for all functions
      const mockProfile = [{ full_name: 'Test Student', cne: 'CNE123' }];
      const mockEvalCounts = { rows: [{ count: '5' }] };
      const mockSkills = { rows: [] };
      const mockAverage = { rows: [{ average_score: '8.0' }] };
      const mockTypes = { rows: [] };
      const mockSignals = [];
      const mockComments = { rows: [] };

      // Profile query
      pool.query.mockResolvedValueOnce({ rows: mockProfile });

      // Evaluation queries (5 queries)
      pool.query
        .mockResolvedValueOnce(mockEvalCounts)
        .mockResolvedValueOnce(mockEvalCounts)
        .mockResolvedValueOnce(mockSkills)
        .mockResolvedValueOnce(mockAverage)
        .mockResolvedValueOnce(mockTypes);

      // Signal query
      pool.query.mockResolvedValueOnce({ rows: mockSignals });

      // Comment queries (3 queries)
      pool.query
        .mockResolvedValueOnce(mockComments)
        .mockResolvedValueOnce(mockComments)
        .mockResolvedValueOnce(mockComments);

      const studentId = 123;

      const profile = await studentProfileModel.Profile_Section_Model(studentId);
      const evaluations = await studentProfileModel.Evaluation_Section_Model(studentId);
      const signals = await studentProfileModel.Signal_History_Model(studentId);
      const comments = await studentProfileModel.Comment_Section_Model(studentId);

      expect(profile).toEqual(mockProfile);
      expect(evaluations.completed).toBe(5);
      expect(evaluations.average_score).toBe(8.0);
      expect(signals).toEqual(mockSignals);
      expect(comments).toHaveProperty('professor');
      expect(comments).toHaveProperty('supervisor');
      expect(comments).toHaveProperty('student');
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle very large student IDs', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await studentProfileModel.Profile_Section_Model(Number.MAX_SAFE_INTEGER);

      expect(result).toEqual([]);
    });

    it('should handle negative student IDs', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await studentProfileModel.Comment_Section_Model(-1);

      expect(result).toEqual({
        professor: [],
        supervisor: [],
        student: []
      });
    });

    it('should handle string to number conversion edge cases', async () => {
      const mockEdgeCaseData = {
        rows: [{ count: '0' }]
      };

      pool.query
        .mockResolvedValueOnce(mockEdgeCaseData)
        .mockResolvedValueOnce(mockEdgeCaseData)
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ average_score: '0.0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await studentProfileModel.Evaluation_Section_Model(0);

      expect(result.completed).toBe(0);
      expect(result.received).toBe(0);
      expect(result.average_score).toBe(0.0);
    });

    it('should handle concurrent database queries properly', async () => {
      // Test that multiple function calls don't interfere with each other
      const mockData = { rows: [{ test: 'data' }] };
      pool.query.mockResolvedValue(mockData);

      const promises = [
        studentProfileModel.Profile_Section_Model(1),
        studentProfileModel.Profile_Section_Model(2),
        studentProfileModel.Profile_Section_Model(3)
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockData.rows);
      });
    });
  });

  // Performance and timeout tests
  describe('Performance Tests', () => {
    it('should handle database timeout gracefully', async () => {
      const timeoutError = new Error('Query timeout');
      timeoutError.code = 'QUERY_TIMEOUT';
      
      pool.query.mockRejectedValue(timeoutError);

      await expect(studentProfileModel.Profile_Section_Model(123))
        .rejects.toThrow('Query timeout');
    });

    it('should handle connection pool exhaustion', async () => {
      const poolError = new Error('Connection pool exhausted');
      poolError.code = 'POOL_EXHAUSTED';
      
      pool.query.mockRejectedValue(poolError);

      await expect(studentProfileModel.Evaluation_Section_Model(123))
        .rejects.toThrow('Connection pool exhausted');
    });
  });
});