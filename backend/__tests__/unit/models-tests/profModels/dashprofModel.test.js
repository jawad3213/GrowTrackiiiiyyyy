const {
  total,
  totalstudent,
  classes,
  getGraphSignal,
  getGraphEvaluation,
  greatestAll,
  profile,
  totalEvaluation
} = require('../../../../models/profmodels/dashModel'); // Adjust the path to your actual module

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Database Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('total', () => {
    it('should return total count of classes for a professor', async () => {
      const mockResult = {
        rows: [{ total: '5' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await total(123);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT( id_class) AS total
         FROM public.teach
         WHERE id_member = $1`,
        [123]
      );
      expect(result).toBe(5);
    });

    it('should return 0 when count is 0', async () => {
      const mockResult = {
        rows: [{ total: '0' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await total(123);

      expect(result).toBe(0);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(total(123)).rejects.toThrow('Database connection failed');
      expect(console.error).toHaveBeenCalledWith('Erreur dans total():', mockError);
    });
  });

  describe('totalstudent', () => {
    it('should return total count of students for a professor', async () => {
      const mockResult = {
        rows: [{ total: '25' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await totalstudent(123);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(s.id_member) as total
            FROM public.student s
            JOIN public.teach t ON t.id_class = s.id_class
            WHERE t.id_member = $1
            `,
        [123]
      );
      expect(result).toBe(25);
    });

    it('should return 0 when no students found', async () => {
      const mockResult = {
        rows: [{ total: '0' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await totalstudent(123);

      expect(result).toBe(0);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(totalstudent(123)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('error dans totalstudent', mockError);
    });
  });

  describe('classes', () => {
    it('should return list of classes for a professor', async () => {
      const mockResult = {
        rows: [
          { class: 1 },
          { class: 2 },
          { class: 3 }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await classes(123);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT id_class AS class FROM public.teach WHERE id_member = $1`,
        [123]
      );
      expect(result).toEqual([
        { class: 1 },
        { class: 2 },
        { class: 3 }
      ]);
    });

    it('should return empty array when no classes found', async () => {
      const mockResult = {
        rows: []
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await classes(123);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(classes(123)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('erreur dans classes : ', mockError);
    });
  });

  describe('getGraphSignal', () => {
    it('should return signal data grouped by month', async () => {
      const mockResult = {
        rows: [
          { total: '10', month: '2024-01' },
          { total: '15', month: '2024-02' },
          { total: '8', month: '2024-03' }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await getGraphSignal(1);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT 
                COUNT(r.id_signal) AS TOTAL,
                TO_CHAR(date_trunc('month', s.date_add), 'YYYY-MM') AS month
              FROM
                public.class c
                JOIN public.student st ON c.id_class = st.id_class
                JOIN public.report r ON r.id_reporter = st.id_member
                JOIN public.signal s ON s.id_signal = r.id_signal
              WHERE 
                c.id_class = $1
              GROUP BY 2
              ORDER BY 2`,
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no signals found', async () => {
      const mockResult = {
        rows: []
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await getGraphSignal(1);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(getGraphSignal(1)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('erreur dans graphe', mockError);
    });
  });

  describe('getGraphEvaluation', () => {
    it('should return evaluation data for a class and month', async () => {
      const mockResult = {
        rows: [
          { day: '01-01', total: 5 },
          { day: '01-02', total: 0 },
          { day: '01-03', total: 3 }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await getGraphEvaluation(1, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WITH days AS'),
        [1, 1]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should handle string month parameter', async () => {
      const mockResult = {
        rows: [{ day: '01-01', total: 0 }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await getGraphEvaluation(1, '3');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WITH days AS'),
        [1, '3']
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(getGraphEvaluation(1, 1)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('erreur dans graphe', mockError);
    });
  });

  describe('greatestAll', () => {
    it('should return top students across all classes taught by professor', async () => {
      // Mock the first query (getting classes)
      const mockTeachResult = {
        rows: [
          { id_class: 1 },
          { id_class: 2 }
        ]
      };
      
      // Mock the second query (getting top students)
      const mockStudentResult = {
        rows: [
          {
            full_name: 'John Doe',
            cne: 'CNE123',
            profile_picture: 'pic1.jpg',
            sector_id: 1,
            id_class: 1,
            average: '85.50'
          },
          {
            full_name: 'Jane Smith',
            cne: 'CNE456',
            profile_picture: 'pic2.jpg',
            sector_id: 2,
            id_class: 2,
            average: '83.25'
          }
        ]
      };

      pool.query
        .mockResolvedValueOnce(mockTeachResult)
        .mockResolvedValueOnce(mockStudentResult);

      const result = await greatestAll(123);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        `SELECT id_class
           FROM public.teach
          WHERE id_member = $1`,
        [123]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('SELECT m.full_name, s.cne'),
        [[1, 2]]
      );
      expect(result).toEqual(mockStudentResult.rows);
    });

    it('should return empty array when professor has no classes', async () => {
      const mockTeachResult = {
        rows: []
      };
      pool.query.mockResolvedValue(mockTeachResult);

      const result = await greatestAll(123);

      expect(result).toEqual([]);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(greatestAll(123)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('error dans greatestAll:', mockError);
    });
  });

  describe('profile', () => {
    it('should return professor profile information', async () => {
      const mockResult = {
        rows: [{
          profile_picture: 'prof.jpg',
          full_name: 'Prof. Smith',
          cin: 'CIN123456',
          email: 'prof@example.com',
          code: 'PROF001',
          department: 'Computer Science'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await profile(123);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT m.profile_picture, m.full_name, m.cin, m.email, p.code, p.department
                FROM public.member m
                JOIN public.professor p ON m.id_member = p.id_member 
                    WHERE m.id_member =  $1`,
        [123]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should handle when professor does not exist', async () => {
      const mockResult = null;
      pool.query.mockResolvedValue(mockResult);

      const result = await profile(123);

      expect(result).toBe("le prof n'existe pas !");
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(profile(123)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('le probleme dans profile :', mockError);
    });
  });

  describe('totalEvaluation', () => {
    it('should return total evaluations count for current month', async () => {
      const mockResult = {
        rows: [{
          'LES EVALUATIONS DE CE MOIS-CI': '12'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await totalEvaluation(123);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(id_evaluation) AS "LES EVALUATIONS DE CE MOIS-CI" 
            FROM public.skill_evaluation 
             WHERE id_evaluator = $1
             AND date_add >= CURRENT_DATE - INTERVAL '1 MONTH' `,
        [123]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should return zero evaluations when none found', async () => {
      const mockResult = {
        rows: [{
          'LES EVALUATIONS DE CE MOIS-CI': '0'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await totalEvaluation(123);

      expect(result).toEqual({ 'LES EVALUATIONS DE CE MOIS-CI': '0' });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(totalEvaluation(123)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('le probleme dans totalEvaluation :', mockError);
    });
  });
});

// Additional integration-style tests for edge cases
describe('Edge Cases and Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should handle null or undefined parameters gracefully', async () => {
    const mockResult = { rows: [{ total: '0' }] };
    pool.query.mockResolvedValue(mockResult);

    const result = await total(null);
    expect(result).toBe(0);

    const result2 = await total(undefined);
    expect(result2).toBe(0);
  });

  it('should handle non-numeric string conversion in total functions', async () => {
    const mockResult = { rows: [{ total: 'invalid' }] };
    pool.query.mockResolvedValue(mockResult);

    const result = await total(123);
    expect(isNaN(result)).toBe(true);
  });

  it('should handle empty result sets consistently', async () => {
    const mockResult = { rows: [] };
    pool.query.mockResolvedValue(mockResult);

    const classesResult = await classes(123);
    expect(classesResult).toEqual([]);

    const signalResult = await getGraphSignal(123);
    expect(signalResult).toEqual([]);
  });
});