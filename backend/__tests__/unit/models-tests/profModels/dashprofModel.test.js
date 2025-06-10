const {
  total,
  totalstudent,
  classes,
  getGraphSignal,
  getGraphEvaluation,
  greatestAll,
  profile,
  totalEvaluation
} = require('../../../../models/profmodels/dashModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Database Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('total', () => {
    it('should return total count of classes for a professor', async () => {
      pool.query.mockResolvedValue({ rows: [{ total: '5' }] });
      const result = await total(123);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('COUNT'), [123]);
      expect(result).toBe(5);
    });
  });

  describe('totalstudent', () => {
    it('should return total count of students for a professor', async () => {
      pool.query.mockResolvedValue({ rows: [{ total: '25' }] });
      const result = await totalstudent(123);
      expect(result).toBe(25);
    });
  });

  describe('classes', () => {
    it('should return list of classes', async () => {
      pool.query.mockResolvedValue({ rows: [{ class: 1 }, { class: 2 }] });
      const result = await classes(123);
      expect(result).toEqual([{ class: 1 }, { class: 2 }]);
    });
  });

  describe('getGraphSignal', () => {
    it('should return signal grouped by month', async () => {
      pool.query.mockResolvedValue({ rows: [{ total: '10', month: '2024-01' }] });
      const result = await getGraphSignal(1);
      expect(result).toEqual([{ total: '10', month: '2024-01' }]);
    });
  });

  describe('getGraphEvaluation', () => {
    it('should return evaluation graph', async () => {
      pool.query.mockResolvedValue({ rows: [{ day: '01-01', total: 3 }] });
      const result = await getGraphEvaluation(1, 1);
      expect(result).toEqual([{ day: '01-01', total: 3 }]);
    });
  });

  describe('greatestAll', () => {
    it('should return top students by average', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_class: 1 }] })
        .mockResolvedValueOnce({ rows: [{ full_name: 'A', average: '90.00' }] });

      const result = await greatestAll(123);
      expect(result).toEqual([{ full_name: 'A', average: '90.00' }]);
    });
  });

  describe('profile', () => {
    it("should return professor's profile", async () => {
      pool.query.mockResolvedValue({
        rows: [{ full_name: 'Prof X', email: 'prof@example.com' }]
      });
      const result = await profile(123);
      expect(result).toEqual({ full_name: 'Prof X', email: 'prof@example.com' });
    });
  });

  describe('totalEvaluation', () => {
    it('should return total evaluations this month', async () => {
      pool.query.mockResolvedValue({
        rows: [{ 'LES EVALUATIONS DE CE MOIS-CI': '12' }]
      });
      const result = await totalEvaluation(123);
      expect(result).toEqual({ 'LES EVALUATIONS DE CE MOIS-CI': '12' });
    });
  });
});
