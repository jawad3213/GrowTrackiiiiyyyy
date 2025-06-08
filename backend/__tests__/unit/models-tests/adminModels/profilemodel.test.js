const adminModel = require('../../../../models/adminModels/profileModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Admin Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getprofile', () => {
    it('should return admin profile successfully', async () => {
      // Arrange
      const mockId = 123;
      const mockProfile = {
        profile_picture: 'avatar.jpg',
        full_name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        cin: 'AB123456',
        role: 'admin',
        assigned_zone: 'Zone A'
      };

      pool.query.mockResolvedValue({
        rows: [mockProfile]
      });

      // Act
      const result = await adminModel.getprofile(mockId);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `SELECT m.profile_picture, m.full_name, m.phone, m.email, m.cin, m.role , a.assigned_zone
       FROM public.member m
       JOIN public.admin a ON m.id_member = a.id_member
       WHERE m.id_member = $1
       `,
        [mockId]
      );
      expect(result).toEqual(mockProfile);
    });

    it('should return undefined when no profile found', async () => {
      // Arrange
      const mockId = 999;
      pool.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await adminModel.getprofile(mockId);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const mockId = 123;
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      // Spy on console.error to verify error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(adminModel.getprofile(mockId)).rejects.toThrow('Database connection failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching admin:', mockError);
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should handle null id parameter', async () => {
      // Arrange
      pool.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await adminModel.getprofile(null);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [null]
      );
      expect(result).toBeUndefined();
    });
  });

  describe('updateAdminById', () => {
    it('should update member fields only', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        full_name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'super_admin'
      };
      const mockUpdatedMember = {
        id_member: mockId,
        full_name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'super_admin'
      };

      pool.query.mockResolvedValue({
        rows: [mockUpdatedMember]
      });

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `
          UPDATE public.member
          SET full_name = $1, email = $2, role = $3
          WHERE id_member = $4
          RETURNING *
        `,
        ['Jane Doe', 'jane.doe@example.com', 'super_admin', mockId]
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should update admin fields only', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        assigned_zone: 'Zone B'
      };

      pool.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `
          UPDATE public.admin
          SET assigned_zone = $1
          WHERE id_member = $2
        `,
        ['Zone B', mockId]
      );
      expect(result).toBeNull();
    });

    it('should update both member and admin fields', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        full_name: 'John Smith',
        email: 'john.smith@example.com',
        assigned_zone: 'Zone C'
      };
      const mockUpdatedMember = {
        id_member: mockId,
        full_name: 'John Smith',
        email: 'john.smith@example.com'
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUpdatedMember] }) // member update
        .mockResolvedValueOnce({ rows: [] }); // admin update

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        `
          UPDATE public.member
          SET full_name = $1, email = $2
          WHERE id_member = $3
          RETURNING *
        `,
        ['John Smith', 'john.smith@example.com', mockId]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        `
          UPDATE public.admin
          SET assigned_zone = $1
          WHERE id_member = $2
        `,
        ['Zone C', mockId]
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should handle all member field types', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        full_name: 'Test User',
        cin: 'XY789012',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'moderator',
        description: 'Test description',
        profile_picture: 'new_avatar.jpg'
      };
      const mockUpdatedMember = { id_member: mockId, ...fieldsToUpdate };

      pool.query.mockResolvedValue({
        rows: [mockUpdatedMember]
      });

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `
          UPDATE public.member
          SET full_name = $1, cin = $2, email = $3, password = $4, role = $5, description = $6, profile_picture = $7
          WHERE id_member = $8
          RETURNING *
        `,
        [
          'Test User',
          'XY789012', 
          'test@example.com',
          'hashedpassword',
          'moderator',
          'Test description',
          'new_avatar.jpg',
          mockId
        ]
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should ignore unknown fields', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        full_name: 'Valid Field',
        unknown_field: 'Should be ignored',
        another_unknown: 'Also ignored'
      };
      const mockUpdatedMember = { id_member: mockId, full_name: 'Valid Field' };

      pool.query.mockResolvedValue({
        rows: [mockUpdatedMember]
      });

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `
          UPDATE public.member
          SET full_name = $1
          WHERE id_member = $2
          RETURNING *
        `,
        ['Valid Field', mockId]
      );
      expect(result).toEqual(mockUpdatedMember);
    });

    it('should return null when no fields to update', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        unknown_field: 'value'
      };

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle empty fieldsToUpdate object', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {};

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw error when member update fails', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = { full_name: 'Test' };
      const mockError = new Error('Member update failed');
      pool.query.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(adminModel.updateAdminById(mockId, fieldsToUpdate))
        .rejects.toThrow('Member update failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating admin:', mockError);
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when admin update fails', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = { assigned_zone: 'Zone D' };
      const mockError = new Error('Admin update failed');
      pool.query.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(adminModel.updateAdminById(mockId, fieldsToUpdate))
        .rejects.toThrow('Admin update failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating admin:', mockError);
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should handle member update success but admin update failure', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        full_name: 'Test User',
        assigned_zone: 'Zone E'
      };
      const mockUpdatedMember = { id_member: mockId, full_name: 'Test User' };
      const mockError = new Error('Admin update failed');

      pool.query
        .mockResolvedValueOnce({ rows: [mockUpdatedMember] }) // member update succeeds
        .mockRejectedValueOnce(mockError); // admin update fails

      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(adminModel.updateAdminById(mockId, fieldsToUpdate))
        .rejects.toThrow('Admin update failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating admin:', mockError);
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should handle null and undefined values in fields', async () => {
      // Arrange
      const mockId = 123;
      const fieldsToUpdate = {
        full_name: null,
        description: undefined,
        email: 'test@example.com'
      };
      const mockUpdatedMember = { id_member: mockId };

      pool.query.mockResolvedValue({
        rows: [mockUpdatedMember]
      });

      // Act
      const result = await adminModel.updateAdminById(mockId, fieldsToUpdate);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        `
          UPDATE public.member
          SET full_name = $1, description = $2, email = $3
          WHERE id_member = $4
          RETURNING *
        `,
        [null, undefined, 'test@example.com', mockId]
      );
      expect(result).toEqual(mockUpdatedMember);
    });
  });
});