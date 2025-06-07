const analyticsModel = require('../../../../models/studentModels/dashModel'); 

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Analytics Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNombreProjets', () => {
    it('should return project count for student', async () => {
      const mockResult = { rows: [{ count: '3' }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getNombreProjets('student123');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(t.id_project )'),
        ['student123']
      );
      expect(result).toEqual({ count: '3' });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getNombreProjets('student123')).rejects.toThrow('Database error');
    });

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getNombreProjets('student123')).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('erreur dans getNombreProjets', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('getNumberOfSignal', () => {
    it('should return signal count for student in last month', async () => {
      const mockResult = { rows: [{ total: '2' }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getNumberOfSignal('student123');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(r.id_signal) AS total'),
        ['student123']
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INTERVAL '1 MONTH'"),
        ['student123']
      );
      expect(result).toEqual({ total: '2' });
    });

    it('should handle database errors', async () => {
      const error = new Error('Signal query failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getNumberOfSignal('student123')).rejects.toThrow('Signal query failed');
    });
  });

  describe('getMoyenneDansLaClasse', () => {
    it('should return class average for student', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockAverageResult = { rows: [{ moyenne: '15.5' }] };
      
      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockAverageResult);

      const result = await analyticsModel.getMoyenneDansLaClasse('student123');

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT id_class FROM public.student'),
        ['student123']
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('AVG(note_evaluation) AS moyenne'),
        ['class123']
      );
      expect(result).toEqual({ moyenne: '15.5' });
    });

    it('should handle database errors', async () => {
      const error = new Error('Class average error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getMoyenneDansLaClasse('student123')).rejects.toThrow('Class average error');
    });
  });

  describe('getEvaluationSubmitted', () => {
    it('should calculate total evaluations submitted', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockStudentCountResult = { rows: [{ count: '10' }] };
      const mockProjectCountResult = { rows: [{ count: '2' }] };
      
      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockStudentCountResult)
        .mockResolvedValueOnce(mockProjectCountResult);

      const result = await analyticsModel.getEvaluationSubmitted('student123');

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ total: 20 }); // 10 + (5 * 2)
    });

    it('should handle zero counts', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockStudentCountResult = { rows: [{ count: '0' }] };
      const mockProjectCountResult = { rows: [{ count: '0' }] };
      
      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockStudentCountResult)
        .mockResolvedValueOnce(mockProjectCountResult);

      const result = await analyticsModel.getEvaluationSubmitted('student123');

      expect(result).toEqual({ total: 0 });
    });

    it('should handle null counts', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockStudentCountResult = { rows: [{ count: null }] };
      const mockProjectCountResult = { rows: [{ count: null }] };
      
      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockStudentCountResult)
        .mockResolvedValueOnce(mockProjectCountResult);

      const result = await analyticsModel.getEvaluationSubmitted('student123');

      expect(result).toEqual({ total: 0 });
    });

    it('should handle database errors', async () => {
      const error = new Error('Evaluation submitted error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getEvaluationSubmitted('student123')).rejects.toThrow('Evaluation submitted error');
    });
  });

  describe('getEvaluationAssigned', () => {
    it('should return assigned evaluations count', async () => {
      const mockResult = { rows: [{ count: '5' }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getEvaluationAssigned('evaluator123');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT (id_evaluator )'),
        ['evaluator123']
      );
      expect(result).toEqual({ total: 5 });
    });

    it('should handle null count', async () => {
      const mockResult = { rows: [{ count: null }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getEvaluationAssigned('evaluator123');

      expect(result).toEqual({ total: 0 });
    });

    it('should handle database errors', async () => {
      const error = new Error('Evaluation assigned error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getEvaluationAssigned('evaluator123')).rejects.toThrow('Evaluation assigned error');
    });
  });

  describe('getRadarByClass', () => {
    it('should return radar data by class', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockSkillsResult = { 
        rows: [
          { skill_name: 'JavaScript' },
          { skill_name: 'Python' },
          { skill_name: 'React' }
        ]
      };
      const mockAverageResults = [
        { rows: [{ moyenne: '15.5' }] },
        { rows: [{ moyenne: '12.0' }] },
        { rows: [{ moyenne: '18.2' }] }
      ];

      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockSkillsResult)
        .mockResolvedValueOnce(mockAverageResults[0])
        .mockResolvedValueOnce(mockAverageResults[1])
        .mockResolvedValueOnce(mockAverageResults[2]);

      const result = await analyticsModel.getRadarByClass('student123');

      expect(pool.query).toHaveBeenCalledTimes(5);
      expect(result).toEqual([
        { skill_name: 'JavaScript', moyenne: 15.5 },
        { skill_name: 'Python', moyenne: 12.0 },
        { skill_name: 'React', moyenne: 18.2 }
      ]);
    });

    it('should return empty array when no class found', async () => {
      const mockClassResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockClassResult);

      const result = await analyticsModel.getRadarByClass('student123');

      expect(result).toEqual([]);
    });

    it('should handle null averages', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockSkillsResult = { rows: [{ skill_name: 'JavaScript' }] };
      const mockAverageResult = { rows: [{ moyenne: null }] };

      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockSkillsResult)
        .mockResolvedValueOnce(mockAverageResult);

      const result = await analyticsModel.getRadarByClass('student123');

      expect(result).toEqual([{ skill_name: 'JavaScript', moyenne: 0 }]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Radar by class error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getRadarByClass('student123')).rejects.toThrow('Radar by class error');
    });
  });

  describe('getProjects', () => {
    it('should return projects for student', async () => {
      const mockResult = {
        rows: [
          { name_project: 'E-commerce App' },
          { name_project: 'Chat Application' },
          { name_project: 'Portfolio Website' }
        ]
      };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getProjects('student123');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT  p.name_project'),
        ['student123']
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should handle empty projects', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getProjects('student123');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Get projects error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getProjects('student123')).rejects.toThrow('Get projects error');
    });
  });

  describe('getRadarByProject', () => {
    it('should return radar data by project', async () => {
      const mockProjectResult = { rows: [{ id_project: 'proj123' }] };
      const mockTeamResult = { rows: [{ id_team: 'team123' }] };
      const mockSkillsResult = { 
        rows: [
          { skill_name: 'JavaScript' },
          { skill_name: 'React' }
        ]
      };
      const mockAverageResults = [
        { rows: [{ moyenne: '16.0' }] },
        { rows: [{ moyenne: '14.5' }] }
      ];

      pool.query
        .mockResolvedValueOnce(mockProjectResult)
        .mockResolvedValueOnce(mockTeamResult)
        .mockResolvedValueOnce(mockSkillsResult)
        .mockResolvedValueOnce(mockAverageResults[0])
        .mockResolvedValueOnce(mockAverageResults[1]);

      const result = await analyticsModel.getRadarByProject('student123', 'E-commerce App');

      expect(pool.query).toHaveBeenCalledTimes(5);
      expect(result).toEqual([
        { skill_name: 'JavaScript', moyenne: 16.0 },
        { skill_name: 'React', moyenne: 14.5 }
      ]);
    });

    it('should return empty array when project not found', async () => {
      const mockProjectResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockProjectResult);

      const result = await analyticsModel.getRadarByProject('student123', 'Nonexistent Project');

      expect(result).toEqual([]);
    });

    it('should return empty array when team not found', async () => {
      const mockProjectResult = { rows: [{ id_project: 'proj123' }] };
      const mockTeamResult = { rows: [] };
      
      pool.query
        .mockResolvedValueOnce(mockProjectResult)
        .mockResolvedValueOnce(mockTeamResult);

      const result = await analyticsModel.getRadarByProject('student123', 'E-commerce App');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Radar by project error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getRadarByProject('student123', 'E-commerce App')).rejects.toThrow('Radar by project error');
    });
  });

  describe('getEvaluationCountByRoleAndMonth', () => {
    it('should return evaluation count by role and month', async () => {
      const mockResult = {
        rows: [
          { month_number: 9, month: 'September ', role: 'Professor', count: '5' },
          { month_number: 9, month: 'September ', role: 'Supervisor', count: '3' },
          { month_number: 10, month: 'October  ', role: 'Professor', count: '7' },
          { month_number: 1, month: 'January  ', role: 'Pair', count: '2' }
        ]
      };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getEvaluationCountByRoleAndMonth('student123');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('EXTRACT(MONTH FROM e.date_add) AS month_number'),
        ['student123']
      );
      
      // Verify structure
      expect(result).toHaveLength(10); // 10 months
      expect(result[0].month).toBe('September');
      expect(result[0].Professor).toBe(5);
      expect(result[0].Supervisor).toBe(3);
      expect(result[0].Pair).toBe(0);
    });

    it('should handle empty results', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getEvaluationCountByRoleAndMonth('student123');

      expect(result).toHaveLength(10);
      result.forEach(month => {
        expect(month.Professor).toBe(0);
        expect(month.Supervisor).toBe(0);
        expect(month.Pair).toBe(0);
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Evaluation count error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getEvaluationCountByRoleAndMonth('student123')).rejects.toThrow('Evaluation count error');
    });
  });

  describe('getSkills', () => {
    it('should return all skills', async () => {
      const mockResult = {
        rows: [
          { skill_name: 'JavaScript' },
          { skill_name: 'Python' },
          { skill_name: 'React' },
          { skill_name: 'Node.js' }
        ]
      };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getSkills();

      expect(pool.query).toHaveBeenCalledWith('SELECT skill_name FROM public.skill');
      expect(result).toEqual(mockResult.rows);
    });

    it('should handle empty skills', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getSkills();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Get skills error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getSkills()).rejects.toThrow('Get skills error');
    });
  });

  describe('getSkillRatingByMonth', () => {
    it('should return skill rating by month', async () => {
      const mockResult = {
        rows: [
          { month_number: 9, month: 'Sep', moyenne: '15.5' },
          { month_number: 10, month: 'Oct', moyenne: '16.2' },
          { month_number: 1, month: 'Jan', moyenne: '17.0' }
        ]
      };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getSkillRatingByMonth('student123', 'JavaScript');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('AVG(ev.note_skill) AS moyenne'),
        ['student123', 'JavaScript']
      );
      
      // Check structure
      expect(result).toHaveLength(10); // 10 months
      expect(result[0].month).toBe('Sep');
      expect(result[0].moyenne).toBe(15.5);
      expect(result[1].month).toBe('Oct');
      expect(result[1].moyenne).toBe(16.2);
    });

    it('should handle months with no data', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getSkillRatingByMonth('student123', 'JavaScript');

      expect(result).toHaveLength(10);
      result.forEach(month => {
        expect(month.moyenne).toBe(0);
      });
    });

    it('should handle null averages', async () => {
      const mockResult = {
        rows: [
          { month_number: 9, month: 'Sep', moyenne: null }
        ]
      };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await analyticsModel.getSkillRatingByMonth('student123', 'JavaScript');

      expect(result[0].moyenne).toBe(0);
    });

    it('should handle database errors', async () => {
      const error = new Error('Skill rating error');
      pool.query.mockRejectedValueOnce(error);

      await expect(analyticsModel.getSkillRatingByMonth('student123', 'JavaScript')).rejects.toThrow('Skill rating error');
    });
  });

  // Integration-like tests
  describe('Error Handling and Edge Cases', () => {
    it('should handle SQL injection attempts safely', async () => {
      const maliciousInput = "'; DROP TABLE students; --";
      pool.query.mockResolvedValueOnce({ rows: [] });

      await analyticsModel.getNombreProjets(maliciousInput);

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [maliciousInput] // Should be passed as parameter
      );
    });

    it('should handle very large numbers in calculations', async () => {
      const mockClassResult = { rows: [{ id_class: 'class123' }] };
      const mockStudentCountResult = { rows: [{ count: '999999' }] };
      const mockProjectCountResult = { rows: [{ count: '999999' }] };
      
      pool.query
        .mockResolvedValueOnce(mockClassResult)
        .mockResolvedValueOnce(mockStudentCountResult)
        .mockResolvedValueOnce(mockProjectCountResult);

      const result = await analyticsModel.getEvaluationSubmitted('student123');

      expect(result.total).toBe(5999994); // 999999 + (5 * 999999)
    });

    it('should handle concurrent database calls correctly', async () => {
      const mockResults = Array(5).fill({ rows: [{ moyenne: '15.0' }] });
      pool.query.mockImplementation(() => Promise.resolve(mockResults[0]));

      // Test that multiple calls don't interfere
      const promises = [
        analyticsModel.getMoyenneDansLaClasse('student1'),
        analyticsModel.getMoyenneDansLaClasse('student2'),
        analyticsModel.getMoyenneDansLaClasse('student3')
      ];

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      expect(pool.query).toHaveBeenCalledTimes(6); // 2 calls per function
    });
  });
});