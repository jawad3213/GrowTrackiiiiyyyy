const supervisorModel = require('../../../../models/adminModels/supervisorModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Supervisor Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSupervisor', () => {
    const mockParams = {
      id_user: 'user123',
      name: 'John Doe',
      cin_sepervisor: 'CIN123',
      email: 'john@example.com',
      pass: 'password123',
      company: 'Tech Corp',
      number: 'REG001',
      position: 'Senior Developer',
      cin_student: 'STU123',
      date_start: '2024-01-01',
      date_done: '2024-06-01',
      subject: 'Web Development',
      note: 'Experienced supervisor',
      role: 'supervisor',
      imagePath: '/images/profile.jpg'
    };

    it('should create a supervisor successfully', async () => {
      const mockMemberResult = { rows: [{ id_member: 'user123' }] };
      const mockInternshipResult = { rows: [{ id_internship: 'int123' }] };
      const mockStudentResult = { rows: [{ id_member: 'student123' }] };

      pool.query
        .mockResolvedValueOnce(mockMemberResult) // member insert
        .mockResolvedValueOnce({}) // supervisor insert
        .mockResolvedValueOnce(mockInternshipResult) // internship insert
        .mockResolvedValueOnce(mockStudentResult) // student select
        .mockResolvedValueOnce({}); // supervise insert

      const result = await supervisorModel.createSupervisor(
        mockParams.id_user,
        mockParams.name,
        mockParams.cin_sepervisor,
        mockParams.email,
        mockParams.pass,
        mockParams.company,
        mockParams.number,
        mockParams.position,
        mockParams.cin_student,
        mockParams.date_start,
        mockParams.date_done,
        mockParams.subject,
        mockParams.note,
        mockParams.role,
        mockParams.imagePath
      );

      expect(pool.query).toHaveBeenCalledTimes(5);
      
      // Verify member table insert
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO public.member'),
        [mockParams.id_user, mockParams.name, mockParams.cin_sepervisor, 
         mockParams.email, mockParams.pass, mockParams.role, mockParams.note, mockParams.imagePath]
      );

      // Verify supervisor table insert
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO public.supervisor'),
        [mockParams.id_user, mockParams.number, mockParams.company, mockParams.position]
      );

      // Verify internship table insert
      expect(pool.query).toHaveBeenNthCalledWith(3,
        expect.stringContaining('INSERT INTO public.internship'),
        [mockParams.date_start, mockParams.date_done, mockParams.subject]
      );

      // Verify student selection
      expect(pool.query).toHaveBeenNthCalledWith(4,
        expect.stringContaining('SELECT id_member FROM public.member WHERE cin'),
        [mockParams.cin_student]
      );

      // Verify supervise table insert
      expect(pool.query).toHaveBeenNthCalledWith(5,
        expect.stringContaining('INSERT INTO public.supervise'),
        [mockParams.id_user, 'student123', 'int123']
      );

      expect(result).toEqual({ id_member: 'user123' });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.createSupervisor(
        mockParams.id_user,
        mockParams.name,
        mockParams.cin_sepervisor,
        mockParams.email,
        mockParams.pass,
        mockParams.company,
        mockParams.number,
        mockParams.position,
        mockParams.cin_student,
        mockParams.date_start,
        mockParams.date_done,
        mockParams.subject,
        mockParams.note,
        mockParams.role,
        mockParams.imagePath
      )).rejects.toThrow('Database connection failed');
    });
  });

  describe('getAllSupervisors', () => {
    it('should return all supervisors', async () => {
      const mockSupervisors = [
        {
          id_member: '1',
          cin: 'CIN001',
          full_name: 'John Doe',
          registration_number: 'REG001',
          email: 'john@example.com',
          company: 'Tech Corp',
          position: 'Senior Developer',
          date_add: '2024-01-01',
          profile_picture: '/images/john.jpg'
        },
        {
          id_member: '2',
          cin: 'CIN002',
          full_name: 'Jane Smith',
          registration_number: 'REG002',
          email: 'jane@example.com',
          company: 'Data Inc',
          position: 'Team Lead',
          date_add: '2024-01-02',
          profile_picture: '/images/jane.jpg'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockSupervisors });

      const result = await supervisorModel.getAllSupervisors();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.id_member, m.cin, m.full_name')
      );
      expect(result).toEqual(mockSupervisors);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database query failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.getAllSupervisors()).rejects.toThrow('Database query failed');
    });
  });

  describe('getSupervisorByCin', () => {
    const mockSupervisor = {
      cin: 'CIN123',
      full_name: 'John Doe',
      registration_number: 'REG001',
      email: 'john@example.com',
      company: 'Tech Corp',
      position: 'Senior Developer',
      date_add: '2024-01-01',
      profile_picture: '/images/john.jpg'
    };

    it('should return supervisor by CIN', async () => {
      pool.query.mockResolvedValueOnce({ rows: [mockSupervisor] });

      const result = await supervisorModel.getSupervisorByCin('CIN123');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE m.cin = $1'),
        ['CIN123']
      );
      expect(result).toEqual(mockSupervisor);
    });

    it('should return null when supervisor not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await supervisorModel.getSupervisorByCin('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should handle null result', async () => {
      pool.query.mockResolvedValueOnce(null);

      const result = await supervisorModel.getSupervisorByCin('CIN123');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database query failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.getSupervisorByCin('CIN123')).rejects.toThrow('Database query failed');
    });
  });

  describe('updateSupervisorById', () => {
    const mockUpdatedMember = {
      id_member: 'user123',
      full_name: 'John Updated',
      email: 'john.updated@example.com'
    };

    it('should update member fields only', async () => {
      const fieldsToUpdate = {
        full_name: 'John Updated',
        email: 'john.updated@example.com'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUpdatedMember] });

      const result = await supervisorModel.updateSupervisorById('user123', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE public.member SET'),
        ['John Updated', 'john.updated@example.com', 'user123']
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should update supervisor fields only', async () => {
      const fieldsToUpdate = {
        company: 'New Company',
        position: 'New Position'
      };

      pool.query.mockResolvedValueOnce({});

      const result = await supervisorModel.updateSupervisorById('user123', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE public.supervisor SET'),
        ['New Company', 'New Position', 'user123']
      );
      expect(result).toBeNull();
    });

    it('should update internship fields when id_internship is provided', async () => {
      const fieldsToUpdate = {
        date_start: '2024-02-01',
        subject_internship: 'New Subject',
        id_internship: 'int123'
      };

      pool.query.mockResolvedValueOnce({});

      await supervisorModel.updateSupervisorById('user123', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE public.internship SET'),
        ['2024-02-01', 'New Subject', 'int123']
      );
    });

    it('should update multiple tables', async () => {
      const fieldsToUpdate = {
        full_name: 'John Updated',
        company: 'New Company',
        date_start: '2024-02-01',
        id_internship: 'int123'
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUpdatedMember] }) // member update
        .mockResolvedValueOnce({}) // supervisor update
        .mockResolvedValueOnce({}); // internship update

      const result = await supervisorModel.updateSupervisorById('user123', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should handle empty fields', async () => {
      const result = await supervisorModel.updateSupervisorById('user123', {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Update failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.updateSupervisorById('user123', { full_name: 'Test' }))
        .rejects.toThrow('Update failed');
    });
  });

  describe('deleteSupervisorById', () => {
    it('should delete supervisor and related records', async () => {
      const mockResult = { rowCount: 1 };
      pool.query
        .mockResolvedValueOnce({}) // delete from supervise
        .mockResolvedValueOnce({}) // delete from supervisor
        .mockResolvedValueOnce(mockResult); // delete from member

      const result = await supervisorModel.deleteSupervisorById('user123');

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'DELETE FROM public.supervise WHERE id_supervisor = $1',
        ['user123']
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'DELETE FROM public.supervisor WHERE id_member = $1',
        ['user123']
      );
      expect(pool.query).toHaveBeenNthCalledWith(3,
        'DELETE FROM public.member WHERE id_member = $1',
        ['user123']
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors', async () => {
      const error = new Error('Delete failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.deleteSupervisorById('user123')).rejects.toThrow('Delete failed');
    });
  });

  describe('total', () => {
    it('should return total count of supervisors', async () => {
      const mockResult = { rows: [{ total: '5' }] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await supervisorModel.total();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(id_member) AS total FROM public.supervisor'
      );
      expect(result).toEqual({ total: '5' });
    });

    it('should handle database errors', async () => {
      const error = new Error('Count query failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.total()).rejects.toThrow('Count query failed');
    });
  });

  describe('getSupervisorsByPosition', () => {
    const mockSupervisors = [
      {
        cin: 'CIN001',
        full_name: 'John Doe',
        registration_number: 'REG001',
        email: 'john@example.com',
        company: 'Tech Corp',
        position: 'Senior Developer',
        date_add: '2024-01-01',
        profile_picture: '/images/john.jpg'
      }
    ];

    it('should return supervisors by position', async () => {
      pool.query.mockResolvedValueOnce({ rows: mockSupervisors });

      const result = await supervisorModel.getSupervisorsByPosition('Senior Developer');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE s.position = $1'),
        ['Senior Developer']
      );
      expect(result).toEqual(mockSupervisors);
    });

    it('should return empty array when no supervisors found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await supervisorModel.getSupervisorsByPosition('Nonexistent Position');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Query failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.getSupervisorsByPosition('Senior Developer'))
        .rejects.toThrow('Query failed');
    });
  });

  describe('getSupervisorsByCompany', () => {
    const mockSupervisors = [
      {
        cin: 'CIN001',
        full_name: 'John Doe',
        registration_number: 'REG001',
        email: 'john@example.com',
        company: 'Tech Corp',
        position: 'Senior Developer',
        date_add: '2024-01-01',
        profile_picture: '/images/john.jpg'
      }
    ];

    it('should return supervisors by company', async () => {
      pool.query.mockResolvedValueOnce({ rows: mockSupervisors });

      const result = await supervisorModel.getSupervisorsByCompany('Tech Corp');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE s.company = $1'),
        ['Tech Corp']
      );
      expect(result).toEqual(mockSupervisors);
    });

    it('should return empty array when no supervisors found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await supervisorModel.getSupervisorsByCompany('Nonexistent Company');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Query failed');
      pool.query.mockRejectedValueOnce(error);

      await expect(supervisorModel.getSupervisorsByCompany('Tech Corp'))
        .rejects.toThrow('Query failed');
    });
  });
});

// Additional integration-like tests
describe('Supervisor Model Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log errors to console', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    pool.query.mockRejectedValueOnce(error);

    await expect(supervisorModel.getAllSupervisors()).rejects.toThrow('Test error');
    
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching supervisors:', error);
    
    consoleSpy.mockRestore();
  });

  it('should handle SQL injection attempts safely', async () => {
    const maliciousInput = "'; DROP TABLE supervisors; --";
    pool.query.mockResolvedValueOnce({ rows: [] });

    await supervisorModel.getSupervisorByCin(maliciousInput);

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      [maliciousInput] // Should be passed as parameter, not concatenated
    );
  });
});