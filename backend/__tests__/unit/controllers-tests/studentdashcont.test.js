const dashController = require('../../../controllers/studentControllers/dashController'); 
const dashModel = require('../../../models/studentModels/dashModel');

// Mock the dashModel
jest.mock('../../../models/studentModels/dashModel');

describe('Dashboard Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        
        // Mock request and response objects
        req = {
            params: { id_student: '123' },
            query: {}
        };
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock console methods to avoid cluttering test output
        console.error = jest.fn();
        console.erroe = jest.fn(); // Mock the typo in the original code
    });

    describe('numberOfProdjects', () => {
        it('should return number of projects successfully', async () => {
            const mockResult = { count: 5 };
            dashModel.getNombreProjets.mockResolvedValue(mockResult);

            await dashController.numberOfProdjects(req, res);

            expect(dashModel.getNombreProjets).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Number of projects retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving number of projects', async () => {
            const mockError = new Error('Database error');
            dashModel.getNombreProjets.mockRejectedValue(mockError);

            await dashController.numberOfProdjects(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving number of projects:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving number of projects",
                error: mockError.message
            });
        });
    });

    describe('signalReceived', () => {
        it('should return number of signals successfully', async () => {
            const mockResult = { count: 3 };
            dashModel.getNumberOfSignal.mockResolvedValue(mockResult);

            await dashController.signalReceived(req, res);

            expect(dashModel.getNumberOfSignal).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Number of signals retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving number of signals', async () => {
            const mockError = new Error('Database error');
            dashModel.getNumberOfSignal.mockRejectedValue(mockError);

            await dashController.signalReceived(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving number of signals:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving number of signals",
                error: mockError.message
            });
        });
    });

    describe('moyenneDansLaClasse', () => {
        it('should return class average successfully', async () => {
            const mockResult = { average: 85.5 };
            dashModel.getMoyenneDansLaClasse.mockResolvedValue(mockResult);

            await dashController.moyenneDansLaClasse(req, res);

            expect(dashModel.getMoyenneDansLaClasse).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Average in the class retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving class average', async () => {
            const mockError = new Error('Database error');
            dashModel.getMoyenneDansLaClasse.mockRejectedValue(mockError);

            await dashController.moyenneDansLaClasse(req, res);

            expect(console.erroe).toHaveBeenCalledWith("Error retrieving average in the class:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving average in the class",
                error: mockError.message
            });
        });
    });

    describe('evaluationSubmitted', () => {
        it('should return number of evaluations submitted successfully', async () => {
            const mockResult = { count: 7 };
            dashModel.getEvaluationSubmitted.mockResolvedValue(mockResult);

            await dashController.evaluationSubmitted(req, res);

            expect(dashModel.getEvaluationSubmitted).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Number of evaluations submitted retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving evaluations submitted', async () => {
            const mockError = new Error('Database error');
            dashModel.getEvaluationSubmitted.mockRejectedValue(mockError);

            await dashController.evaluationSubmitted(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving number of evaluations submitted:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving number of evaluations submitted",
                error: mockError.message
            });
        });
    });

    describe('evaluationAssigned', () => {
        it('should return number of evaluations assigned successfully', async () => {
            const mockResult = { count: 4 };
            dashModel.getEvaluationAssigned.mockResolvedValue(mockResult);

            await dashController.evaluationAssigned(req, res);

            expect(dashModel.getEvaluationAssigned).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Number of evaluations assigned in this Month retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving evaluations assigned', async () => {
            const mockError = new Error('Database error');
            dashModel.getEvaluationAssigned.mockRejectedValue(mockError);

            await dashController.evaluationAssigned(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving number of evaluations assigned:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving number of evaluations assigned",
                error: mockError.message
            });
        });
    });

    describe('getRadarByClass', () => {
        it('should return radar statistics by class successfully', async () => {
            const mockResult = { stats: 'radar data' };
            dashModel.getRadarByClass.mockResolvedValue(mockResult);

            await dashController.getRadarByClass(req, res);

            expect(dashModel.getRadarByClass).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Statistics by class retrieved successfully",
                data: mockResult
            });
        });

        it('should return 404 when no statistics found for class', async () => {
            dashModel.getRadarByClass.mockResolvedValue(null);

            await dashController.getRadarByClass(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "No statistics found for this class"
            });
        });

        it('should handle errors when retrieving radar by class', async () => {
            const mockError = new Error('Database error');
            dashModel.getRadarByClass.mockRejectedValue(mockError);

            await dashController.getRadarByClass(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving statistics by class:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving statistics by class",
                error: mockError.message
            });
        });
    });

    describe('getProjects', () => {
        it('should return projects successfully', async () => {
            const mockResult = [{ id: 1, name: 'Project 1' }];
            dashModel.getProjects.mockResolvedValue(mockResult);

            await dashController.getProjects(req, res);

            expect(dashModel.getProjects).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Projects retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving projects', async () => {
            const mockError = new Error('Database error');
            dashModel.getProjects.mockRejectedValue(mockError);

            await dashController.getProjects(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving projects:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving projects",
                error: mockError.message
            });
        });
    });

    describe('getRadarByProject', () => {
        beforeEach(() => {
            req.query = { project: 'TestProject' };
        });

        it('should return radar statistics by project successfully', async () => {
            const mockResult = { stats: 'project radar data' };
            dashModel.getRadarByProject.mockResolvedValue(mockResult);

            await dashController.getRadarByProject(req, res);

            expect(dashModel.getRadarByProject).toHaveBeenCalledWith('123', 'TestProject');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Statistics by project retrieved successfully",
                data: mockResult
            });
        });

        it('should return 404 when no statistics found for project', async () => {
            dashModel.getRadarByProject.mockResolvedValue(null);

            await dashController.getRadarByProject(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "No statistics found for this class"
            });
        });

        it('should handle errors when retrieving radar by project', async () => {
            const mockError = new Error('Database error');
            dashModel.getRadarByProject.mockRejectedValue(mockError);

            await dashController.getRadarByProject(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving statistics by project:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving statistics by project",
                error: mockError.message
            });
        });
    });

    describe('getEvaluationCountByRoleAndMonth', () => {
        it('should return evaluation count by role and month successfully', async () => {
            const mockResult = { role1: 5, role2: 3 };
            dashModel.getEvaluationCountByRoleAndMonth.mockResolvedValue(mockResult);

            await dashController.getEvaluationCountByRoleAndMonth(req, res);

            expect(dashModel.getEvaluationCountByRoleAndMonth).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Evaluation count by role and month retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving evaluation count by role and month', async () => {
            const mockError = new Error('Database error');
            dashModel.getEvaluationCountByRoleAndMonth.mockRejectedValue(mockError);

            await dashController.getEvaluationCountByRoleAndMonth(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving evaluation count by role and month:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving evaluation count by role and month",
                error: mockError.message
            });
        });
    });

    describe('getSkills', () => {
        it('should return skills successfully', async () => {
            const mockResult = [{ id: 1, name: 'Skill 1' }];
            dashModel.getSkills.mockResolvedValue(mockResult);

            await dashController.getSkills(req, res);

            expect(dashModel.getSkills).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Skills retrieved successfully",
                data: mockResult
            });
        });

        it('should return 404 when no skills found', async () => {
            dashModel.getSkills.mockResolvedValue([]);

            await dashController.getSkills(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "No skills found for this student"
            });
        });

        it('should return 404 when skills result is null', async () => {
            dashModel.getSkills.mockResolvedValue(null);

            await dashController.getSkills(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "No skills found for this student"
            });
        });

        it('should handle errors when retrieving skills', async () => {
            const mockError = new Error('Database error');
            dashModel.getSkills.mockRejectedValue(mockError);

            await dashController.getSkills(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving skills:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving skills",
                error: mockError.message
            });
        });
    });

    describe('getSkillRatingByMonth', () => {
        beforeEach(() => {
            req.query = { skill: 'TestSkill' };
        });

        it('should return skill rating by month successfully', async () => {
            const mockResult = { January: 4.5, February: 4.8 };
            dashModel.getSkillRatingByMonth.mockResolvedValue(mockResult);

            await dashController.getSkillRatingByMonth(req, res);

            expect(dashModel.getSkillRatingByMonth).toHaveBeenCalledWith('123', 'TestSkill');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Skill rating by month retrieved successfully",
                data: mockResult
            });
        });

        it('should handle errors when retrieving skill rating by month', async () => {
            const mockError = new Error('Database error');
            dashModel.getSkillRatingByMonth.mockRejectedValue(mockError);

            await dashController.getSkillRatingByMonth(req, res);

            expect(console.error).toHaveBeenCalledWith("Error retrieving skill rating by month:", mockError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error retrieving skill rating by month",
                error: mockError.message
            });
        });
    });
});