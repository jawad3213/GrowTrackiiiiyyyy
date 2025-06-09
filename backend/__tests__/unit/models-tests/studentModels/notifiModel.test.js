// Mock the db config module first (before any imports)
const mockPool = {
    query: jest.fn()
};

jest.mock('../../../../config/db', () => mockPool);

// Import the module after mocking
const { getAllNotifications } = require('../../../../models/studentModels/notifiModel');

// Mock console.error to avoid cluttering test output
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('getAllNotifications', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Restore console.error
        consoleSpy.mockRestore();
    });

    const mockNotifications = [
        { id_notification: 1, content_notification: 'Test notification 1' },
        { id_notification: 2, content_notification: 'Test notification 2' },
        { id_notification: 3, content_notification: 'Test notification 3' }
    ];

    describe('successful queries', () => {
        it('should return notifications for a valid student ID', async () => {
            // Arrange
            const studentId = 123;
            mockPool.query.mockResolvedValueOnce({ rows: mockNotifications });

            // Act
            const result = await getAllNotifications(studentId);

            // Assert
            expect(mockPool.query).toHaveBeenCalledTimes(1);
            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT id_notification, content_notification FROM public.notifications WHERE id_member = $1 ORDER BY date_notification DESC',
                [studentId]
            );
            expect(result).toEqual(mockNotifications);
            expect(result).toHaveLength(3);
        });

        it('should return empty array when no notifications found', async () => {
            // Arrange
            const studentId = 999;
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            const result = await getAllNotifications(studentId);

            // Assert
            expect(mockPool.query).toHaveBeenCalledTimes(1);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [studentId]
            );
            expect(result).toEqual([]);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return single notification when only one exists', async () => {
            // Arrange
            const studentId = 456;
            const singleNotification = [{ id_notification: 5, content_notification: 'Single notification' }];
            mockPool.query.mockResolvedValueOnce({ rows: singleNotification });

            // Act
            const result = await getAllNotifications(studentId);

            // Assert
            expect(result).toEqual(singleNotification);
            expect(result).toHaveLength(1);
        });
    });

    describe('input parameter handling', () => {
        it('should handle null student ID', async () => {
            // Arrange
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            const result = await getAllNotifications(null);

            // Assert
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [null]
            );
            expect(result).toEqual([]);
        });

        it('should handle undefined student ID', async () => {
            // Arrange
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            const result = await getAllNotifications(undefined);

            // Assert
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [undefined]
            );
            expect(result).toEqual([]);
        });

        it('should handle string student ID', async () => {
            // Arrange
            const stringId = '789';
            mockPool.query.mockResolvedValueOnce({ rows: mockNotifications });

            // Act
            const result = await getAllNotifications(stringId);

            // Assert
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [stringId]
            );
            expect(result).toEqual(mockNotifications);
        });

        it('should handle zero as student ID', async () => {
            // Arrange
            const zeroId = 0;
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            const result = await getAllNotifications(zeroId);

            // Assert
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [zeroId]
            );
            expect(result).toEqual([]);
        });

        it('should handle empty string as student ID', async () => {
            // Arrange
            const emptyString = '';
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            const result = await getAllNotifications(emptyString);

            // Assert
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [emptyString]
            );
            expect(result).toEqual([]);
        });
    });

    describe('error handling', () => {
        it('should throw and log database connection errors', async () => {
            // Arrange
            const studentId = 123;
            const dbError = new Error('Database connection failed');
            mockPool.query.mockRejectedValueOnce(dbError);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow('Database connection failed');
            expect(console.error).toHaveBeenCalledWith('Error retrieving notifications:', dbError);
            expect(console.error).toHaveBeenCalledTimes(1);
        });

        it('should throw and log query syntax errors', async () => {
            // Arrange
            const studentId = 123;
            const syntaxError = new Error('syntax error at or near "SELEC"');
            syntaxError.code = '42601';
            mockPool.query.mockRejectedValueOnce(syntaxError);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow('syntax error at or near "SELEC"');
            expect(console.error).toHaveBeenCalledWith('Error retrieving notifications:', syntaxError);
        });

        it('should throw and log timeout errors', async () => {
            // Arrange
            const studentId = 123;
            const timeoutError = new Error('Connection timeout');
            timeoutError.code = 'ETIMEDOUT';
            mockPool.query.mockRejectedValueOnce(timeoutError);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow('Connection timeout');
            expect(console.error).toHaveBeenCalledWith('Error retrieving notifications:', timeoutError);
        });

        it('should throw and log constraint violation errors', async () => {
            // Arrange
            const studentId = 123;
            const constraintError = new Error('foreign key constraint violation');
            constraintError.code = '23503';
            mockPool.query.mockRejectedValueOnce(constraintError);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow('foreign key constraint violation');
            expect(console.error).toHaveBeenCalledWith('Error retrieving notifications:', constraintError);
        });

        it('should handle generic errors', async () => {
            // Arrange
            const studentId = 123;
            const genericError = new Error('Unknown error');
            mockPool.query.mockRejectedValueOnce(genericError);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow('Unknown error');
            expect(console.error).toHaveBeenCalledWith('Error retrieving notifications:', genericError);
        });
    });

    describe('database response edge cases', () => {
        it('should handle null database result', async () => {
            // Arrange
            const studentId = 123;
            mockPool.query.mockResolvedValueOnce(null);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow();
        });

        it('should handle undefined database result', async () => {
            // Arrange
            const studentId = 123;
            mockPool.query.mockResolvedValueOnce(undefined);

            // Act & Assert
            await expect(getAllNotifications(studentId)).rejects.toThrow();
        });
    });

    describe('query correctness', () => {
        it('should use correct SQL query with proper ordering', async () => {
            // Arrange
            const studentId = 123;
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            await getAllNotifications(studentId);

            // Assert
            const [query] = mockPool.query.mock.calls[0];
            expect(query).toContain('SELECT id_notification, content_notification');
            expect(query).toContain('FROM public.notifications');
            expect(query).toContain('WHERE id_member = $1');
            expect(query).toContain('ORDER BY date_notification DESC');
        });

        it('should pass parameters correctly', async () => {
            // Arrange
            const studentId = 456;
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            await getAllNotifications(studentId);

            // Assert
            const [, params] = mockPool.query.mock.calls[0];
            expect(params).toEqual([studentId]);
            expect(params).toHaveLength(1);
        });
    });

    describe('performance and reliability', () => {
        it('should call database query only once per function call', async () => {
            // Arrange
            const studentId = 123;
            mockPool.query.mockResolvedValueOnce({ rows: mockNotifications });

            // Act
            await getAllNotifications(studentId);

            // Assert
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should not modify original mock data when result is modified', async () => {
            // Arrange
            const studentId = 123;
            const originalData = [{ id_notification: 1, content_notification: 'Original' }];
            // Create a copy for the mock to avoid reference issues
            mockPool.query.mockResolvedValueOnce({ rows: [...originalData] });

            // Act
            const result = await getAllNotifications(studentId);
            
            // Modify the result
            result.push({ id_notification: 999, content_notification: 'Modified' });

            // Assert - verify the function returned the expected data
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id_notification: 1, content_notification: 'Original' });
            expect(result[1]).toEqual({ id_notification: 999, content_notification: 'Modified' });
        });
    });
});