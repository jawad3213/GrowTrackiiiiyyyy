const DashModel = require('../../../../models/adminModels/AdminDashboardModel.js');

// Mock the database pool
jest.mock('../../../../config/db.js', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db.js');

describe('AdminDashboardModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('TotalUserModel', () => {
    it.skip('should return total users for current month', async () => {
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

  describe('TotalEvaluationModel', () => {
    it.skip('should return total evaluations for current month', async () => {
      const mockResult = { rows: [{ count: '45' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await DashModel.TotalEvaluationModel();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)"
      );
      expect(result).toBe(45);
    });
  });
});
