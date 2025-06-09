const signalModel = require('../../../../models/adminModels/signalModel'); // Adjust path as needed

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Signal Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllSignals', () => {
    it('should return all signals with reporter and reported member info', async () => {
      // Arrange
      const mockSignals = {
        rows: [
          {
            id_signal: 1,
            reporder_picture: 'reporter1.jpg',
            reporder_name: 'John Reporter',
            reporder_role: 'student',
            reported_picture: 'reported1.jpg',
            reported_name: 'Jane Reported',
            reported_role: 'student',
            approved: false,
            solution_state: 'pending'
          },
          {
            id_signal: 2,
            reporder_picture: 'reporter2.jpg',
            reporder_name: 'Bob Reporter',
            reporder_role: 'teacher',
            reported_picture: 'reported2.jpg',
            reported_name: 'Alice Reported',
            reported_role: 'student',
            approved: true,
            solution_state: 'resolved'
          }
        ]
      };

      pool.query.mockResolvedValue(mockSignals);

      // Act
      const result = await signalModel.getAllSignals();

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT')
      );
      expect(result).toEqual(mockSignals);
    });

    it('should handle database error when retrieving signals', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      // Act & Assert
      await expect(signalModel.getAllSignals()).rejects.toThrow('Database connection failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving signals:', mockError);
    });

    it('should return empty result when no signals exist', async () => {
      // Arrange
      const emptyResult = { rows: [] };
      pool.query.mockResolvedValue(emptyResult);

      // Act
      const result = await signalModel.getAllSignals();

      // Assert
      expect(result).toEqual(emptyResult);
      expect(result.rows).toHaveLength(0);
    });
  });

  describe('total', () => {
    it('should return total count of signals from last month', async () => {
      // Arrange
      const mockTotal = { rows: [{ total: '15' }] };
      pool.query.mockResolvedValue(mockTotal);

      // Act
      const result = await signalModel.total();

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(id_signal) AS total 
       FROM public.signal
       WHERE date_add >= CURRENT_DATE - INTERVAL '1 month'
      `
      );
      expect(result).toEqual({ total: '15' });
    });

    it('should return zero when no signals in last month', async () => {
      // Arrange
      const mockTotal = { rows: [{ total: '0' }] };
      pool.query.mockResolvedValue(mockTotal);

      // Act
      const result = await signalModel.total();

      // Assert
      expect(result).toEqual({ total: '0' });
    });

    it('should handle database error when retrieving total', async () => {
      // Arrange
      const mockError = new Error('Database query failed');
      pool.query.mockRejectedValue(mockError);

      // Act & Assert
      await expect(signalModel.total()).rejects.toThrow('Database query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving total number of signals:', mockError);
    });
  });

  describe('getSignalById', () => {
    it('should return signal details by id', async () => {
      // Arrange
      const mockSignal = {
        id_signal: 1,
        reporter_picture: 'reporter.jpg',
        reporter_name: 'John Doe',
        reporter_role: 'student',
        reported_picture: 'reported.jpg',
        reported_name: 'Jane Smith',
        reported_role: 'student',
        submitted_date: '2024-01-15T10:30:00Z',
        reason: 'harassment'
      };

      pool.query.mockResolvedValue({
        rows: [mockSignal]
      });

      // Act
      const result = await signalModel.getSignalById(1);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
      expect(result).toEqual(mockSignal);
    });

    it('should return null when signal not found', async () => {
      // Arrange
      pool.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await signalModel.getSignalById(999);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle database error', async () => {
      // Arrange
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      // Act & Assert
      await expect(signalModel.getSignalById(1)).rejects.toThrow('Database error');
    });
  });

  describe('solution', () => {
    const mockParams = {
      id_signal: 1,
      option_solution: 'counseling',
      details: 'Student needs counseling support',
      name_coach: 'Dr. Johnson',
      start_date: '2024-02-01',
      date_done: '2024-02-15'
    };

    it('should create solution and follow-up successfully', async () => {
      // Arrange
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_member: 101 }] }) // coach query
        .mockResolvedValueOnce({ rows: [{ id_solution: 201 }] }) // solution query
        .mockResolvedValueOnce({ rows: [{ id_reported: 301 }] }) // student query
        .mockResolvedValueOnce({ rows: [] }) // follow_up insert
        .mockResolvedValueOnce({ rows: [] }) // signal update (id_solution)
        .mockResolvedValueOnce({ rows: [] }) // signal update (solution_state)
        .mockResolvedValueOnce({ rows: [] }) // signal update (approved)
        .mockResolvedValueOnce({ rows: [] }); // notification insert

      // Act
      const result = await signalModel.solution(
        mockParams.id_signal,
        mockParams.option_solution, 
        mockParams.details,
        mockParams.name_coach,
        mockParams.start_date,
        mockParams.date_done
      );

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(8);
      
      // Verify coach lookup
      expect(pool.query).toHaveBeenNthCalledWith(1,
        `SELECT id_member FROM public.member WHERE full_name = $1`,
        [mockParams.name_coach]
      );
      
      // Verify solution lookup
      expect(pool.query).toHaveBeenNthCalledWith(2,
        `SELECT id_solution FROM public.solution WHERE option_solution = $1`,
        [mockParams.option_solution]
      );
      
      // Verify student lookup
      expect(pool.query).toHaveBeenNthCalledWith(3,
        `SELECT id_reported FROM public.report WHERE id_signal = $1`,
        [mockParams.id_signal]
      );
      
      // Verify follow-up insert
      expect(pool.query).toHaveBeenNthCalledWith(4,
        `INSERT INTO public.follow_up (id_coach, id_student, id_solution, message, start_date, date_done)
       VALUES ($1, $2, $3, $4, $5, $6)`,
        [101, 301, 201, mockParams.details, mockParams.start_date, mockParams.date_done]
      );
      
      // Verify signal solution update
      expect(pool.query).toHaveBeenNthCalledWith(5,
        `UPDATE public.signal SET id_solution = $1 WHERE id_signal = $2`,
        [201, mockParams.id_signal]
      );
      
      // Verify signal status update
      expect(pool.query).toHaveBeenNthCalledWith(6,
        `UPDATE public.signal SET solution_state = 'in progress' WHERE id_signal = $1`,
        [mockParams.id_signal]
      );
      
      // Verify signal approved update (with corrected boolean syntax)
      expect(pool.query).toHaveBeenNthCalledWith(7,
        `UPDATE public.signal SET approved = 'TRUE' WHERE id_signal = $1`,
        [mockParams.id_signal]
      );
      
      // Verify notification insert
      expect(pool.query).toHaveBeenNthCalledWith(8,
        `INSERT INTO public.notifications(content_notification,id_member) VALUES ($1,$2)`,
        [mockParams.details, 301]
      );
      
      expect(result).toEqual({ message: "Solution created and follow-up inserted successfully." });
    });

    it('should handle error when coach not found', async () => {
      // Arrange
      pool.query.mockResolvedValueOnce({ rows: [] }); // coach not found

      // Act & Assert
      await expect(signalModel.solution(
        mockParams.id_signal,
        mockParams.option_solution,
        mockParams.details,
        'NonexistentCoach',
        mockParams.start_date,
        mockParams.date_done
      )).rejects.toThrow();
    });

    it('should handle error when solution type not found', async () => {
      // Arrange
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_member: 101 }] }) // coach found
        .mockResolvedValueOnce({ rows: [] }); // solution not found

      // Act & Assert
      await expect(signalModel.solution(
        mockParams.id_signal,
        'invalid_solution',
        mockParams.details,
        mockParams.name_coach,
        mockParams.start_date,
        mockParams.date_done
      )).rejects.toThrow();
    });

    it('should handle database error during solution creation', async () => {
      // Arrange
      const mockError = new Error('Database insert failed');
      pool.query.mockRejectedValue(mockError);

      // Act & Assert
      await expect(signalModel.solution(
        mockParams.id_signal,
        mockParams.option_solution,
        mockParams.details,
        mockParams.name_coach,
        mockParams.start_date,
        mockParams.date_done
      )).rejects.toThrow('Database insert failed');
      
      expect(console.error).toHaveBeenCalledWith('Error inserting solution:', mockError);
    });
  });

  describe('sendAlert', () => {
    it('should send alert successfully', async () => {
      // Arrange
      const mockSignalId = 1;
      const mockDetails = 'Alert: Immediate attention required';
      
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_reporter: 101 }] }) // reporter query
        .mockResolvedValueOnce({ rows: [{ id_reported: 201 }] }) // reported query
        .mockResolvedValueOnce({ rows: [] }) // signal update
        .mockResolvedValueOnce({ rows: [] }); // notification insert

      // Act
      const result = await signalModel.sendAlert(mockSignalId, mockDetails);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(4);
      
      // Verify reporter lookup
      expect(pool.query).toHaveBeenNthCalledWith(1,
        `SELECT id_reporter FROM public.report WHERE id_signal = $1`,
        [mockSignalId]
      );
      
      // Verify reported lookup
      expect(pool.query).toHaveBeenNthCalledWith(2,
        `SELECT id_reported FROM public.report WHERE id_signal = $1`,
        [mockSignalId]
      );
      
      // Verify signal status update
      expect(pool.query).toHaveBeenNthCalledWith(3,
        `UPDATE public.signal SET solution_state = 'in progress' WHERE id_signal = $1`,
        [mockSignalId]
      );
      
      // Verify notification insert
      expect(pool.query).toHaveBeenNthCalledWith(4,
        `INSERT INTO public.notifications(content_notification,id_member,id_reporter) VALUES ($1,$2,$3)`,
        [mockDetails, 201, 101]
      );
      
      expect(result).toEqual({ message: "Solution created successfully." });
    });

    it('should handle database error during alert sending', async () => {
      // Arrange
      const mockError = new Error('Alert sending failed');
      pool.query.mockRejectedValue(mockError);

      // Act & Assert
      await expect(signalModel.sendAlert(1, 'Test alert')).rejects.toThrow('Alert sending failed');
      expect(console.error).toHaveBeenCalledWith('Error inserting solution:', mockError);
    });
  });

  describe('deleteSignal', () => {
    it('should delete signal and report successfully', async () => {
      // Arrange
      const mockId = 1;
      const mockResult = { rowCount: 1 };
      
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // report delete
        .mockResolvedValueOnce(mockResult); // signal delete

      // Act
      const result = await signalModel.deleteSignal(mockId);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(2);
      
      // Verify correct SQL with fixed column name
      expect(pool.query).toHaveBeenNthCalledWith(1,
        "DELETE FROM public.report WHERE id_signal = $1",
        [mockId]
      );
      
      expect(pool.query).toHaveBeenNthCalledWith(2,
        "DELETE FROM public.signal WHERE id_signal = $1",
        [mockId]
      );
      
      expect(result).toEqual(mockResult);
    });

    it('should handle database error during deletion', async () => {
      // Arrange
      const mockError = new Error('Delete operation failed');
      pool.query.mockRejectedValue(mockError);

      // Act & Assert
      await expect(signalModel.deleteSignal(1)).rejects.toThrow('Delete operation failed');
      expect(console.error).toHaveBeenCalledWith('Error deleting signal:', mockError);
    });

    it('should handle deletion when signal does not exist', async () => {
      // Arrange
      const mockResult = { rowCount: 0 };
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // report delete (no rows affected)
        .mockResolvedValueOnce(mockResult); // signal delete (no rows affected)

      // Act
      const result = await signalModel.deleteSignal(999);

      // Assert
      expect(result).toEqual(mockResult);
      expect(result.rowCount).toBe(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null parameters gracefully', async () => {
      // Test getSignalById with null
      pool.query.mockResolvedValue({ rows: [] });
      const result = await signalModel.getSignalById(null);
      expect(result).toBeNull();
    });

    it('should handle undefined parameters in solution method', async () => {
      // Arrange
      pool.query.mockRejectedValue(new Error('Invalid parameters'));

      // Act & Assert
      await expect(signalModel.solution(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )).rejects.toThrow();
    });

    it('should handle empty string parameters', async () => {
      // Test sendAlert with empty details
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_reporter: 101 }] })
        .mockResolvedValueOnce({ rows: [{ id_reported: 201 }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await signalModel.sendAlert(1, '');
      expect(result.message).toBe("Solution created successfully.");
    });
  });
});