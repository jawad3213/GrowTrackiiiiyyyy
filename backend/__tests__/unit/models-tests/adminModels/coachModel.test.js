const coachModel = require('../../../../models/adminModels/coachModel'); 

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Coach Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock if needed
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createCoach', () => {
    const mockCoachData = {
      id_user: 1,
      name: 'John Doe',
      cin: 'ABC123456',
      email: 'john.doe@example.com',
      pass: 'hashedPassword',
      field: 'Football',
      note: 'Experienced coach',
      role: 'coach'
    };

    it('should successfully create a coach', async () => {
      const mockMemberResult = {
        rows: [{ id_member: 1, full_name: 'John Doe' }]
      };
      
      pool.query
        .mockResolvedValueOnce(mockMemberResult) // First query (member insert)
        .mockResolvedValueOnce({ rows: [] }); // Second query (coach insert)

      const result = await coachModel.createCoach(
        mockCoachData.id_user,
        mockCoachData.name,
        mockCoachData.cin,
        mockCoachData.email,
        mockCoachData.pass,
        mockCoachData.field,
        mockCoachData.note,
        mockCoachData.role
      );

      expect(pool.query).toHaveBeenCalledTimes(2);
      
      // Verify member insertion query
      expect(pool.query).toHaveBeenNthCalledWith(1,
        `INSERT INTO public.member (
               id_member, full_name, cin, email, password, role, description
             ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [1, 'John Doe', 'ABC123456', 'john.doe@example.com', 'hashedPassword', 'coach', 'Experienced coach']
      );

      // Verify coach insertion query
      expect(pool.query).toHaveBeenNthCalledWith(2,
        `INSERT INTO public.coach (
               id_member, field
             ) VALUES ($1, $2)`,
        [1, 'Football']
      );

      expect(result).toEqual(mockMemberResult.rows[0]);
    });

    it('should handle database errors during coach creation', async () => {
      const dbError = new Error('Database connection failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(coachModel.createCoach(
        mockCoachData.id_user,
        mockCoachData.name,
        mockCoachData.cin,
        mockCoachData.email,
        mockCoachData.pass,
        mockCoachData.field,
        mockCoachData.note,
        mockCoachData.role
      )).rejects.toThrow('Database connection failed');

      expect(console.error).toHaveBeenCalledWith('Error inserting coach:', dbError);
    });

    it('should handle error in second query (coach table insertion)', async () => {
      const dbError = new Error('Coach table insertion failed');
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_member: 1 }] }) // First query succeeds
        .mockRejectedValueOnce(dbError); // Second query fails

      await expect(coachModel.createCoach(
        mockCoachData.id_user,
        mockCoachData.name,
        mockCoachData.cin,
        mockCoachData.email,
        mockCoachData.pass,
        mockCoachData.field,
        mockCoachData.note,
        mockCoachData.role
      )).rejects.toThrow('Coach table insertion failed');

      expect(console.error).toHaveBeenCalledWith('Error inserting coach:', dbError);
    });
  });

  describe('getAllCoach', () => {
    it('should return all coaches successfully', async () => {
      const mockCoaches = [
        {
          cin: 'ABC123456',
          full_name: 'John Doe',
          field: 'Football',
          date_add: '2024-01-01'
        },
        {
          cin: 'DEF789012',
          full_name: 'Jane Smith',
          field: 'Basketball',
          date_add: '2024-01-02'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockCoaches });

      const result = await coachModel.getAllCoach();

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `SELECT m.cin, m.full_name, c.field, m.date_add
             FROM public.member m 
             JOIN public.coach c ON m.id_member = c.id_member `
      );
      expect(result).toEqual(mockCoaches);
    });

    it('should return empty array when no coaches found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await coachModel.getAllCoach();

      expect(result).toEqual([]);
    });

    it('should handle database errors when fetching all coaches', async () => {
      const dbError = new Error('Database query failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(coachModel.getAllCoach()).rejects.toThrow('Database query failed');
      expect(console.error).toHaveBeenCalledWith('Error fetching coaches:', dbError);
    });
  });

  describe('getCoachByCin', () => {
    const testCin = 'ABC123456';

    it('should return coach when found by CIN', async () => {
      const mockCoach = {
        id_member: 1,
        cin: 'ABC123456',
        full_name: 'John Doe',
        field: 'Football',
        date_add: '2024-01-01'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockCoach] });

      const result = await coachModel.getCoachByCin(testCin);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `SELECT m.id_member, m.cin, m.full_name, c.field, m.date_add 
             FROM public.member m 
             JOIN public.coach c ON m.id_member = c.id_member 
             WHERE m.cin = $1`,
        [testCin]
      );
      expect(result).toEqual(mockCoach);
    });

    it('should return null when coach not found by CIN', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await coachModel.getCoachByCin(testCin);

      expect(result).toBeNull();
    });

    it('should return null when query result is null', async () => {
      pool.query.mockResolvedValueOnce(null);

      const result = await coachModel.getCoachByCin(testCin);

      expect(result).toBeNull();
    });

    it('should handle database errors when fetching coach by CIN', async () => {
      const dbError = new Error('Database query failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(coachModel.getCoachByCin(testCin)).rejects.toThrow('Database query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving coach by CIN:', dbError);
    });
  });

  describe('updateCoachById', () => {
    const testId = 1;

    it('should successfully update coach with valid fields', async () => {
      const fieldsToUpdate = {
        full_name: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockUpdatedCoach = {
        id_member: 1,
        full_name: 'Updated Name',
        email: 'updated@example.com'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUpdatedCoach] });

      const result = await coachModel.updateCoachById(testId, fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.member SET full_name = $1, email = $2 WHERE id_member = $3 RETURNING *',
        ['Updated Name', 'updated@example.com', 1]
      );
      expect(result).toEqual(mockUpdatedCoach);
    });

    it('should return null when no fields to update', async () => {
      const result = await coachModel.updateCoachById(testId, {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle single field update', async () => {
      const fieldsToUpdate = { full_name: 'Single Update' };
      const mockUpdatedCoach = { id_member: 1, full_name: 'Single Update' };

      pool.query.mockResolvedValueOnce({ rows: [mockUpdatedCoach] });

      const result = await coachModel.updateCoachById(testId, fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.member SET full_name = $1 WHERE id_member = $2 RETURNING *',
        ['Single Update', 1]
      );
      expect(result).toEqual(mockUpdatedCoach);
    });

    it('should handle database errors during update', async () => {
      const fieldsToUpdate = { full_name: 'Test Name' };
      const dbError = new Error('Update failed');
      
      pool.query.mockRejectedValueOnce(dbError);

      await expect(coachModel.updateCoachById(testId, fieldsToUpdate)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteCoachById', () => {
    const testId = 1;

    it('should successfully delete coach by ID', async () => {
      const mockResult = { rowCount: 1 };
      
      pool.query
        .mockResolvedValueOnce(mockResult) // Delete from coach table
        .mockResolvedValueOnce(mockResult); // Delete from member table

      const result = await coachModel.deleteCoachById(testId);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'DELETE FROM public.coach WHERE id_member = $1',
        [testId]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'DELETE FROM public.member WHERE id_member = $1',
        [testId]
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors during deletion', async () => {
      const dbError = new Error('Deletion failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(coachModel.deleteCoachById(testId)).rejects.toThrow('Deletion failed');
      expect(console.error).toHaveBeenCalledWith('Error deleting coach:', dbError);
    });

    it('should handle error in second delete query', async () => {
      const dbError = new Error('Member deletion failed');
      pool.query
        .mockResolvedValueOnce({ rowCount: 1 }) // First delete succeeds
        .mockRejectedValueOnce(dbError); // Second delete fails

      await expect(coachModel.deleteCoachById(testId)).rejects.toThrow('Member deletion failed');
      expect(console.error).toHaveBeenCalledWith('Error deleting coach:', dbError);
    });
  });

  describe('total', () => {
    it('should return total count of coaches', async () => {
      const mockCount = { Total: '5' };
      pool.query.mockResolvedValueOnce({ rows: [mockCount] });

      const result = await coachModel.total();

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(id_member) AS Total FROM public.coach'
      );
      expect(result).toEqual(mockCount);
    });

    it('should return zero count when no coaches exist', async () => {
      const mockCount = { Total: '0' };
      pool.query.mockResolvedValueOnce({ rows: [mockCount] });

      const result = await coachModel.total();

      expect(result).toEqual(mockCount);
    });

    it('should handle database errors when getting total count', async () => {
      const dbError = new Error('Count query failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(coachModel.total()).rejects.toThrow('Count query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving coach count:', dbError);
    });
  });
});