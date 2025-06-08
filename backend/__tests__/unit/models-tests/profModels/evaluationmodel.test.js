const {
  get_sector_Model,
  get_classes_Model,
  get_all_student_Model,
  search_by_student_cne_Model,
  search_by_course_statut_Model,
  search_by_project_statut_Model,
  new_evaluation_Model,
  view_report_Model
} = require('../../../../models/profmodels/evaluation_Model_classes'); // Adjust the path to your actual module

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Evaluation Database Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get_sector_Model', () => {
    it('should return sectors for a teacher', async () => {
      const mockResult = {
        rows: [
          { sector_id: 1 },
          { sector_id: 2 },
          { sector_id: 3 }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await get_sector_Model(123);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [123]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no sectors found', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await get_sector_Model(123);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(get_sector_Model(123)).rejects.toThrow('Database connection failed');
    });
  });

  describe('get_classes_Model', () => {
    it('should return classes for a teacher and sector', async () => {
      const mockResult = {
        rows: [
          { id_class: 101 },
          { id_class: 102 }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await get_classes_Model(123, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT s.id_class'),
        [123, 1]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no classes found', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await get_classes_Model(123, 999);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(get_classes_Model(123, 1)).rejects.toThrow('Database error');
    });
  });

  describe('get_all_student_Model', () => {
    it('should return all students with evaluation status', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1001,
            cne: 'CNE001',
            profile_picture: 'pic1.jpg',
            isC: 'submitted',
            lastC: '2024-01-15'
          },
          {
            id_member: 1002,
            cne: 'CNE002',
            profile_picture: 'pic2.jpg',
            isC: 'overdue',
            lastC: '2023-12-10'
          },
          {
            id_member: 1003,
            cne: 'CNE003',
            profile_picture: 'pic3.jpg',
            isC: '',
            lastC: null
          }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await get_all_student_Model(123, 101);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('CASE'),
        [123, 101]
      );
      expect(result).toEqual(mockResult.rows);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no students found', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await get_all_student_Model(123, 101);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(get_all_student_Model(123, 101)).rejects.toThrow('Database error');
    });
  });

  describe('search_by_student_cne_Model', () => {
    it('should return student by CNE with evaluation status', async () => {
      const mockResult = {
        rows: [{
          id_member: 1001,
          cne: 'CNE001',
          isC: 'submitted',
          lastC: '2024-01-15'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_student_cne_Model(123, 'CNE001', 101);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE h.id_member = $1 AND t.cne=$2 AND t.id_class=$3'),
        [123, 'CNE001', 101]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when student not found', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_student_cne_Model(123, 'NONEXISTENT', 101);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(search_by_student_cne_Model(123, 'CNE001', 101)).rejects.toThrow('Database error');
    });
  });

  describe('search_by_course_statut_Model', () => {
    it('should return students filtered by course status', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1001,
            cne: 'CNE001',
            isC: 'submitted',
            lastC: '2024-01-15'
          },
          {
            id_member: 1002,
            cne: 'CNE002',
            isC: 'submitted',
            lastC: '2024-01-16'
          }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_course_statut_Model(123, 'submitted', 101);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE sub.isC = $2'),
        [123, 'submitted', 101]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no students match status', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_course_statut_Model(123, 'nonexistent', 101);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(search_by_course_statut_Model(123, 'submitted', 101)).rejects.toThrow('Database error');
    });
  });

  describe('search_by_project_statut_Model', () => {
    it('should return students filtered by project status', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1001,
            cne: 'CNE001',
            isC: 'submitted',
            lastC: '2024-01-15',
            isP: 'submitted',
            lastP: '2024-01-16'
          }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_project_statut_Model(123, 'submitted');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE sub.isP = $2'),
        [123, 'submitted']
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no students match project status', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_project_statut_Model(123, 'overdue');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(search_by_project_statut_Model(123, 'submitted')).rejects.toThrow('Database error');
    });
  });

  describe('new_evaluation_Model', () => {
    it('should create new evaluation successfully', async () => {
      const mockClassResult = { rows: { id_class: 101 } };
      const mockExistingEvalResult = { rows: [] }; // No existing evaluation
      const mockInsertResult = { rows: [{ id_evaluation: 201 }] };
      const mockSkillInsertResult = { rows: [{ id: 1, skill_name: 'Communication', note_skill: 18 }] };

      pool.query
        .mockResolvedValueOnce(mockClassResult) // Get class ID
        .mockResolvedValueOnce(mockExistingEvalResult) // Check existing evaluation
        .mockResolvedValueOnce(mockInsertResult) // Insert main evaluation
        .mockResolvedValue(mockSkillInsertResult); // Insert skills (6 times)

      const result = await new_evaluation_Model(
        'Communication', 18,
        'Teamwork', 16,
        'Problem Solving', 17,
        'Leadership', 15,
        'Technical Skills', 19,
        'Creativity', 14,
        'Great student performance',
        123, // id_prof
        1001 // id_student
      );

      expect(pool.query).toHaveBeenCalledTimes(9); // 1 + 1 + 1 + 6 skill inserts
      expect(result).toEqual(mockSkillInsertResult.rows);
    });

    it('should return null when evaluation already exists for current month', async () => {
      const mockClassResult = { rows: { id_class: 101 } };
      const mockExistingEvalResult = { rows: [{ id_evaluation: 200 }] }; // Existing evaluation

      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockExistingEvalResult);

      const result = await new_evaluation_Model(
        'Communication', 18,
        'Teamwork', 16,
        'Problem Solving', 17,
        'Leadership', 15,
        'Technical Skills', 19,
        'Creativity', 14,
        'Already evaluated',
        123,
        1001
      );

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledTimes(2); // Only class lookup and existing check
    });

    it('should calculate total note correctly', async () => {
      const mockClassResult = { rows: { id_class: 101 } };
      const mockExistingEvalResult = { rows: [] };
      const mockInsertResult = { rows: [{ id_evaluation: 201 }] };
      const mockSkillInsertResult = { rows: [{ id: 1 }] };

      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockExistingEvalResult)
        .mockResolvedValueOnce(mockInsertResult)
        .mockResolvedValue(mockSkillInsertResult);

      await new_evaluation_Model(
        'Skill1', 10,
        'Skill2', 12,
        'Skill3', 14,
        'Skill4', 16,
        'Skill5', 18,
        'Skill6', 20,
        'Comment',
        123,
        1001
      );

      // Check that the total note calculation is correct: (10+12+14+16+18+20)/6 = 15
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO skill_evaluation'),
        expect.arrayContaining([
          'Comment',
          123,
          1001,
          101,
          15 // Expected total note
        ])
      );
    });

    it('should handle database errors during evaluation creation', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(new_evaluation_Model(
        'Skill1', 10, 'Skill2', 12, 'Skill3', 14,
        'Skill4', 16, 'Skill5', 18, 'Skill6', 20,
        'Comment', 123, 1001
      )).rejects.toThrow('Database error');
    });
  });

  describe('view_report_Model', () => {
    it('should return evaluation report when evaluation exists', async () => {
      const mockExistingEvalResult = { rows: [{ id_evaluation: 201 }] };
      const mockReportResult = {
        rows: [
          { id: 1, skill_name: 'Communication', note_skill: 18 },
          { id: 2, skill_name: 'Teamwork', note_skill: 16 },
          { id: 3, skill_name: 'Problem Solving', note_skill: 17 }
        ]
      };

      pool.query
        .mockResolvedValueOnce(mockExistingEvalResult)
        .mockResolvedValueOnce(mockReportResult);

      const result = await view_report_Model(123, 1001);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT id_evaluation FROM skill_evaluation'),
        [123, 1001]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'select * from evaluations where id_evaluation=$1',
        [201]
      );
      expect(result).toEqual(mockReportResult.rows);
    });

    it('should return null when no evaluation exists for current month', async () => {
      const mockExistingEvalResult = { rows: [] };

      pool.query.mockResolvedValueOnce(mockExistingEvalResult);

      const result = await view_report_Model(123, 1001);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(view_report_Model(123, 1001)).rejects.toThrow('Database error');
    });
  });
});

