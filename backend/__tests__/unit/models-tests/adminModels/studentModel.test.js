const studentService = require('../../../../models/adminModels/studentModel'); 

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Student Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    const mockStudentData = {
      id_user: 'user123',
      full_name: 'John Doe',
      cin: 'CIN123',
      cne: 'CNE456',
      email: 'john@example.com',
      pass: 'hashedPassword',
      field: 'class123',
      note: 'Good student',
      role: 'student',
      imagePath: '/path/to/image.jpg'
    };

    it('should create a student successfully', async () => {
      const mockMemberResult = { rows: [{ id_member: 'user123' }] };
      const mockStudentResult = { rows: [{ id_member: 'user123' }] };

      pool.query
        .mockResolvedValueOnce(mockMemberResult) // First call for member insertion
        .mockResolvedValueOnce(mockStudentResult); // Second call for student insertion

      const result = await studentService.createStudent(
        mockStudentData.id_user,
        mockStudentData.full_name,
        mockStudentData.cin,
        mockStudentData.cne,
        mockStudentData.email,
        mockStudentData.pass,
        mockStudentData.field,
        mockStudentData.note,
        mockStudentData.role,
        mockStudentData.imagePath
      );

      expect(pool.query).toHaveBeenCalledTimes(2);
      
      // Check member insertion query
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO public.member'),
        [mockStudentData.id_user, mockStudentData.full_name, mockStudentData.cin, 
         mockStudentData.email, mockStudentData.pass, mockStudentData.role, 
         mockStudentData.note, mockStudentData.imagePath]
      );

      // Check student insertion query
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO public.student'),
        [mockStudentData.id_user, mockStudentData.cne, mockStudentData.field]
      );

      expect(result).toEqual({ id_member: 'user123' });
    });

    it('should throw error when database operation fails', async () => {
      const dbError = new Error('Database connection failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.createStudent(
        mockStudentData.id_user,
        mockStudentData.full_name,
        mockStudentData.cin,
        mockStudentData.cne,
        mockStudentData.email,
        mockStudentData.pass,
        mockStudentData.field,
        mockStudentData.note,
        mockStudentData.role,
        mockStudentData.imagePath
      )).rejects.toThrow('Database connection failed');
    });
  });

  describe('getAllStudents', () => {
    it('should return all students successfully', async () => {
      const mockStudents = [
        {
          id_member: 'user1',
          cne: 'CNE001',
          full_name: 'John Doe',
          cin: 'CIN001',
          email: 'john@example.com',
          id_sector: 'sector1',
          profile_picture: '/path/to/pic1.jpg',
          id_class: 'class1',
          date_add: '2024-01-01'
        },
        {
          id_member: 'user2',
          cne: 'CNE002',
          full_name: 'Jane Smith',
          cin: 'CIN002',
          email: 'jane@example.com',
          id_sector: 'sector2',
          profile_picture: '/path/to/pic2.jpg',
          id_class: 'class2',
          date_add: '2024-01-02'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockStudents });

      const result = await studentService.getAllStudents();

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.id_member, s.cne, m.full_name')
      );
      expect(result).toEqual(mockStudents);
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Query failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.getAllStudents()).rejects.toThrow('Query failed');
    });
  });

  describe('getStudentByCin', () => {
    const mockStudent = {
      id_member: 'user1',
      cne: 'CNE001',
      full_name: 'John Doe',
      cin: 'CIN001',
      email: 'john@example.com',
      id_sector: 'sector1',
      profile_picture: '/path/to/pic.jpg',
      id_class: 'class1',
      date_add: '2024-01-01'
    };

    it('should return student when found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [mockStudent] });

      const result = await studentService.getStudentByCin('CIN001');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE m.cin = $1'),
        ['CIN001']
      );
      expect(result).toEqual(mockStudent);
    });

    it('should return null when student not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await studentService.getStudentByCin('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should return null when result is undefined', async () => {
      pool.query.mockResolvedValueOnce(undefined);

      const result = await studentService.getStudentByCin('CIN001');

      expect(result).toBeNull();
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database error');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.getStudentByCin('CIN001')).rejects.toThrow('Database error');
    });
  });

  describe('updateStudentById', () => {
    it('should update member fields only', async () => {
      const fieldsToUpdate = {
        full_name: 'Updated Name',
        email: 'updated@example.com'
      };
      const mockUpdatedMember = { id_member: 'user1', full_name: 'Updated Name' };

      pool.query.mockResolvedValueOnce({ rows: [mockUpdatedMember] });

      const result = await studentService.updateStudentById('user1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE public.member SET'),
        ['Updated Name', 'updated@example.com', 'user1']
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should update student fields only', async () => {
      const fieldsToUpdate = {
        cne: 'NEW_CNE',
        id_class: 'new_class'
      };
      const mockMember = { id_member: 'user1', full_name: 'John Doe' };

      pool.query
        .mockResolvedValueOnce({ rowCount: 1 }) // Student update
        .mockResolvedValueOnce({ rows: [mockMember] }); // Member select

      const result = await studentService.updateStudentById('user1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('UPDATE public.student SET'),
        ['NEW_CNE', 'new_class', 'user1']
      );
      expect(result).toEqual(mockMember);
    });

    it('should update both member and student fields', async () => {
      const fieldsToUpdate = {
        full_name: 'Updated Name',
        cne: 'NEW_CNE'
      };
      const mockUpdatedMember = { id_member: 'user1', full_name: 'Updated Name' };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUpdatedMember] }) // Member update
        .mockResolvedValueOnce({ rowCount: 1 }); // Student update

      const result = await studentService.updateStudentById('user1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should handle case when no student record found', async () => {
      const fieldsToUpdate = { cne: 'NEW_CNE' };
      const mockMember = { id_member: 'user1', full_name: 'John Doe' };

      pool.query
        .mockResolvedValueOnce({ rowCount: 0 }) // Student update with no rows affected
        .mockResolvedValueOnce({ rows: [mockMember] }); // Member select

      const result = await studentService.updateStudentById('user1', fieldsToUpdate);

      expect(result).toEqual(mockMember);
    });

    it('should throw error when database operation fails', async () => {
      const dbError = new Error('Update failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.updateStudentById('user1', { full_name: 'Test' }))
        .rejects.toThrow('Update failed');
    });
  });

  describe('deleteStudentById', () => {
    it('should delete student and related records successfully', async () => {
      const mockResult = { rowCount: 1 };

      pool.query
        .mockResolvedValueOnce({ rowCount: 1 }) // follow_up delete
        .mockResolvedValueOnce({ rowCount: 1 }) // report delete
        .mockResolvedValueOnce({ rowCount: 1 }) // supervise delete
        .mockResolvedValueOnce({ rowCount: 1 }) // skill_evaluation delete
        .mockResolvedValueOnce({ rowCount: 1 }) // student delete
        .mockResolvedValueOnce(mockResult); // member delete

      const result = await studentService.deleteStudentById('user1');

      expect(pool.query).toHaveBeenCalledTimes(6);
      
      // Check deletion order
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'DELETE FROM public.follow_up WHERE id_student = $1',
        ['user1']
      );
      expect(pool.query).toHaveBeenNthCalledWith(6,
        'DELETE FROM public.member WHERE id_member = $1',
        ['user1']
      );
      
      expect(result).toEqual(mockResult);
    });

    it('should throw error when deletion fails', async () => {
      const dbError = new Error('Deletion failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.deleteStudentById('user1')).rejects.toThrow('Deletion failed');
    });
  });

  describe('total', () => {
    it('should return total count of students', async () => {
      const mockTotal = { total: '25' };
      pool.query.mockResolvedValueOnce({ rows: [mockTotal] });

      const result = await studentService.total();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(id_member) AS Total FROM public.student '
      );
      expect(result).toEqual(mockTotal);
    });

    it('should throw error when count query fails', async () => {
      const dbError = new Error('Count failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.total()).rejects.toThrow('Count failed');
    });
  });

  describe('getStudentsByClass', () => {
    it('should return students filtered by class', async () => {
      const mockStudents = [
        {
          id_member: 'user1',
          cne: 'CNE001',
          full_name: 'John Doe',
          cin: 'CIN001',
          email: 'john@example.com',
          date_add: '2024-01-01',
          id_sector: 'sector1',
          profile_picture: '/path/to/pic.jpg',
          id_class: 'class1'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockStudents });

      const result = await studentService.getStudentsByClass('class1');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.id_class = $1'),
        ['class1']
      );
      expect(result).toEqual(mockStudents);
    });

    it('should throw error when query fails', async () => {
      const dbError = new Error('Class query failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.getStudentsByClass('class1')).rejects.toThrow('Class query failed');
    });
  });

  describe('getStudentsBySector', () => {
    it('should return students filtered by sector', async () => {
      const mockStudents = [
        {
          id_member: 'user1',
          cne: 'CNE001',
          full_name: 'John Doe',
          cin: 'CIN001',
          email: 'john@example.com',
          date_add: '2024-01-01',
          sector_id: 'sector1',
          profile_picture: '/path/to/pic.jpg',
          id_class: 'class1'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockStudents });

      const result = await studentService.getStudentsBySector('sector1');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.sector_id = $1'),
        ['sector1']
      );
      expect(result).toEqual(mockStudents);
    });

    it('should throw error when query fails', async () => {
      const dbError = new Error('Sector query failed');
      pool.query.mockRejectedValueOnce(dbError);

      await expect(studentService.getStudentsBySector('sector1')).rejects.toThrow('Sector query failed');
    });
  });
});

