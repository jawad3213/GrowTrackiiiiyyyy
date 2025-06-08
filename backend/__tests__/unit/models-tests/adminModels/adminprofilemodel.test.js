const ProfileModel = require('../../../../models/adminModels/AdminProfile_Model'); 

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('ProfileModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('picture_model', () => {
    it('should return profile picture URL when user exists', async () => {
      const mockResult = {
        rows: [{ profile_picture: 'https://example.com/profile/user123.jpg' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.picture_model(123);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        [123]
      );
      expect(result).toBe('https://example.com/profile/user123.jpg');
    });

    it('should return null when user has no profile picture', async () => {
      const mockResult = {
        rows: [{ profile_picture: null }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.picture_model(456);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        [456]
      );
      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      const mockResult = {
        rows: []
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.picture_model(999);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        [999]
      );
      expect(result).toBeNull();
    });

    it('should handle string IDs', async () => {
      const mockResult = {
        rows: [{ profile_picture: 'path/to/image.png' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.picture_model('789');

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        ['789']
      );
      expect(result).toBe('path/to/image.png');
    });

    it('should handle empty string as profile picture', async () => {
      const mockResult = {
        rows: [{ profile_picture: '' }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.picture_model(100);

      // Empty string is falsy, so || null will return null
      expect(result).toBeNull();
    });

    it('should handle database error', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(ProfileModel.picture_model(123))
        .rejects.toThrow('Database connection failed');

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        [123]
      );
    });

    it('should handle undefined/null ID parameter', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const resultUndefined = await ProfileModel.picture_model(undefined);
      const resultNull = await ProfileModel.picture_model(null);

      expect(resultUndefined).toBeNull();
      expect(resultNull).toBeNull();
    });
  });

  describe('personnal_information_model', () => {
    it('should return complete personal information when admin user exists', async () => {
      const mockResult = {
        rows: [{
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: 'admin',
          cin: 'AB123456',
          assigned_zone: 'North Region'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(123);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT p.full_name, p.email, p.phone, p.role, p.cin, f.assigned_zone
     FROM public.member p
     JOIN public.admin f ON p.id_member = f.id_member
     WHERE p.id_member = $1`,
        [123]
      );
      expect(result).toEqual({
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: 'admin',
        cin: 'AB123456',
        assigned_zone: 'North Region'
      });
    });

    it('should return null when user does not exist', async () => {
      const mockResult = {
        rows: []
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(999);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT p.full_name, p.email, p.phone, p.role, p.cin, f.assigned_zone
     FROM public.member p
     JOIN public.admin f ON p.id_member = f.id_member
     WHERE p.id_member = $1`,
        [999]
      );
      expect(result).toBeNull();
    });

    it('should return null when user is not an admin (JOIN fails)', async () => {
      const mockResult = {
        rows: []
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(456);

      expect(result).toBeNull();
    });

    it('should handle partial information with null values', async () => {
      const mockResult = {
        rows: [{
          full_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: null,
          role: 'admin',
          cin: null,
          assigned_zone: 'South Region'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(789);

      expect(result).toEqual({
        full_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: null,
        role: 'admin',
        cin: null,
        assigned_zone: 'South Region'
      });
    });

    it('should handle string ID parameter', async () => {
      const mockResult = {
        rows: [{
          full_name: 'Admin User',
          email: 'admin@test.com',
          phone: '123-456-7890',
          role: 'admin',
          cin: 'XY789012',
          assigned_zone: 'Central Region'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model('555');

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT p.full_name, p.email, p.phone, p.role, p.cin, f.assigned_zone
     FROM public.member p
     JOIN public.admin f ON p.id_member = f.id_member
     WHERE p.id_member = $1`,
        ['555']
      );
      expect(result.full_name).toBe('Admin User');
    });

    it('should handle database connection error', async () => {
      const mockError = new Error('Connection timeout');
      pool.query.mockRejectedValue(mockError);

      await expect(ProfileModel.personnal_information_model(123))
        .rejects.toThrow('Connection timeout');

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT p.full_name, p.email, p.phone, p.role, p.cin, f.assigned_zone
     FROM public.member p
     JOIN public.admin f ON p.id_member = f.id_member
     WHERE p.id_member = $1`,
        [123]
      );
    });

    it('should handle SQL error (table not found)', async () => {
      const mockError = new Error('relation "public.admin" does not exist');
      pool.query.mockRejectedValue(mockError);

      await expect(ProfileModel.personnal_information_model(123))
        .rejects.toThrow('relation "public.admin" does not exist');
    });

    it('should handle empty strings in returned data', async () => {
      const mockResult = {
        rows: [{
          full_name: '',
          email: '',
          phone: '',
          role: 'admin',
          cin: '',
          assigned_zone: ''
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(100);

      expect(result).toEqual({
        full_name: '',
        email: '',
        phone: '',
        role: 'admin',
        cin: '',
        assigned_zone: ''
      });
    });

    it('should handle undefined/null ID parameter', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const resultUndefined = await ProfileModel.personnal_information_model(undefined);
      const resultNull = await ProfileModel.personnal_information_model(null);

      expect(resultUndefined).toBeNull();
      expect(resultNull).toBeNull();
    });

    it('should handle special characters in returned data', async () => {
      const mockResult = {
        rows: [{
          full_name: 'José María González',
          email: 'jose.maria@example.com',
          phone: '+34-123-456-789',
          role: 'admin',
          cin: 'ES-12345678-A',
          assigned_zone: 'Región Especial'
        }]
      };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(200);

      expect(result.full_name).toBe('José María González');
      expect(result.assigned_zone).toBe('Región Especial');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle concurrent calls to both functions', async () => {
      // Setup mocks for both functions
      pool.query
        .mockResolvedValueOnce({ rows: [{ profile_picture: 'pic.jpg' }] })
        .mockResolvedValueOnce({ 
          rows: [{ 
            full_name: 'Test User', 
            email: 'test@example.com',
            phone: '123456789',
            role: 'admin',
            cin: 'AB123',
            assigned_zone: 'Test Zone'
          }] 
        });

      const [pictureResult, infoResult] = await Promise.all([
        ProfileModel.picture_model(123),
        ProfileModel.personnal_information_model(123)
      ]);

      expect(pictureResult).toBe('pic.jpg');
      expect(infoResult.full_name).toBe('Test User');
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should handle mixed success/failure scenarios', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ profile_picture: 'success.jpg' }] })
        .mockRejectedValueOnce(new Error('Database error'));

      const pictureResult = await ProfileModel.picture_model(123);
      
      expect(pictureResult).toBe('success.jpg');
      
      await expect(ProfileModel.personnal_information_model(123))
        .rejects.toThrow('Database error');
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle very large ID numbers', async () => {
      const largeId = 999999999999;
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.picture_model(largeId);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        [largeId]
      );
      expect(result).toBeNull();
    });

    it('should handle negative ID numbers', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await ProfileModel.personnal_information_model(-1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [-1]
      );
      expect(result).toBeNull();
    });

    it('should handle zero as ID', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const pictureResult = await ProfileModel.picture_model(0);
      const infoResult = await ProfileModel.personnal_information_model(0);

      expect(pictureResult).toBeNull();
      expect(infoResult).toBeNull();
    });
  });
});