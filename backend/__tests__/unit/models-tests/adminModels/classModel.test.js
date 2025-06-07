const ClassModel = require('../../../../models/adminModels/classModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  connect: jest.fn(),
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('ClassModel', () => {
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock client for transactions
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('createClass', () => {
    it('should successfully create sector and classes with transaction', async () => {
      const field = 'COMPUTER_SCIENCE';
      const description = 'Computer Science Department';
      const classes = ['CS101', 'CS102', 'CS201'];
      const id_admin = 123;

      // Mock successful transaction
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // INSERT sector
        .mockResolvedValueOnce(undefined) // INSERT class 1
        .mockResolvedValueOnce(undefined) // INSERT class 2
        .mockResolvedValueOnce(undefined) // INSERT class 3
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await ClassModel.createClass(field, description, classes, id_admin);

      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO public.sector (id_sector, description, id_admin) VALUES ($1, $2, $3)',
        [field, description, id_admin]
      );
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO public.class (id_class, sector_id) VALUES ($1, $2)',
        ['CS101', field]
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual({ message: "Sector and classes inserted successfully" });
    });

    it('should handle single class creation', async () => {
      const field = 'MATH';
      const description = 'Mathematics';
      const classes = ['MATH101'];
      const id_admin = 456;

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // INSERT sector
        .mockResolvedValueOnce(undefined) // INSERT class
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await ClassModel.createClass(field, description, classes, id_admin);

      expect(mockClient.query).toHaveBeenCalledTimes(4); // BEGIN, sector, 1 class, COMMIT
      expect(result).toEqual({ message: "Sector and classes inserted successfully" });
    });

    it('should handle empty classes array', async () => {
      const field = 'EMPTY_FIELD';
      const description = 'Empty Field';
      const classes = [];
      const id_admin = 789;

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // INSERT sector
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await ClassModel.createClass(field, description, classes, id_admin);

      expect(mockClient.query).toHaveBeenCalledTimes(3); // BEGIN, sector, COMMIT (no class inserts)
      expect(result).toEqual({ message: "Sector and classes inserted successfully" });
    });

    it('should rollback transaction on sector insertion error', async () => {
      const field = 'ERROR_FIELD';
      const description = 'Error Field';
      const classes = ['CLASS1'];
      const id_admin = 100;

      const mockError = new Error('Duplicate key violation');
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(mockError); // INSERT sector fails

      await expect(ClassModel.createClass(field, description, classes, id_admin))
        .rejects.toThrow('Duplicate key violation');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should rollback transaction on class insertion error', async () => {
      const field = 'FIELD1';
      const description = 'Field 1';
      const classes = ['CLASS1', 'CLASS2'];
      const id_admin = 200;

      const mockError = new Error('Foreign key constraint violation');
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // INSERT sector
        .mockResolvedValueOnce(undefined) // INSERT first class
        .mockRejectedValueOnce(mockError); // INSERT second class fails

      await expect(ClassModel.createClass(field, description, classes, id_admin))
        .rejects.toThrow('Foreign key constraint violation');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle client connection error', async () => {
      const mockError = new Error('Connection pool exhausted');
      pool.connect.mockRejectedValue(mockError);

      await expect(ClassModel.createClass('FIELD', 'desc', ['CLASS'], 1))
        .rejects.toThrow('Connection pool exhausted');

      expect(pool.connect).toHaveBeenCalled();
    });

    it('should ensure client is released even on unexpected errors', async () => {
      const field = 'TEST_FIELD';
      const description = 'Test';
      const classes = ['TEST_CLASS'];
      const id_admin = 300;

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(ClassModel.createClass(field, description, classes, id_admin))
        .rejects.toThrow('Unexpected error');

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('getAllSectors', () => {
    it('should return all sectors with class counts', async () => {
      const mockResult = {
        rows: [
          { field: 'CS', description: 'Computer Science', 'number of classes': '5' },
          { field: 'MATH', description: 'Mathematics', 'number of classes': '3' },
          { field: 'PHYS', description: 'Physics', 'number of classes': '4' }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.getAllSectors();

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT 
         s.id_sector AS field, 
         s.description, 
         COUNT(c.id_class) AS "number of classes"
       FROM public.sector s
       JOIN public.class c ON s.id_sector = c.sector_id
       GROUP BY s.id_sector`
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no sectors exist', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ClassModel.getAllSectors();

      expect(result).toEqual([]);
    });

    it('should handle database error', async () => {
      const mockError = new Error('Table does not exist');
      pool.query.mockRejectedValue(mockError);

      await expect(ClassModel.getAllSectors()).rejects.toThrow('Table does not exist');
    });

    it('should handle sectors with zero classes (edge case)', async () => {
      // This would typically not happen due to JOIN, but testing the structure
      const mockResult = {
        rows: [
          { field: 'EMPTY', description: 'Empty Sector', 'number of classes': '0' }
        ]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.getAllSectors();

      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('getClassByName', () => {
    it('should return class when found with exact match', async () => {
      const mockClass = { id_class: 'CS101', sector_id: 'CS', created_at: '2024-01-01' };
      pool.query.mockResolvedValue({ rows: [mockClass] });

      const result = await ClassModel.getClassByName('CS101');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM public.class WHERE id_class ILIKE $1',
        ['CS101']
      );
      expect(result).toEqual(mockClass);
    });

    it('should return class with case-insensitive search', async () => {
      const mockClass = { id_class: 'cs101', sector_id: 'CS' };
      pool.query.mockResolvedValue({ rows: [mockClass] });

      const result = await ClassModel.getClassByName('CS101');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM public.class WHERE id_class ILIKE $1',
        ['CS101']
      );
      expect(result).toEqual(mockClass);
    });

    it('should return undefined when class not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ClassModel.getClassByName('NONEXISTENT');

      expect(result).toBeUndefined();
    });

    it('should handle database error', async () => {
      const mockError = new Error('Connection lost');
      pool.query.mockRejectedValue(mockError);

      await expect(ClassModel.getClassByName('CS101')).rejects.toThrow('Connection lost');
    });

    it('should handle special characters in class name', async () => {
      const className = "CS-101/A";
      const mockClass = { id_class: className, sector_id: 'CS' };
      pool.query.mockResolvedValue({ rows: [mockClass] });

      const result = await ClassModel.getClassByName(className);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM public.class WHERE id_class ILIKE $1',
        [className]
      );
      expect(result).toEqual(mockClass);
    });

    it('should handle null/undefined input', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const resultNull = await ClassModel.getClassByName(null);
      const resultUndefined = await ClassModel.getClassByName(undefined);

      expect(resultNull).toBeUndefined();
      expect(resultUndefined).toBeUndefined();
    });
  });

  describe('updateFieldById', () => {
    it('should update sector with single field', async () => {
      const updates = { description: 'Updated Description' };
      const mockUpdatedSector = { id_sector: 'CS', description: 'Updated Description', id_admin: 123 };
      pool.query.mockResolvedValue({ rows: [mockUpdatedSector] });

      const result = await ClassModel.updateFieldById('CS', updates);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.sector SET description = $1 WHERE id_sector = $2 RETURNING *',
        ['Updated Description', 'CS']
      );
      expect(result).toEqual(mockUpdatedSector);
    });

    it('should update sector with multiple fields', async () => {
      const updates = { 
        description: 'New Description', 
        id_admin: 456 
      };
      const mockUpdatedSector = { id_sector: 'MATH', description: 'New Description', id_admin: 456 };
      pool.query.mockResolvedValue({ rows: [mockUpdatedSector] });

      const result = await ClassModel.updateFieldById('MATH', updates);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.sector SET description = $1, id_admin = $2 WHERE id_sector = $3 RETURNING *',
        ['New Description', 456, 'MATH']
      );
      expect(result).toEqual(mockUpdatedSector);
    });

    it('should return null for empty updates object', async () => {
      const result = await ClassModel.updateFieldById('CS', {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle sector not found', async () => {
      const updates = { description: 'Updated' };
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ClassModel.updateFieldById('NONEXISTENT', updates);

      expect(result).toBeUndefined();
    });

    it('should handle database error', async () => {
      const updates = { description: 'Updated' };
      const mockError = new Error('Constraint violation');
      pool.query.mockRejectedValue(mockError);

      await expect(ClassModel.updateFieldById('CS', updates))
        .rejects.toThrow('Constraint violation');
    });

    it('should handle null values in updates', async () => {
      const updates = { description: null, id_admin: 789 };
      const mockUpdatedSector = { id_sector: 'CS', description: null, id_admin: 789 };
      pool.query.mockResolvedValue({ rows: [mockUpdatedSector] });

      const result = await ClassModel.updateFieldById('CS', updates);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.sector SET description = $1, id_admin = $2 WHERE id_sector = $3 RETURNING *',
        [null, 789, 'CS']
      );
      expect(result).toEqual(mockUpdatedSector);
    });

    it('should handle special characters in field names', async () => {
      const updates = { 'field_with_underscore': 'value' };
      pool.query.mockResolvedValue({ rows: [{ id_sector: 'TEST' }] });

      await ClassModel.updateFieldById('TEST', updates);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.sector SET field_with_underscore = $1 WHERE id_sector = $2 RETURNING *',
        ['value', 'TEST']
      );
    });
  });

  describe('deleteClassById', () => {
    it('should successfully delete class', async () => {
      const mockResult = { rowCount: 1, command: 'DELETE' };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.deleteClassById('CS101');

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM public.class WHERE id_class = $1',
        ['CS101']
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle class not found (0 rows affected)', async () => {
      const mockResult = { rowCount: 0, command: 'DELETE' };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.deleteClassById('NONEXISTENT');

      expect(result.rowCount).toBe(0);
    });

    it('should handle database error', async () => {
      const mockError = new Error('Foreign key constraint violation');
      pool.query.mockRejectedValue(mockError);

      await expect(ClassModel.deleteClassById('CS101'))
        .rejects.toThrow('Foreign key constraint violation');
    });

    it('should handle null/undefined ID', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const resultNull = await ClassModel.deleteClassById(null);
      const resultUndefined = await ClassModel.deleteClassById(undefined);

      expect(resultNull.rowCount).toBe(0);
      expect(resultUndefined.rowCount).toBe(0);
    });

    it('should handle special characters in class ID', async () => {
      const classId = 'CS-101/Advanced';
      const mockResult = { rowCount: 1, command: 'DELETE' };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.deleteClassById(classId);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM public.class WHERE id_class = $1',
        [classId]
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('totalClasses', () => {
    it('should return total count of classes', async () => {
      const mockResult = { rows: [{ total: '25' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.totalClasses();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM public.class'
      );
      expect(result).toEqual({ total: '25' });
    });

    it('should return zero when no classes exist', async () => {
      const mockResult = { rows: [{ total: '0' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.totalClasses();

      expect(result).toEqual({ total: '0' });
    });

    it('should handle database error', async () => {
      const mockError = new Error('Table access denied');
      pool.query.mockRejectedValue(mockError);

      await expect(ClassModel.totalClasses()).rejects.toThrow('Table access denied');
    });

    it('should handle large numbers', async () => {
      const mockResult = { rows: [{ total: '999999' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await ClassModel.totalClasses();

      expect(result).toEqual({ total: '999999' });
    });
  });

  describe('Integration and edge cases', () => {
    it('should handle concurrent operations', async () => {
      // Setup mocks for multiple operations
      pool.query
        .mockResolvedValueOnce({ rows: [{ total: '10' }] }) // totalClasses
        .mockResolvedValueOnce({ rows: [{ id_class: 'CS101' }] }); // getClassByName

      const [totalResult, classResult] = await Promise.all([
        ClassModel.totalClasses(),
        ClassModel.getClassByName('CS101')
      ]);

      expect(totalResult).toEqual({ total: '10' });
      expect(classResult).toEqual({ id_class: 'CS101' });
    });

    it('should handle mixed success/failure in concurrent operations', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ total: '5' }] })
        .mockRejectedValueOnce(new Error('Class query failed'));

      const totalResult = await ClassModel.totalClasses();
      
      expect(totalResult).toEqual({ total: '5' });
      
      await expect(ClassModel.getClassByName('FAIL'))
        .rejects.toThrow('Class query failed');
    });

    it('should handle transaction rollback with proper cleanup', async () => {
      const mockError = new Error('Constraint violation');
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(mockError) // Sector insert fails
        .mockResolvedValueOnce(undefined); // ROLLBACK

      await expect(ClassModel.createClass('FIELD', 'desc', ['CLASS'], 1))
        .rejects.toThrow('Constraint violation');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});