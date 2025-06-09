// __tests__/dbFunctions.test.js

// Mock the database pool before importing the module
jest.mock('../../../../config/db', () => ({
    query: jest.fn(),
    connect: jest.fn()
}));

const pool = require('../../../../config/db');
const {
    getNombreProjets,
    getProjects,
    getMemberProject,
    addSignal,
    getSkillName,
    setEvaluation
} = require('../../../../models/studentModels/projectModel'); 
describe('Database Functions', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getNombreProjets', () => {
        it('should return project count for a student', async () => {
            // Mock the database response
            const mockResult = {
                rows: [{ count: '5' }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await getNombreProjets(123);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT COUNT(t.id_project )'),
                [123]
            );
            expect(result).toEqual({ count: '5' });
        });

        it('should handle database errors', async () => {
            const mockError = new Error('Database connection failed');
            pool.query.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(getNombreProjets(123)).rejects.toThrow('Database connection failed');
            
            expect(consoleSpy).toHaveBeenCalledWith('erreur dans getNombreProjets', mockError);
            consoleSpy.mockRestore();
        });
    });

    describe('getProjects', () => {
        it('should return all projects for a student', async () => {
            const mockProjects = {
                rows: [
                    {
                        id_project: 1,
                        name_project: 'Test Project',
                        professor_name: 'Dr. Smith',
                        module: 'Computer Science',
                        team_name: 'Team Alpha',
                        deadline: '2024-12-31'
                    },
                    {
                        id_project: 2,
                        name_project: 'Another Project',
                        professor_name: 'Dr. Johnson',
                        module: 'Mathematics',
                        team_name: 'Team Beta',
                        deadline: '2024-11-30'
                    }
                ]
            };
            pool.query.mockResolvedValue(mockProjects);

            const result = await getProjects(123);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT  p.id_project, p.name_project'),
                [123]
            );
            expect(result).toEqual(mockProjects.rows);
            expect(result).toHaveLength(2);
        });

        it('should handle database errors', async () => {
            const mockError = new Error('Query failed');
            pool.query.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(getProjects(123)).rejects.toThrow('Query failed');
            
            expect(consoleSpy).toHaveBeenCalledWith('erreur dans getProjects', mockError);
            consoleSpy.mockRestore();
        });
    });

    describe('getMemberProject', () => {
        it('should return team members for a project', async () => {
            const mockTeam = {
                rows: [{ id_team: 456 }]
            };
            const mockMembers = {
                rows: [
                    { id_member: 1, full_name: 'John Doe' },
                    { id_member: 2, full_name: 'Jane Smith' }
                ]
            };

            pool.query
                .mockResolvedValueOnce(mockTeam)  // First call for team
                .mockResolvedValueOnce(mockMembers); // Second call for members

            const result = await getMemberProject(123, 789);

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(pool.query).toHaveBeenNthCalledWith(1,
                expect.stringContaining('SELECT t.id_team'),
                [123, 789]
            );
            expect(pool.query).toHaveBeenNthCalledWith(2,
                expect.stringContaining('SELECT m.id_member, m.full_name'),
                [456]
            );
            expect(result).toEqual(mockMembers.rows);
        });

        it('should handle case when team is not found', async () => {
            const mockEmptyTeam = { rows: [] };
            const mockMembers = { rows: [] };

            pool.query
                .mockResolvedValueOnce(mockEmptyTeam)
                .mockResolvedValueOnce(mockMembers);

            const result = await getMemberProject(123, 789);

            expect(result).toEqual([]);
        });

        it('should handle database errors', async () => {
            const mockError = new Error('Connection timeout');
            pool.query.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(getMemberProject(123, 789)).rejects.toThrow('Connection timeout');
            
            expect(consoleSpy).toHaveBeenCalledWith('erreur dans getMemberProjects', mockError);
            consoleSpy.mockRestore();
        });
    });

    describe('addSignal', () => {
        it('should add a signal and report successfully', async () => {
            const mockSignal = {
                rows: [{ id_signal: 'signal123' }]
            };
            const mockReport = { rows: [] };

            pool.query
                .mockResolvedValueOnce(mockSignal)  // INSERT INTO signal
                .mockResolvedValueOnce(mockReport); // INSERT INTO report

            const result = await addSignal(123, 456, 'Harassment', 'Inappropriate behavior', true);

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(pool.query).toHaveBeenNthCalledWith(1,
                expect.stringContaining('INSERT INTO public.signal'),
                [123, 'Inappropriate behavior', true, 'Harassment']
            );
            expect(pool.query).toHaveBeenNthCalledWith(2,
                expect.stringContaining('INSERT INTO public.report'),
                [123, 456, 'signal123']
            );
            expect(result).toEqual({ id_signal: 'signal123' });
        });

        it('should handle database errors during signal insertion', async () => {
            const mockError = new Error('Constraint violation');
            pool.query.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(addSignal(123, 456, 'Title', 'Description', false))
                .rejects.toThrow('Constraint violation');
            
            expect(consoleSpy).toHaveBeenCalledWith('Error adding signal:', mockError);
            consoleSpy.mockRestore();
        });
    });

    describe('getSkillName', () => {
        it('should return all skill names', async () => {
            const mockSkills = {
                rows: [
                    { skill_name: 'JavaScript' },
                    { skill_name: 'Python' },
                    { skill_name: 'Communication' }
                ]
            };
            pool.query.mockResolvedValue(mockSkills);

            const result = await getSkillName();

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT skill_name FROM public.skill')
            );
            expect(result).toEqual(mockSkills.rows);
            expect(result).toHaveLength(3);
        });

        it('should handle database errors', async () => {
            const mockError = new Error('Table not found');
            pool.query.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(getSkillName()).rejects.toThrow('Table not found');
            
            expect(consoleSpy).toHaveBeenCalledWith('erreur dans getskillName', mockError);
            consoleSpy.mockRestore();
        });
    });

    describe('setEvaluation', () => {
        let mockClient;

        beforeEach(() => {
            mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };
            pool.connect.mockResolvedValue(mockClient);
        });

        it('should create evaluation with ratings successfully', async () => {
            const mockEvaluationResult = {
                rows: [{ id_evaluation: 'eval123' }]
            };

            mockClient.query
                .mockResolvedValueOnce() // BEGIN
                .mockResolvedValueOnce(mockEvaluationResult) // INSERT INTO skill_evaluation
                .mockResolvedValueOnce() // INSERT INTO evaluations (first rating)
                .mockResolvedValueOnce() // INSERT INTO evaluations (second rating)
                .mockResolvedValueOnce(); // COMMIT

            const ratings = [
                { rate: 4, skillName: 'JavaScript' },
                { rate: 5, skillName: 'Teamwork' }
            ];

            const result = await setEvaluation(123, 456, ratings, 789, 'Good work');

            expect(mockClient.query).toHaveBeenCalledTimes(5);
            expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
            expect(mockClient.query).toHaveBeenNthCalledWith(2,
                expect.stringContaining('INSERT INTO public.skill_evaluation'),
                [expect.closeTo(2.7, 5), 'Pair', 'Good work', 456, 789, 123, 'project'] // (4+5)*0.3 = 2.7
            );
            expect(mockClient.query).toHaveBeenNthCalledWith(5, 'COMMIT');
            expect(mockClient.release).toHaveBeenCalled();
            expect(result).toEqual({ success: true });
        });

        it('should rollback transaction on error', async () => {
            const mockError = new Error('Transaction failed');
            
            mockClient.query
                .mockResolvedValueOnce() // BEGIN
                .mockRejectedValueOnce(mockError); // INSERT fails

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const ratings = [{ rate: 3, skillName: 'Python' }];

            await expect(setEvaluation(123, 456, ratings, 789, 'Test'))
                .rejects.toThrow('Transaction failed');

            expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
            expect(mockClient.release).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Erreur dans setEvaluation', mockError);
            consoleSpy.mockRestore();
        });

        it('should calculate total rating correctly', async () => {
            const mockEvaluationResult = {
                rows: [{ id_evaluation: 'eval123' }]
            };

            mockClient.query
                .mockResolvedValueOnce() // BEGIN
                .mockResolvedValueOnce(mockEvaluationResult) // INSERT INTO skill_evaluation
                .mockResolvedValueOnce() // INSERT INTO evaluations (rating 1)
                .mockResolvedValueOnce() // INSERT INTO evaluations (rating 2)
                .mockResolvedValueOnce() // INSERT INTO evaluations (rating 3)
                .mockResolvedValueOnce(); // COMMIT

            const ratings = [
                { rate: 2, skillName: 'Skill1' },
                { rate: 4, skillName: 'Skill2' },
                { rate: 4, skillName: 'Skill3' }
            ];

            await setEvaluation(123, 456, ratings, 789, 'Test evaluation');

            // Total should be (2+4+4)*0.3 = 3.0
            expect(mockClient.query).toHaveBeenNthCalledWith(2,
                expect.stringContaining('INSERT INTO public.skill_evaluation'),
                expect.arrayContaining([expect.closeTo(3.0, 5)])
            );
        });

        it('should release client even if rollback fails', async () => {
            const mockError = new Error('Primary error');
            const rollbackError = new Error('Rollback error');
            
            mockClient.query
                .mockResolvedValueOnce() // BEGIN
                .mockRejectedValueOnce(mockError) // INSERT fails
                .mockRejectedValueOnce(rollbackError); // ROLLBACK fails

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const ratings = [{ rate: 3, skillName: 'Test' }];

            // The original error should be thrown, not the rollback error
            await expect(setEvaluation(123, 456, ratings, 789, 'Test'))
                .rejects.toThrow('Primary error');

            expect(mockClient.release).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});

// Integration-style tests (optional)
describe('Database Functions Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle multiple function calls in sequence', async () => {
        // Mock responses for a complete workflow
        pool.query
            .mockResolvedValueOnce({ rows: [{ count: '3' }] }) // getNombreProjets
            .mockResolvedValueOnce({ rows: [{ id_project: 1, name_project: 'Test' }] }) // getProjects
            .mockResolvedValueOnce({ rows: [{ skill_name: 'JavaScript' }] }); // getSkillName

        const projectCount = await getNombreProjets(123);
        const projects = await getProjects(123);
        const skills = await getSkillName();

        expect(projectCount).toEqual({ count: '3' });
        expect(projects).toHaveLength(1);
        expect(skills).toHaveLength(1);
        expect(pool.query).toHaveBeenCalledTimes(3);
    });
});