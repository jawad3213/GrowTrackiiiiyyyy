const DashModel = require('../../../../models/adminModels/AdminDashboardModel.js');

// Mock the database pool
jest.mock('../../../../config/db.js', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db.js');

describe('AdminDashboardModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-15')); // June 15, 2024
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('TotalUserModel', () => {
    it('should return total users for current month', async () => {
      const mockResult = { rows: [{ count: '25' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await DashModel.TotalUserModel();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM public.member WHERE EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)"
      );
      expect(result).toBe(25);
    });

    it('should handle zero users', async () => {
      const mockResult = { rows: [{ count: '0' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await DashModel.TotalUserModel();

      expect(result).toBe(0);
    });
  });

  describe('differenceUserModel', () => {
    it('should return difference with increased trend', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '30' }] }) // current month
        .mockResolvedValueOnce({ rows: [{ count: '20' }] }); // previous month

      const result = await DashModel.differenceUserModel();

      expect(result).toEqual({
        current: 30,
        previous: 20,
        difference: 10,
        trend: 'increased'
      });
    });

    it('should return difference with decreased trend', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '15' }] }) // current month
        .mockResolvedValueOnce({ rows: [{ count: '25' }] }); // previous month

      const result = await DashModel.differenceUserModel();

      expect(result).toEqual({
        current: 15,
        previous: 25,
        difference: 10,
        trend: 'decreased'
      });
    });

    it('should return no change trend when equal', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '20' }] }) // current month
        .mockResolvedValueOnce({ rows: [{ count: '20' }] }); // previous month

      const result = await DashModel.differenceUserModel();

      expect(result).toEqual({
        current: 20,
        previous: 20,
        difference: 0,
        trend: 'no change'
      });
    });
  });

  describe('TotalEvaluationModel', () => {
    it('should return total evaluations for current month', async () => {
      const mockResult = { rows: [{ count: '45' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await DashModel.TotalEvaluationModel();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)"
      );
      expect(result).toBe(45);
    });
  });

  describe('differenceEvaluationModel', () => {
    it('should return evaluation difference with increased trend', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '50' }] }) // current month
        .mockResolvedValueOnce({ rows: [{ count: '35' }] }); // previous month

      const result = await DashModel.differenceEvaluationModel();

      expect(result).toEqual({
        current: 50,
        previous: 35,
        difference: 15,
        trend: 'increased'
      });
    });

    it('should handle zero evaluations', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }) // current month
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }); // previous month

      const result = await DashModel.differenceEvaluationModel();

      expect(result).toEqual({
        current: 0,
        previous: 0,
        difference: 0,
        trend: 'no change'
      });
    });
  });

  describe('InvolvementModel_current', () => {
    it('should return current involvement percentage', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '100' }] }) // total users
        .mockResolvedValueOnce({ rows: [{ count: '25' }] }); // evaluators this month

      const result = await DashModel.InvolvementModel_current();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM public.member WHERE role NOT IN ($1, $2)",
        ['coach', 'admin']
      );
      expect(result).toEqual({
        percentage: 25.00
      });
    });

    it('should handle zero total users', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }) // total users
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }); // evaluators this month

      const result = await DashModel.InvolvementModel_current();

      expect(result).toEqual({
        percentage: 0
      });
    });

    it('should handle partial percentage', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '75' }] }) // total users
        .mockResolvedValueOnce({ rows: [{ count: '33' }] }); // evaluators this month

      const result = await DashModel.InvolvementModel_current();

      expect(result).toEqual({
        percentage: 44.00
      });
    });
  });

  describe('InvolvementModel_previous', () => {
    it('should return previous involvement percentage', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '100' }] }) // total users
        .mockResolvedValueOnce({ rows: [{ count: '30' }] }); // evaluators previous month

      const result = await DashModel.InvolvementModel_previous();

      expect(result).toEqual({
        percentage: 30.00
      });
    });

    it('should handle zero evaluators in previous month', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '50' }] }) // total users
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }); // evaluators previous month

      const result = await DashModel.InvolvementModel_previous();

      expect(result).toEqual({
        percentage: 0
      });
    });
  });

  describe('flagged_evaluation_Model', () => {
    it('should return flagged evaluations for academic year (current month <= 6)', async () => {
      // Mock multiple query calls for different months
      const mockCounts = [
        { rows: [{ count: '5' }] },  // Sept prev year
        { rows: [{ count: '3' }] },  // Oct prev year
        { rows: [{ count: '7' }] },  // Nov prev year
        { rows: [{ count: '2' }] },  // Dec prev year
        { rows: [{ count: '8' }] },  // Jan current year
        { rows: [{ count: '4' }] },  // Feb current year
        { rows: [{ count: '6' }] },  // Mar current year
        { rows: [{ count: '9' }] },  // Apr current year
        { rows: [{ count: '1' }] },  // May current year
        { rows: [{ count: '3' }] }   // Jun current year
      ];

      pool.query.mockImplementation(() => Promise.resolve(mockCounts.shift()));

      const result = await DashModel.flagged_evaluation_Model();

      expect(pool.query).toHaveBeenCalledTimes(10);
      expect(result).toEqual({
        data: [5, 3, 7, 2, 8, 4, 6, 9, 1, 3]
      });
    });

    it('should return flagged evaluations for academic year (current month > 6)', async () => {
      // Change date to August (month 8)
      jest.setSystemTime(new Date('2024-08-15'));

      const mockCounts = [
        { rows: [{ count: '2' }] },  // Sept current year
        { rows: [{ count: '4' }] },  // Oct current year
        { rows: [{ count: '1' }] },  // Nov current year
        { rows: [{ count: '6' }] },  // Dec current year
        { rows: [{ count: '3' }] },  // Jan next year
        { rows: [{ count: '5' }] },  // Feb next year
        { rows: [{ count: '7' }] },  // Mar next year
        { rows: [{ count: '2' }] },  // Apr next year
        { rows: [{ count: '8' }] },  // May next year
        { rows: [{ count: '4' }] }   // Jun next year
      ];

      pool.query.mockImplementation(() => Promise.resolve(mockCounts.shift()));

      const result = await DashModel.flagged_evaluation_Model();

      expect(result).toEqual({
        data: [2, 4, 1, 6, 3, 5, 7, 2, 8, 4]
      });
    });
  });

  describe('evaluation_type_in_month', () => {
    it('should return evaluation counts by type for given month/year', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '10' }] }) // Pair
        .mockResolvedValueOnce({ rows: [{ count: '15' }] }) // Self  
        .mockResolvedValueOnce({ rows: [{ count: '8' }] })  // Supervisor
        .mockResolvedValueOnce({ rows: [{ count: '12' }] }); // Professor

      const result = await DashModel.evaluation_type_in_month(6, 2024);

      expect(pool.query).toHaveBeenCalledTimes(4);
      expect(pool.query).toHaveBeenNthCalledWith(1, 
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE  EXTRACT(MONTH FROM date_add)=$1 and EXTRACT(YEAR FROM date_add)=$2 and type_evaluation='Pair'",
        [6, 2024]
      );
      expect(result).toEqual({
        result: [10, 15, 8, 12]
      });
    });

    it('should handle zero counts for all evaluation types', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] });

      const result = await DashModel.evaluation_type_in_month(12, 2023);

      expect(result).toEqual({
        result: [0, 0, 0, 0]
      });
    });
  });

  describe('evaluation_source_overtime_Model', () => {
    // Mock the evaluation_type_in_month function
    beforeEach(() => {
      DashModel.evaluation_type_in_month = jest.fn();
    });

    it('should return evaluation source data over time (current month <= 6)', async () => {
      const mockResults = [
        { result: [5, 3, 2, 4] },
        { result: [7, 4, 3, 5] },
        { result: [6, 5, 4, 3] },
        { result: [8, 2, 5, 6] },
        { result: [4, 6, 3, 7] },
        { result: [9, 3, 4, 2] },
        { result: [5, 7, 2, 8] },
        { result: [6, 4, 6, 5] },
        { result: [7, 5, 3, 4] },
        { result: [3, 8, 4, 6] }
      ];

      DashModel.evaluation_type_in_month.mockImplementation(() => 
        Promise.resolve(mockResults.shift())
      );

      const result = await DashModel.evaluation_source_overtime_Model();

      expect(DashModel.evaluation_type_in_month).toHaveBeenCalledTimes(10);
      expect(result).toEqual({
        data: [
          [5, 3, 2, 4], [7, 4, 3, 5], [6, 5, 4, 3], [8, 2, 5, 6], [4, 6, 3, 7],
          [9, 3, 4, 2], [5, 7, 2, 8], [6, 4, 6, 5], [7, 5, 3, 4], [3, 8, 4, 6]
        ]
      });
    });
  });

  describe('user_distribution_by_role_Model', () => {
    it('should return user distribution by role', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '150' }] }) // students
        .mockResolvedValueOnce({ rows: [{ count: '25' }] })  // supervisors
        .mockResolvedValueOnce({ rows: [{ count: '30' }] })  // professors
        .mockResolvedValueOnce({ rows: [{ count: '205' }] }); // total (excluding coach/admin)

      const result = await DashModel.user_distribution_by_role_Model();

      expect(pool.query).toHaveBeenCalledTimes(4);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        "SELECT COUNT(*) FROM public.member WHERE role='student'"
      );
      expect(pool.query).toHaveBeenNthCalledWith(4,
        "SELECT COUNT(*) FROM public.member WHERE role NOT IN ($1, $2)",
        ['coach', 'admin']
      );
      expect(result).toEqual({
        data: ['150', '25', '30', '205']
      });
    });

    it('should handle zero counts for all roles', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] });

      const result = await DashModel.user_distribution_by_role_Model();

      expect(result).toEqual({
        data: ['0', '0', '0', '0']
      });
    });
  });

  describe('news_admin_Model', () => {
    it('should return admin news ordered by date DESC', async () => {
      const mockNews = [
        { id: 1, title: 'Latest Admin News', type: 'admin', date: '2024-06-15' },
        { id: 2, title: 'Previous Admin News', type: 'admin', date: '2024-06-10' }
      ];
      pool.query.mockResolvedValue({ rows: mockNews });

      const result = await DashModel.news_admin_Model();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.news WHERE type='admin' ORDER BY date DESC"
      );
      expect(result).toEqual(mockNews);
    });

    it('should return empty array when no admin news exist', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await DashModel.news_admin_Model();

      expect(result).toEqual([]);
    });
  });

  describe('news_professor_Model', () => {
    it('should return professor news ordered by date DESC', async () => {
      const mockNews = [
        { id: 3, title: 'Professor News 1', type: 'Professor', date: '2024-06-12' },
        { id: 4, title: 'Professor News 2', type: 'Professor', date: '2024-06-08' }
      ];
      pool.query.mockResolvedValue({ rows: mockNews });

      const result = await DashModel.news_professor_Model();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.news WHERE type='Professor' ORDER BY date DESC"
      );
      expect(result).toEqual(mockNews);
    });

    it('should return empty array when no professor news exist', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await DashModel.news_professor_Model();

      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should handle database errors in TotalUserModel', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(DashModel.TotalUserModel()).rejects.toThrow('Database connection failed');
    });

    it('should handle database errors in differenceUserModel', async () => {
      pool.query.mockRejectedValue(new Error('Query timeout'));

      await expect(DashModel.differenceUserModel()).rejects.toThrow('Query timeout');
    });

    it('should handle database errors in news functions', async () => {
      pool.query.mockRejectedValue(new Error('Table not found'));

      await expect(DashModel.news_admin_Model()).rejects.toThrow('Table not found');
      await expect(DashModel.news_professor_Model()).rejects.toThrow('Table not found');
    });
  });
});