const studentModel = require('../../../../models/adminModels/studentModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Student Model', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Clear all mocks and reset their state
    jest.clearAllMocks();
    pool.query.mockReset();
    
    // Setup console.error spy
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error and reset all mocks
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
    jest.resetAllMocks();
  });

  describe('createStudent', () => {
    it('should create a student successfully', async () => {
      const mockMemberResult = {
        rows: [{ 
          id_member: 1,
          full_name: 'John Doe',
          cin: 'AB123456',
          email: 'john@test.com',
          password: 'hashedpass',
          role: 'student',
          description: 'Good student',
          profile_picture: '/path/to/image.jpg'
        }]
      };
      
      const mockStudentResult = { rows: [] };
      
      pool.query
        .mockResolvedValueOnce(mockMemberResult) // First call for member insert
        .mockResolvedValueOnce(mockStudentResult); // Second call for student insert

      const result = await studentModel.createStudent(
        1, 'John Doe', 'AB123456', 'CNE123', 'john@test.com', 
        'hashedpass', 1, 'Good student', 'student', '/path/to/image.jpg'
      );

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        `INSERT INTO public.member (
           id_member, full_name, cin, email, password, role, description, profile_picture
         ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
        [1, 'John Doe', 'AB123456', 'john@test.com', 'hashedpass', 'student', 'Good student', '/path/to/image.jpg']
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        `INSERT INTO public.student (
           id_member,cne, id_class
         ) VALUES ($1, $2, $3)`,
        [1, 'CNE123', 1]
      );
      expect(result).toEqual(mockMemberResult.rows[0]);
    });

    it('should handle database errors during student creation', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.createStudent(
        1, 'John Doe', 'AB123456', 'CNE123', 'john@test.com', 
        'hashedpass', 1, 'Good student', 'student', '/path/to/image.jpg'
      )).rejects.toThrow('Database connection failed');

      expect(console.error).toHaveBeenCalledWith('Error inserting student:', mockError);
    });

    it('should handle error in student table insertion after member creation', async () => {
      const mockMemberResult = { rows: [{ id_member: 1 }] };
      const mockError = new Error('Student insertion failed');
      
      pool.query
        .mockResolvedValueOnce(mockMemberResult)
        .mockRejectedValueOnce(mockError);

      await expect(studentModel.createStudent(
        1, 'John Doe', 'AB123456', 'CNE123', 'john@test.com', 
        'hashedpass', 1, 'Good student', 'student', '/path/to/image.jpg'
      )).rejects.toThrow('Student insertion failed');

      expect(console.error).toHaveBeenCalledWith('Error inserting student:', mockError);
    });
  });

  describe('getAllStudents', () => {
    it('should retrieve all students successfully', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1,
            cne: 'CNE123',
            full_name: 'John Doe',
            cin: 'AB123456',
            email: 'john@test.com',
            id_sector: 1,
            profile_picture: '/path/to/image.jpg',
            id_class: 1,
            date_add: '2024-01-01'
          },
          {
            id_member: 2,
            cne: 'CNE456',
            full_name: 'Jane Smith',
            cin: 'CD789012',
            email: 'jane@test.com',
            id_sector: 2,
            profile_picture: '/path/to/image2.jpg',
            id_class: 2,
            date_add: '2024-01-02'
          }
        ]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getAllStudents();

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT m.id_member, s.cne, m.full_name, m.cin, m.email, f.id_sector, m.profile_picture, c.id_class, m.date_add 
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class 
         JOIN public.sector f ON f.id_sector = c.sector_id`
      );
      expect(result).toEqual(mockResult.rows);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no students exist', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getAllStudents();

      expect(result).toEqual([]);
    });

    it('should handle database errors during student retrieval', async () => {
      const mockError = new Error('Database query failed');
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.getAllStudents()).rejects.toThrow('Database query failed');
      expect(console.error).toHaveBeenCalledWith('Error fetching students:', mockError);
    });
  });

  describe('getStudentByCin', () => {
    it('should retrieve student by CIN successfully', async () => {
      const mockResult = {
        rows: [{
          id_member: 1,
          cne: 'CNE123',
          full_name: 'John Doe',
          cin: 'AB123456',
          email: 'john@test.com',
          id_sector: 1,
          profile_picture: '/path/to/image.jpg',
          id_class: 1,
          date_add: '2024-01-01'
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getStudentByCin('AB123456');

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT s.id_member, s.cne, m.full_name, m.cin, m.email, f.id_sector, m.profile_picture, c.id_class, m.date_add 
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class 
         JOIN public.sector f ON f.id_sector = c.sector_id
         WHERE m.cin = $1`,
        ['AB123456']
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should return null when student not found', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getStudentByCin('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should return null when result is null or undefined', async () => {
      pool.query.mockResolvedValue(null);

      const result = await studentModel.getStudentByCin('AB123456');

      expect(result).toBeNull();
    });

    it('should handle database errors during student retrieval by CIN', async () => {
      const mockError = new Error('Database query failed');
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.getStudentByCin('AB123456')).rejects.toThrow('Database query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving student:', mockError);
    });
  });

  describe('updateStudentById', () => {
    it('should update member fields only', async () => {
      const mockResult = {
        rows: [{
          id_member: 1,
          full_name: 'John Updated',
          cin: 'AB123456',
          email: 'john.updated@test.com'
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const fieldsToUpdate = { 
        full_name: 'John Updated',
        email: 'john.updated@test.com'
      };
      const result = await studentModel.updateStudentById(1, fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.member SET full_name = $1, email = $2 WHERE id_member = $3 RETURNING *',
        ['John Updated', 'john.updated@test.com', 1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should update student fields only', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const fieldsToUpdate = { 
        cne: 'CNE456',
        id_class: 2
      };
      const result = await studentModel.updateStudentById(1, fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.student SET cne = $1, id_class = $2 WHERE id_member = $3',
        ['CNE456', 2, 1]
      );
      expect(result).toBeNull();
    });

    it('should update both member and student fields', async () => {
      const mockMemberResult = {
        rows: [{
          id_member: 1,
          full_name: 'John Updated',
          email: 'john.updated@test.com'
        }]
      };
      
      pool.query
        .mockResolvedValueOnce(mockMemberResult)
        .mockResolvedValueOnce({ rows: [] });

      const fieldsToUpdate = { 
        full_name: 'John Updated',
        email: 'john.updated@test.com',
        cne: 'CNE456',
        id_class: 2
      };
      const result = await studentModel.updateStudentById(1, fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'UPDATE public.member SET full_name = $1, email = $2 WHERE id_member = $3 RETURNING *',
        ['John Updated', 'john.updated@test.com', 1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'UPDATE public.student SET cne = $1, id_class = $2 WHERE id_member = $3',
        ['CNE456', 2, 1]
      );
      expect(result).toEqual(mockMemberResult.rows[0]);
    });

    it('should return null when no fields to update', async () => {
      const result = await studentModel.updateStudentById(1, {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle database errors during update', async () => {
      const mockError = new Error('Update failed');
      pool.query.mockRejectedValue(mockError);

      const fieldsToUpdate = { full_name: 'Updated Name' };

      await expect(studentModel.updateStudentById(1, fieldsToUpdate))
        .rejects.toThrow('Update failed');
      expect(console.error).toHaveBeenCalledWith('Error updating student:', mockError);
    });
  });

  describe('deleteStudentById', () => {
    it('should delete student and all related records successfully', async () => {
      const mockResults = [
        { rows: [], rowCount: 1 }, // follow_up
        { rows: [], rowCount: 0 }, // report
        { rows: [], rowCount: 1 }, // supervise
        { rows: [], rowCount: 2 }, // skill_evaluation
        { rows: [], rowCount: 1 }, // student
        { rows: [], rowCount: 1 }  // member
      ];
      
      pool.query.mockReset();
      mockResults.forEach(result => {
        pool.query.mockResolvedValueOnce(result);
      });

      const result = await studentModel.deleteStudentById(1);

      expect(pool.query).toHaveBeenCalledTimes(6);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'DELETE FROM public.follow_up WHERE id_student = $1',
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'DELETE FROM public.report WHERE id_reported = $1',
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(3,
        'DELETE FROM public.supervise WHERE id_student = $1',
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(4,
        'DELETE FROM public.skill_evaluation WHERE id_student = $1',
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(5,
        'DELETE FROM public.student WHERE id_member = $1',
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(6,
        'DELETE FROM public.member WHERE id_member = $1',
        [1]
      );
      expect(result).toEqual(mockResults[5]);
    });

    it('should handle database errors during deletion', async () => {
      const mockError = new Error('Deletion failed');
      pool.query.mockReset();
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.deleteStudentById(1))
        .rejects.toThrow('Deletion failed');

      expect(console.error).toHaveBeenCalledWith('Error deleting student:', mockError);
    });
  });

  describe('total', () => {
    it('should return total count of students successfully', async () => {
      const mockResult = {
        rows: [{ Total: '10' }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.total();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(id_member) AS Total FROM public.student '
      );
      expect(result).toEqual({ Total: '10' });
    });

    it('should return zero when no students exist', async () => {
      const mockResult = {
        rows: [{ Total: '0' }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.total();

      expect(result).toEqual({ Total: '0' });
    });

    it('should handle database errors during total count retrieval', async () => {
      const mockError = new Error('Count query failed');
      pool.query.mockReset();
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.total()).rejects.toThrow('Count query failed');
      expect(console.error).toHaveBeenCalledWith('Error deleting student:', mockError);
    });
  });

  describe('getStudentsByClass', () => {
    it('should retrieve students by class successfully', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1,
            cne: 'CNE123',
            full_name: 'John Doe',
            cin: 'AB123456',
            email: 'john@test.com',
            date_add: '2024-01-01',
            id_sector: 1,
            profile_picture: '/path/to/image.jpg',
            id_class: 1
          }
        ]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getStudentsByClass(1);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT 
           s.id_member, s.cne, 
           m.full_name, m.cin, m.email, m.date_add, 
           f.id_sector, m.profile_picture,
           c.id_class
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class
         JOIN public.sector f ON f.id_sector = c.sector_id
         WHERE c.id_class = $1`,
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no students in class', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getStudentsByClass(999);

      expect(result).toEqual([]);
    });

    it('should handle database errors during retrieval by class', async () => {
      const mockError = new Error('Query failed');
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.getStudentsByClass(1)).rejects.toThrow('Query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving students by class:', mockError);
    });
  });

  describe('getStudentsBySector', () => {
    it('should retrieve students by sector successfully', async () => {
      const mockResult = {
        rows: [
          {
            id_member: 1,
            cne: 'CNE123',
            full_name: 'John Doe',
            cin: 'AB123456',
            email: 'john@test.com',
            date_add: '2024-01-01',
            sector_id: 1,
            profile_picture: '/path/to/image.jpg',
            id_class: 1
          }
        ]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getStudentsBySector(1);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT 
           s.id_member, s.cne, 
           m.full_name, m.cin, m.email, m.date_add, 
           c.sector_id, m.profile_picture,
           c.id_class
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class 
         WHERE c.sector_id = $1`,
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should return empty array when no students in sector', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await studentModel.getStudentsBySector(999);

      expect(result).toEqual([]);
    });

    it('should handle database errors during retrieval by sector', async () => {
      const mockError = new Error('Query failed');
      pool.query.mockRejectedValue(mockError);

      await expect(studentModel.getStudentsBySector(1)).rejects.toThrow('Query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving students by sector:', mockError);
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle null values in createStudent', async () => {
      const mockResult = { rows: [{ id_member: null }] };
      
      pool.query
        .mockResolvedValueOnce(mockResult)
        .mockResolvedValueOnce({ rows: [] });

      const result = await studentModel.createStudent(
        null, null, null, null, null, null, null, null, null, null
      );

      expect(result).toEqual({ id_member: null });
    });

    it('should handle updateStudentById with mixed valid and invalid fields', async () => {
      const mockResult = {
        rows: [{ id_member: 1, full_name: 'Updated' }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      // Mix of valid member fields, valid student fields, and invalid fields
      const fieldsToUpdate = { 
        full_name: 'Updated',     // valid member field
        cne: 'CNE456',           // valid student field
        invalid_field: 'should be ignored'  // invalid field
      };
      
      const result = await studentModel.updateStudentById(1, fieldsToUpdate);

      // Should only process valid fields and ignore invalid ones
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should handle partial deletion failures gracefully', async () => {
      const followUpError = new Error('Follow-up deletion failed');
      
      pool.query.mockReset();
      pool.query.mockRejectedValue(followUpError);

      await expect(studentModel.deleteStudentById(1))
        .rejects.toThrow('Follow-up deletion failed');

      expect(console.error).toHaveBeenCalledWith('Error deleting student:', followUpError);
    });
  });
});