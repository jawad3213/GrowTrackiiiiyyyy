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
    it.skip('should return student profile information successfully', async () => {
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

    it.skip('should return empty array when student not found', async () => {
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

    it.skip('should handle student with no project assignment', async () => {
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
});
