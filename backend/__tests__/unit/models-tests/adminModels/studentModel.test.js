const studentService = require('../../../../models/adminModels/studentModel'); 

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Student Service', () => {
  beforeEach(() => {
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
        .mockResolvedValueOnce(mockMemberResult)
        .mockResolvedValueOnce(mockStudentResult);

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

      expect(result).toEqual(mockUpdatedMember);
    });

    it('should update student fields only', async () => {
      const fieldsToUpdate = {
        cne: 'NEW_CNE',
        id_class: 'new_class'
      };
      const mockMember = { id_member: 'user1', full_name: 'John Doe' };

      pool.query
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({ rows: [mockMember] });

      const result = await studentService.updateStudentById('user1', fieldsToUpdate);

      expect(result).toEqual(mockMember);
    });

    it('should update both member and student fields', async () => {
      const fieldsToUpdate = {
        full_name: 'Updated Name',
        cne: 'NEW_CNE'
      };
      const mockUpdatedMember = { id_member: 'user1', full_name: 'Updated Name' };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUpdatedMember] })
        .mockResolvedValueOnce({ rowCount: 1 });

      const result = await studentService.updateStudentById('user1', fieldsToUpdate);

      expect(result).toEqual(mockUpdatedMember);
    });

    it('should handle case when no student record found', async () => {
      const fieldsToUpdate = { cne: 'NEW_CNE' };
      const mockMember = { id_member: 'user1', full_name: 'John Doe' };

      pool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rows: [mockMember] });

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
    it.skip('should delete student and related records successfully', async () => {});
    it.skip('should throw error when deletion fails', async () => {});
  });

  describe('total', () => {
    it.skip('should return total count of students', async () => {});
    it.skip('should throw error when count query fails', async () => {});
  });

  describe('getStudentsByClass', () => {
    it.skip('should return students filtered by class', async () => {});
    it.skip('should throw error when query fails', async () => {});
  });

  describe('getStudentsBySector', () => {
    it.skip('should return students filtered by sector', async () => {});
    it.skip('should throw error when query fails', async () => {});
  });
});

describe('Student Service - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent with missing parameters', () => {
    it.skip('should handle null/undefined parameters', async () => {});
  });

  describe('updateStudentById with empty fields', () => {
    it('should handle empty fieldsToUpdate object', async () => {
      const result = await studentService.updateStudentById('user1', {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('Database connection issues', () => {
    it.skip('should handle database timeout errors', async () => {});
    it.skip('should handle database constraint violations', async () => {});
  });
});