// Additional integration-style tests for edge cases
describe('Student Service - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent with missing parameters', () => {
    it('should handle null/undefined parameters', async () => {
      pool.query.mockRejectedValueOnce(new Error('NOT NULL violation'));

      await expect(studentService.createStudent(
        null, 'John Doe', 'CIN123', 'CNE456', 'john@example.com',
        'password', 'class1', 'note', 'student', '/path/img.jpg'
      )).rejects.toThrow('NOT NULL violation');
    });
  });

  describe('updateStudentById with empty fields', () => {
    it('should handle empty fieldsToUpdate object', async () => {
      const result = await studentService.updateStudentById('user1', {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('Database connection issues', () => {
    it('should handle database timeout errors', async () => {
      const timeoutError = new Error('Connection timeout');
      timeoutError.code = 'ETIMEDOUT';
      pool.query.mockRejectedValueOnce(timeoutError);

      await expect(studentService.getAllStudents()).rejects.toThrow('Connection timeout');
    });

    it('should handle database constraint violations', async () => {
      const constraintError = new Error('Duplicate key violation');
      constraintError.code = '23505';
      pool.query.mockRejectedValueOnce(constraintError);

      await expect(studentService.createStudent(
        'user1', 'John Doe', 'CIN123', 'CNE456', 'john@example.com',
        'password', 'class1', 'note', 'student', '/path/img.jpg'
      )).rejects.toThrow('Duplicate key violation');
    });
  });
});