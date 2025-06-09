const professorModel = require('../../../../models/adminModels/professorModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
}));

const pool = require('../../../../config/db');

describe('Professor Model', () => {
  let mockClient;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a mock client with all necessary methods
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    // Setup pool.connect to return our mock client
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('createProfessor', () => {
    const mockProfessorData = {
      id_user: 'prof123',
      name: 'John Doe',
      cin: 'AB123456',
      email: 'john.doe@university.edu',
      pass: 'hashedPassword',
      departement: 'Computer Science',
      courses: ['Math', 'Physics'],
      code: 'PROF001',
      classes: ['CS101', 'CS102'],
      note: 'Experienced professor',
      role: 'professor',
      imagePath: '/images/prof.jpg'
    };

    it('should create a professor successfully', async () => {
      const mockMemberResult = { rows: [{ id_member: 'prof123' }] };
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN transaction
        .mockResolvedValueOnce(mockMemberResult) // INSERT member
        .mockResolvedValueOnce(undefined) // INSERT professor
        .mockResolvedValueOnce(undefined) // INSERT teach (first iteration)
        .mockResolvedValueOnce(undefined) // INSERT teach (second iteration)
        .mockResolvedValueOnce(undefined); // COMMIT transaction

      const result = await professorModel.createProfessor(
        mockProfessorData.id_user,
        mockProfessorData.name,
        mockProfessorData.cin,
        mockProfessorData.email,
        mockProfessorData.pass,
        mockProfessorData.departement,
        mockProfessorData.courses,
        mockProfessorData.code,
        mockProfessorData.classes,
        mockProfessorData.note,
        mockProfessorData.role,
        mockProfessorData.imagePath
      );

      expect(pool.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledTimes(6);
      expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(mockClient.query).toHaveBeenNthCalledWith(6, 'COMMIT');
      expect(mockClient.release).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id_member: 'prof123' });
    });

    it('should rollback transaction on error', async () => {
      const error = new Error('Database error');
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN transaction
        .mockRejectedValueOnce(error); // INSERT member fails

      await expect(
        professorModel.createProfessor(
          mockProfessorData.id_user,
          mockProfessorData.name,
          mockProfessorData.cin,
          mockProfessorData.email,
          mockProfessorData.pass,
          mockProfessorData.departement,
          mockProfessorData.courses,
          mockProfessorData.code,
          mockProfessorData.classes,
          mockProfessorData.note,
          mockProfessorData.role,
          mockProfessorData.imagePath
        )
      ).rejects.toThrow('Database error');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });

    it('should handle empty classes and courses arrays', async () => {
      const mockMemberResult = { rows: [{ id_member: 'prof123' }] };
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(mockMemberResult) // INSERT member
        .mockResolvedValueOnce(undefined) // INSERT professor
        .mockResolvedValueOnce(undefined); // COMMIT

      await professorModel.createProfessor(
        mockProfessorData.id_user,
        mockProfessorData.name,
        mockProfessorData.cin,
        mockProfessorData.email,
        mockProfessorData.pass,
        mockProfessorData.departement,
        [], // empty courses
        mockProfessorData.code,
        [], // empty classes
        mockProfessorData.note,
        mockProfessorData.role,
        mockProfessorData.imagePath
      );

      expect(mockClient.query).toHaveBeenCalledTimes(4); // No teach inserts
    });
  });

  describe('getAllProfessor', () => {
    it('should return all professors', async () => {
      const mockProfessors = [
        {
          id_member: 'prof1',
          cin: 'AB123456',
          full_name: 'John Doe',
          code: 'PROF001',
          email: 'john@university.edu',
          department: 'Computer Science',
          id_class: 'CS101',
          date_add: '2024-01-01',
          profile_picture: '/images/prof1.jpg'
        },
        {
          id_member: 'prof2',
          cin: 'CD789012',
          full_name: 'Jane Smith',
          code: 'PROF002',
          email: 'jane@university.edu',
          department: 'Mathematics',
          id_class: 'MATH101',
          date_add: '2024-01-02',
          profile_picture: '/images/prof2.jpg'
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProfessors });

      const result = await professorModel.getAllProfessor();

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.id_member, m.cin, m.full_name')
      );
      expect(result).toEqual(mockProfessors);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      pool.query.mockRejectedValue(error);

      await expect(professorModel.getAllProfessor()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getProfessorByCin', () => {
    it('should return professor by CIN', async () => {
      const mockProfessor = {
        id_member: 'prof1',
        cin: 'AB123456',
        full_name: 'John Doe',
        code: 'PROF001',
        email: 'john@university.edu',
        department: 'Computer Science',
        id_class: 'CS101',
        date_add: '2024-01-01',
        profile_picture: '/images/prof1.jpg'
      };

      pool.query.mockResolvedValue({ rows: [mockProfessor] });

      const result = await professorModel.getProfessorByCin('AB123456');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE m.cin = $1'),
        ['AB123456']
      );
      expect(result).toEqual(mockProfessor);
    });

    it('should return null when professor not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await professorModel.getProfessorByCin('NOTFOUND');

      expect(result).toBeNull();
    });

    it('should return null when result is null', async () => {
      pool.query.mockResolvedValue(null);

      const result = await professorModel.getProfessorByCin('AB123456');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValue(error);

      await expect(professorModel.getProfessorByCin('AB123456')).rejects.toThrow('Database error');
    });
  });

  describe('updateProfessorById', () => {
    it('should update member fields only', async () => {
      const fieldsToUpdate = {
        full_name: 'Updated Name',
        email: 'updated@university.edu'
      };
      const mockUpdatedMember = { id_member: 'prof1', ...fieldsToUpdate };

      pool.query.mockResolvedValue({ rows: [mockUpdatedMember] });

      const result = await professorModel.updateProfessorById('prof1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.member SET full_name = $1, email = $2 WHERE id_member = $3 RETURNING *',
        ['Updated Name', 'updated@university.edu', 'prof1']
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should update professor fields only', async () => {
      const fieldsToUpdate = {
        department: 'Updated Department',
        code: 'NEWCODE'
      };

      pool.query.mockResolvedValue({ rows: [] });

      const result = await professorModel.updateProfessorById('prof1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.professor SET department = $1, code = $2 WHERE id_member = $3',
        ['Updated Department', 'NEWCODE', 'prof1']
      );
      expect(result).toBeNull();
    });

    it('should update teach fields only', async () => {
      const fieldsToUpdate = {
        id_class: 'NEWCLASS',
        course: 'New Course'
      };

      pool.query.mockResolvedValue({ rows: [] });

      const result = await professorModel.updateProfessorById('prof1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.teach SET id_class = $1, course = $2 WHERE id_member = $3',
        ['NEWCLASS', 'New Course', 'prof1']
      );
      expect(result).toBeNull();
    });

    it('should update multiple tables', async () => {
      const fieldsToUpdate = {
        full_name: 'Updated Name',
        department: 'Updated Department',
        id_class: 'NEWCLASS'
      };
      const mockUpdatedMember = { id_member: 'prof1', full_name: 'Updated Name' };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUpdatedMember] }) // member update
        .mockResolvedValueOnce({ rows: [] }) // professor update
        .mockResolvedValueOnce({ rows: [] }); // teach update

      const result = await professorModel.updateProfessorById('prof1', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should handle empty fieldsToUpdate', async () => {
      const result = await professorModel.updateProfessorById('prof1', {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Update failed');
      pool.query.mockRejectedValue(error);

      await expect(
        professorModel.updateProfessorById('prof1', { full_name: 'Test' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteProfessorById', () => {
    it('should delete professor and related records', async () => {
      const mockResult = { rowCount: 1 };
      pool.query
        .mockResolvedValueOnce(mockResult) // DELETE from teach
        .mockResolvedValueOnce(mockResult) // DELETE from professor
        .mockResolvedValueOnce(mockResult); // DELETE from member

      const result = await professorModel.deleteProfessorById('prof1');

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(pool.query).toHaveBeenNthCalledWith(1, 
        'DELETE FROM public.teach WHERE id_member = $1', ['prof1']);
      expect(pool.query).toHaveBeenNthCalledWith(2, 
        'DELETE FROM public.professor WHERE id_member = $1', ['prof1']);
      expect(pool.query).toHaveBeenNthCalledWith(3, 
        'DELETE FROM public.member WHERE id_member = $1', ['prof1']);
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors', async () => {
      const error = new Error('Delete failed');
      pool.query.mockRejectedValue(error);

      await expect(professorModel.deleteProfessorById('prof1')).rejects.toThrow('Delete failed');
    });
  });

  describe('total', () => {
    it('should return total count of professors', async () => {
      const mockTotal = { Total: '5' };
      pool.query.mockResolvedValue({ rows: [mockTotal] });

      const result = await professorModel.total();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(id_member) AS Total FROM public.professor'
      );
      expect(result).toEqual(mockTotal);
    });

    it('should handle database errors', async () => {
      const error = new Error('Count failed');
      pool.query.mockRejectedValue(error);

      await expect(professorModel.total()).rejects.toThrow('Count failed');
    });
  });

  describe('getProfessorsByClass', () => {
    it('should return professors by class', async () => {
      const mockProfessors = [
        {
          cin: 'AB123456',
          full_name: 'John Doe',
          code: 'PROF001',
          email: 'john@university.edu',
          department: 'Computer Science',
          id_class: 'CS101',
          date_add: '2024-01-01',
          profile_picture: '/images/prof1.jpg'
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProfessors });

      const result = await professorModel.getProfessorsByClass('CS101');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.id_class = $1'),
        ['CS101']
      );
      expect(result).toEqual(mockProfessors);
    });

    it('should handle database errors', async () => {
      const error = new Error('Query failed');
      pool.query.mockRejectedValue(error);

      await expect(professorModel.getProfessorsByClass('CS101')).rejects.toThrow('Query failed');
    });
  });

  describe('getStudentsBySector', () => {
    it('should return professors by sector', async () => {
      const mockProfessors = [
        {
          cin: 'AB123456',
          full_name: 'John Doe',
          code: 'PROF001',
          email: 'john@university.edu',
          department: 'Computer Science',
          id_class: 'CS101',
          date_add: '2024-01-01',
          profile_picture: '/images/prof1.jpg'
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProfessors });

      const result = await professorModel.getStudentsBySector('TECH');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE s.id_sector = $1'),
        ['TECH']
      );
      expect(result).toEqual(mockProfessors);
    });

    it('should handle database errors', async () => {
      const error = new Error('Query failed');
      pool.query.mockRejectedValue(error);

      await expect(professorModel.getStudentsBySector('TECH')).rejects.toThrow('Query failed');
    });
  });
});

// Additional integration-style tests
describe('Professor Model Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle concurrent operations', async () => {
    const mockResult = { rows: [{ id_member: 'prof1' }] };
    pool.query.mockResolvedValue(mockResult);

    const promises = [
      professorModel.getAllProfessor(),
      professorModel.getProfessorByCin('AB123456'),
      professorModel.total()
    ];

    const results = await Promise.all(promises);

    expect(results).toHaveLength(3);
    expect(pool.query).toHaveBeenCalledTimes(3);
  });

  it('should handle edge cases with null/undefined parameters', async () => {
    // For getProfessorByCin with null - it will return null (not throw)
    pool.query.mockResolvedValue({ rows: [] });
    const result = await professorModel.getProfessorByCin(null);
    expect(result).toBeNull();

    // For updateProfessorById with null id but empty fields - it returns null
    const updateResult = await professorModel.updateProfessorById(null, {});
    expect(updateResult).toBeNull();

    // For deleteProfessorById with null - it will execute the queries
    pool.query.mockResolvedValue({ rowCount: 0 });
    const deleteResult = await professorModel.deleteProfessorById(null);
    expect(deleteResult).toBeDefined();
  });
});