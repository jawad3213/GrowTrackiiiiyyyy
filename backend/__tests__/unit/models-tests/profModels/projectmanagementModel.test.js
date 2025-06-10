const projectModel = require('../../../../models/profmodels/project_management_Model'); // Adjust path as needed

// Mock the database pool
jest.mock('../../../../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../../../../config/db');

describe('Project Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('all_project_Model', () => {
    it('should return all projects for a professor', async () => {
      const mockProjects = [
        {
          name_project: 'Test Project 1',
          id_project: 1,
          date_project: '2024-01-01',
          end_date: '2024-06-01',
          id_class: 1,
          id_sector: 1,
          team_count: 3
        },
        {
          name_project: 'Test Project 2',
          id_project: 2,
          date_project: '2024-02-01',
          end_date: '2024-07-01',
          id_class: 2,
          id_sector: 1,
          team_count: 2
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProjects });

      const result = await projectModel.all_project_Model(123);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [123]
      );
      expect(result).toEqual(mockProjects);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no projects found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await projectModel.all_project_Model(999);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(projectModel.all_project_Model(123))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('all_group_Model', () => {
    it('should return all groups for a project', async () => {
      const mockGroups = [
        {
          id_team: 1,
          team_name: 'Team Alpha',
          number_of_member: 4
        },
        {
          id_team: 2,
          team_name: 'Team Beta',
          number_of_member: 3
        }
      ];

      pool.query.mockResolvedValue({ rows: mockGroups });

      const result = await projectModel.all_group_Model(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
      expect(result).toEqual(mockGroups);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no groups found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await projectModel.all_group_Model(999);

      expect(result).toEqual([]);
    });
  });

  describe('delete_team_Model', () => {
    it('should successfully delete a team and its student relations', async () => {
      pool.query
        .mockResolvedValueOnce({ rowCount: 2 }) // Delete team_student relations
        .mockResolvedValueOnce({ rowCount: 1 }); // Delete team

      const result = await projectModel.delete_team_Model(1);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'DELETE FROM team_student WHERE id_team = $1',
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'DELETE FROM team WHERE id_team = $1 RETURNING *',
        [1]
      );
      expect(result).toBe(1);
    });

    it('should return 0 when team does not exist', async () => {
      pool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 0 });

      const result = await projectModel.delete_team_Model(999);

      expect(result).toBe(0);
    });

    it('should handle database errors during deletion', async () => {
      pool.query.mockRejectedValue(new Error('Foreign key constraint violation'));

      await expect(projectModel.delete_team_Model(1))
        .rejects.toThrow('Foreign key constraint violation');
    });
  });

  describe('delete_project_Model', () => {
    it('should successfully delete a project', async () => {
      const mockDeletedProject = {
        id_project: 1,
        name_project: 'Deleted Project',
        description_project: 'Test description'
      };

      pool.query.mockResolvedValue({ rows: [mockDeletedProject] });

      const result = await projectModel.delete_project_Model(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM public.project'),
        [1]
      );
      expect(result).toEqual(mockDeletedProject);
    });

    it('should return undefined when project does not exist', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await projectModel.delete_project_Model(999);

      expect(result).toBeUndefined();
    });
  });

  describe('add_project_Model', () => {
    it('should successfully create a new project and add news entry', async () => {
      const mockProject = { id_project: 1 };

      pool.query
        .mockResolvedValueOnce({ rows: [mockProject] }) // Insert project
        .mockResolvedValueOnce({ rows: [] }); // Insert news

      const result = await projectModel.add_project_Model(
        123, // id
        'New Project', // name
        '2024-01-01', // start_date
        '2024-06-01', // end_date
        'Project description', // description
        2, // level
        1 // field
      );

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO project'),
        ['New Project', 'Project description', '2024-01-01', '2024-06-01', 123, 1, 2]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO news'),
        [123, expect.stringContaining('Professor 123 has successfully created'), 'Professor']
      );
      expect(result).toEqual(mockProject);
    });

    it('should handle database errors during project creation', async () => {
      pool.query.mockRejectedValue(new Error('Duplicate project name'));

      await expect(projectModel.add_project_Model(
        123, 'New Project', '2024-01-01', '2024-06-01', 'Description', 2, 1
      )).rejects.toThrow('Duplicate project name');
    });
  });

  describe('add_group_Model', () => {
    it('should successfully create a new group', async () => {
      const mockGroup = { id_team: 1 };

      pool.query.mockResolvedValue({ rows: [mockGroup] });

      const result = await projectModel.add_group_Model(123, 'Team Alpha', 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO team'),
        [123, 1, 'Team Alpha']
      );
      expect(result).toEqual(mockGroup);
    });

    it('should handle database errors during group creation', async () => {
      pool.query.mockRejectedValue(new Error('Invalid project_id'));

      await expect(projectModel.add_group_Model(123, 'Team Alpha', 999))
        .rejects.toThrow('Invalid project_id');
    });
  });

  describe('delete_group_Model', () => {
    it('should successfully delete a group and its student relations', async () => {
      const mockDeletedGroup = {
        id_team: 1,
        team_name: 'Deleted Team',
        id_prof: 123,
        id_project: 1
      };

      pool.query
        .mockResolvedValueOnce({ rows: [] }) // Delete team_student
        .mockResolvedValueOnce({ rows: [mockDeletedGroup] }); // Delete team

      const result = await projectModel.delete_group_Model(1);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('DELETE FROM public.team_student'),
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('DELETE FROM public.team'),
        [1]
      );
      expect(result).toEqual(mockDeletedGroup);
    });

    it('should return undefined when group does not exist', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await projectModel.delete_group_Model(999);

      expect(result).toBeUndefined();
    });
  });

  describe('add_member_Model', () => {
    it('should successfully add a member to a team', async () => {
      const mockStudent = { id_member: 456 };
      const mockTeamStudent = {
        id_team: 1,
        student_id: 456
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockStudent] }) // Get student id
        .mockResolvedValueOnce({ rows: [mockTeamStudent] }); // Insert team_student

      const result = await projectModel.add_member_Model('CNE123', 1);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('select id_member from student'),
        ['CNE123']
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO team_student'),
        [1, 456]
      );
      expect(result).toEqual(mockTeamStudent);
    });

    it('should handle case when student CNE does not exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(projectModel.add_member_Model('INVALID_CNE', 1))
        .rejects.toThrow();
    });

    it('should handle database errors during member addition', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ id_member: 456 }] })
        .mockRejectedValueOnce(new Error('Duplicate team member'));

      await expect(projectModel.add_member_Model('CNE123', 1))
        .rejects.toThrow('Duplicate team member');
    });
  });

  describe('update_project_Model', () => {
    beforeEach(() => {
      // Mock current date for consistent testing
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update project with new start date and calculated end date', async () => {
      const mockCurrentProject = {
        date_project: new Date('2024-01-01')
      };
      const mockUpdatedProject = {
        id_project: 1,
        date_project: new Date('2024-02-01'),
        end_date: new Date('2024-05-01')
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockCurrentProject] }) // Get current project
        .mockResolvedValueOnce({ rows: [mockUpdatedProject] }); // Update project

      const result = await projectModel.update_project_Model(1, '2024-02', 3);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT date_project FROM project'),
        [1]
      );
      expect(result).toEqual(mockUpdatedProject);
    });

    it('should update project with only start date when month_number not provided', async () => {
      const mockCurrentProject = {
        date_project: new Date('2024-01-01')
      };
      const mockUpdatedProject = {
        id_project: 1,
        date_project: new Date('2024-03-01'),
        end_date: new Date('2024-06-01')
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockCurrentProject] })
        .mockResolvedValueOnce({ rows: [mockUpdatedProject] });

      const result = await projectModel.update_project_Model(1, '2024-03', null);

      expect(result).toEqual(mockUpdatedProject);
    });

    it('should use current date when start_date not provided', async () => {
      const mockCurrentProject = {
        date_project: new Date('2024-01-01')
      };
      const mockUpdatedProject = {
        id_project: 1,
        date_project: new Date('2024-01-01'),
        end_date: new Date('2024-04-01')
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockCurrentProject] })
        .mockResolvedValueOnce({ rows: [mockUpdatedProject] });

      const result = await projectModel.update_project_Model(1, null, 3);

      expect(result).toEqual(mockUpdatedProject);
    });

    it('should throw error when project not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(projectModel.update_project_Model(999, '2024-02', 3))
        .rejects.toThrow('Project not found.');
    });

    it('should handle database errors during update', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ date_project: new Date() }] })
        .mockRejectedValueOnce(new Error('Update failed'));

      await expect(projectModel.update_project_Model(1, '2024-02', 3))
        .rejects.toThrow('Update failed');
    });
  });

  describe('all_member_Model', () => {
    it('should return all members with their evaluation status', async () => {
      const mockMembers = [
        {
          student_id: 1,
          cne: 'CNE001',
          full_name: 'John Doe',
          last_evaluation: '2024-01-15',
          isP: 'submitted'
        },
        {
          student_id: 2,
          cne: 'CNE002',
          full_name: 'Jane Smith',
          last_evaluation: '2023-12-15',
          isP: 'overdue'
        },
        {
          student_id: 3,
          cne: 'CNE003',
          full_name: 'Bob Johnson',
          last_evaluation: null,
          isP: ''
        }
      ];

      pool.query.mockResolvedValue({ rows: mockMembers });

      const result = await projectModel.all_member_Model(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
      expect(result).toEqual(mockMembers);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no members found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await projectModel.all_member_Model(999);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Query failed'));

      await expect(projectModel.all_member_Model(1))
        .rejects.toThrow('Query failed');
    });
  });

  // Integration-style tests
  describe('Integration Tests', () => {
    it('should create project, add group, and add members in sequence', async () => {
      const mockProject = { id_project: 1 };
      const mockGroup = { id_team: 1 };
      const mockStudent = { id_member: 456 };
      const mockTeamStudent = { id_team: 1, student_id: 456 };

      pool.query
        .mockResolvedValueOnce({ rows: [mockProject] }) // Create project
        .mockResolvedValueOnce({ rows: [] }) // Insert news
        .mockResolvedValueOnce({ rows: [mockGroup] }) // Create group
        .mockResolvedValueOnce({ rows: [mockStudent] }) // Get student
        .mockResolvedValueOnce({ rows: [mockTeamStudent] }); // Add member

      // Create project
      const project = await projectModel.add_project_Model(
        123, 'Integration Test Project', '2024-01-01', '2024-06-01',
        'Test description', 2, 1
      );

      // Add group
      const group = await projectModel.add_group_Model(
        123, 'Test Team', project.id_project
      );

      // Add member
      const member = await projectModel.add_member_Model(
        'CNE123', group.id_team
      );

      expect(project).toEqual(mockProject);
      expect(group).toEqual(mockGroup);
      expect(member).toEqual(mockTeamStudent);
      expect(pool.query).toHaveBeenCalledTimes(5);
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle null parameters gracefully', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      await expect(projectModel.add_project_Model(null, null, null, null, null, null, null))
        .rejects.toThrow('Invalid input');
    });

    it('should handle very large team IDs', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await projectModel.all_member_Model(Number.MAX_SAFE_INTEGER);

      expect(result).toEqual([]);
    });

    it('should handle special characters in project names', async () => {
      const mockProject = { id_project: 1 };
      pool.query
        .mockResolvedValueOnce({ rows: [mockProject] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await projectModel.add_project_Model(
        123, "Project with 'quotes' & symbols", '2024-01-01', '2024-06-01',
        'Description with <tags>', 2, 1
      );

      expect(result).toEqual(mockProject);
    });
  });
});