// Additional Edge Case Tests
describe('Edge Cases and Error Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parameter Validation', () => {
    it('should handle null/undefined parameters gracefully', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      // Test with null parameters
      const result1 = await get_sector_Model(null);
      expect(result1).toEqual([]);

      const result2 = await get_classes_Model(undefined, 1);
      expect(result2).toEqual([]);
    });

    it('should handle empty string parameters', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_student_cne_Model(123, '', 101);
      expect(result).toEqual([]);
    });
  });

  describe('Complex Query Edge Cases', () => {
    it('should handle students with mixed evaluation statuses', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1001,
            cne: 'CNE001',
            isC: 'submitted',
            lastC: '2024-01-15',
            isP: '', // No project evaluation
            lastP: null
          }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await search_by_project_statut_Model(123, '');
      
      expect(result).toEqual(mockResult.rows);
    });

    it('should handle evaluation with extreme note values', async () => {
      const mockClassResult = { rows: { id_class: 101 } };
      const mockExistingEvalResult = { rows: [] };
      const mockInsertResult = { rows: [{ id_evaluation: 201 }] };
      const mockSkillInsertResult = { rows: [{ id: 1 }] };

      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockExistingEvalResult)
        .mockResolvedValueOnce(mockInsertResult)
        .mockResolvedValue(mockSkillInsertResult);

      await new_evaluation_Model(
        'Skill1', 0,   // Minimum note
        'Skill2', 20,  // Maximum note
        'Skill3', 10,
        'Skill4', 10,
        'Skill5', 10,
        'Skill6', 10,
        'Extreme values test',
        123,
        1001
      );

      // Check calculation: (0+20+10+10+10+10)/6 = 10
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO skill_evaluation'),
        expect.arrayContaining([10])
      );
    });
  });

  describe('Database Transaction Scenarios', () => {
    it('should handle partial failure in new_evaluation_Model', async () => {
      const mockClassResult = { rows: { id_class: 101 } };
      const mockExistingEvalResult = { rows: [] };
      const mockInsertResult = { rows: [{ id_evaluation: 201 }] };
      
      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockExistingEvalResult)
        .mockResolvedValueOnce(mockInsertResult)
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // First skill insert succeeds
        .mockRejectedValue(new Error('Skill insert failed')); // Second skill insert fails

      await expect(new_evaluation_Model(
        'Skill1', 10, 'Skill2', 12, 'Skill3', 14,
        'Skill4', 16, 'Skill5', 18, 'Skill6', 20,
        'Comment', 123, 1001
      )).rejects.toThrow('Skill insert failed');
    });
  });

  describe('Data Type Handling', () => {
    it('should handle floating point note calculations', async () => {
      const mockClassResult = { rows: { id_class: 101 } };
      const mockExistingEvalResult = { rows: [] };
      const mockInsertResult = { rows: [{ id_evaluation: 201 }] };
      const mockSkillInsertResult = { rows: [{ id: 1 }] };

      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockExistingEvalResult)
        .mockResolvedValueOnce(mockInsertResult)
        .mockResolvedValue(mockSkillInsertResult);

      await new_evaluation_Model(
        'Skill1', 15.5,
        'Skill2', 16.7,
        'Skill3', 14.3,
        'Skill4', 17.8,
        'Skill5', 13.2,
        'Skill6', 18.9,
        'Decimal test',
        123,
        1001
      );

      // Check precise calculation: (15.5+16.7+14.3+17.8+13.2+18.9)/6 = 16.07
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO skill_evaluation'),
        expect.arrayContaining([16.07])
      );
    });
  });
});