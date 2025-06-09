const skillModel = require('../../../../models/adminModels/skillModel');

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Skill Model', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Clear all mocks and reset their state
    jest.clearAllMocks();
    pool.query.mockReset();
    
    // Setup console.error spy
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error and reset all mocks
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
    jest.resetAllMocks();
  });

  describe('createSkill', () => {
    it('should create a skill successfully', async () => {
      const mockResult = {
        rows: [{ 
          skill_name: 'JavaScript',
          question1: 'What is closure?',
          question2: 'What is hoisting?',
          question3: 'What is async/await?',
          description_skill: 'JavaScript programming',
          id_admin: 1
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await skillModel.createSkill(
        'JavaScript',
        'What is closure?',
        'What is hoisting?',
        'What is async/await?',
        'JavaScript programming',
        1
      );

      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO public.skill (
         skill_name, question1, question2, question3,description_skill, id_admin
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
        ['JavaScript', 'What is closure?', 'What is hoisting?', 'What is async/await?', 'JavaScript programming', 1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should handle database errors during skill creation', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(skillModel.createSkill(
        'JavaScript',
        'What is closure?',
        'What is hoisting?',
        'What is async/await?',
        'JavaScript programming',
        1
      )).rejects.toThrow('Database connection failed');

      expect(console.error).toHaveBeenCalledWith('Error inserting skill:', mockError);
    });
  });

  describe('getAllSkills', () => {
    it('should retrieve all skills successfully', async () => {
      const mockResult = {
        rows: [
          { 
            skill_name: 'JavaScript',
            question1: 'What is closure?',
            question2: 'What is hoisting?',
            question3: 'What is async/await?',
            description_skill: 'JavaScript programming',
            id_admin: 1
          },
          { 
            skill_name: 'Python',
            question1: 'What is list comprehension?',
            question2: 'What is decorator?',
            question3: 'What is generator?',
            description_skill: 'Python programming',
            id_admin: 2
          }
        ]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await skillModel.getAllSkills();

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT *
       FROM public.skill`
      );
      expect(result).toEqual(mockResult.rows);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no skills exist', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await skillModel.getAllSkills();

      expect(result).toEqual([]);
    });

    it('should handle database errors during skill retrieval', async () => {
      const mockError = new Error('Database query failed');
      pool.query.mockRejectedValue(mockError);

      await expect(skillModel.getAllSkills()).rejects.toThrow('Database query failed');
      expect(console.error).toHaveBeenCalledWith('Error fetching skills:', mockError);
    });
  });

  describe('updateSkillById', () => {
    it('should update skill successfully with single field', async () => {
      const mockResult = {
        rows: [{ 
          skill_name: 'JavaScript',
          question1: 'What is closure in JS?',
          question2: 'What is hoisting?',
          question3: 'What is async/await?',
          description_skill: 'JavaScript programming',
          id_admin: 1
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const fieldsToUpdate = { question1: 'What is closure in JS?' };
      const result = await skillModel.updateSkillById('JavaScript', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.skill SET question1 = $1 WHERE skill_name = $2 RETURNING *',
        ['What is closure in JS?', 'JavaScript']
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should update skill successfully with multiple fields', async () => {
      const mockResult = {
        rows: [{ 
          skill_name: 'JavaScript',
          question1: 'Updated question 1',
          question2: 'Updated question 2',
          description_skill: 'Updated description',
          id_admin: 1
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const fieldsToUpdate = { 
        question1: 'Updated question 1',
        question2: 'Updated question 2',
        description_skill: 'Updated description'
      };
      const result = await skillModel.updateSkillById('JavaScript', fieldsToUpdate);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public.skill SET question1 = $1, question2 = $2, description_skill = $3 WHERE skill_name = $4 RETURNING *',
        ['Updated question 1', 'Updated question 2', 'Updated description', 'JavaScript']
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should return null when no fields to update', async () => {
      const result = await skillModel.updateSkillById('JavaScript', {});

      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle database errors during skill update', async () => {
      const mockError = new Error('Update failed');
      pool.query.mockRejectedValue(mockError);

      const fieldsToUpdate = { question1: 'Updated question' };

      await expect(skillModel.updateSkillById('JavaScript', fieldsToUpdate))
        .rejects.toThrow('Update failed');
    });
  });

  describe('deleteSkillById', () => {
    it('should delete skill and related evaluations successfully', async () => {
      const mockEvaluationResult = { rows: [], rowCount: 2 };
      const mockSkillResult = { rows: [], rowCount: 1 };
      
      // Reset mock before setting up the chain
      pool.query.mockReset();
      pool.query
        .mockResolvedValueOnce(mockEvaluationResult) // First call for evaluations
        .mockResolvedValueOnce(mockSkillResult);     // Second call for skill

      const result = await skillModel.deleteSkillById('JavaScript');

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'DELETE FROM public.evaluations WHERE skill_name = $1',
        ['JavaScript']
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'DELETE FROM public.skill WHERE skill_name = $1',
        ['JavaScript']
      );
      expect(result).toEqual(mockSkillResult);
    });

    it('should handle database errors during skill deletion', async () => {
      const mockError = new Error('Delete operation failed');
      pool.query.mockReset();
      pool.query.mockRejectedValue(mockError);

      await expect(skillModel.deleteSkillById('JavaScript'))
        .rejects.toThrow('Delete operation failed');

      expect(console.error).toHaveBeenCalledWith('Error deleting skill:', mockError);
    });

    it('should handle error during evaluation deletion but continue with skill deletion', async () => {
      const evaluationError = new Error('Evaluation delete failed');
      pool.query.mockReset();
      pool.query
        .mockRejectedValueOnce(evaluationError)
        .mockResolvedValueOnce({ rows: [], rowCount: 1 });

      await expect(skillModel.deleteSkillById('JavaScript'))
        .rejects.toThrow('Evaluation delete failed');

      expect(console.error).toHaveBeenCalledWith('Error deleting skill:', evaluationError);
    });
  });

  describe('total', () => {
    it('should return total count of skills successfully', async () => {
      const mockResult = {
        rows: [{ total: '5' }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await skillModel.total();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(skill_name) AS total FROM public.skill'
      );
      expect(result).toEqual({ total: '5' });
    });

    it('should return zero when no skills exist', async () => {
      const mockResult = {
        rows: [{ total: '0' }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await skillModel.total();

      expect(result).toEqual({ total: '0' });
    });

    it('should handle database errors during total count retrieval', async () => {
      const mockError = new Error('Count query failed');
      pool.query.mockReset();
      pool.query.mockRejectedValue(mockError);

      await expect(skillModel.total()).rejects.toThrow('Count query failed');
      expect(console.error).toHaveBeenCalledWith('Error retrieving total number of skills:', mockError);
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle null and undefined values in createSkill', async () => {
      const mockResult = {
        rows: [{ 
          skill_name: null,
          question1: null,
          question2: null,
          question3: null,
          description_skill: null,
          id_admin: null
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const result = await skillModel.createSkill(null, null, null, null, null, null);

      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO public.skill (
         skill_name, question1, question2, question3,description_skill, id_admin
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [null, null, null, null, null, null]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should handle updateSkillById with fields containing special characters', async () => {
      const mockResult = {
        rows: [{ 
          skill_name: 'JavaScript',
          question1: 'What is "closure" in JS?',
          description_skill: 'JS & Node.js programming'
        }]
      };
      
      pool.query.mockResolvedValue(mockResult);

      const fieldsToUpdate = { 
        question1: 'What is "closure" in JS?',
        description_skill: 'JS & Node.js programming'
      };
      
      const result = await skillModel.updateSkillById('JavaScript', fieldsToUpdate);

      expect(result).toEqual(mockResult.rows[0]);
    });
  });
});