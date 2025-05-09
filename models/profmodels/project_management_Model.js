const pool = require("../../config/db");

///////// 1
exports.all_project_Model = async (id) => {
  const result = await pool.query(`
    SELECT 
      p.name_project,
      p.id_project,
      p.date_project,
      p.date_project,
      p.end_date,
      p.id_class,
      p.id_sector,
      (
      SELECT COUNT(*) 
      FROM team t 
      WHERE t.id_project = p.id_project
    ) AS team_count
    FROM public.project p
    WHERE p.id_prof = $1
  `, [id]);  

    return result.rows;
  };

//////// 2
exports.delete_project_Model = async (id_project) => {
  const result = await pool.query(`
    DELETE FROM public.project
    WHERE id_project = $1
    RETURNING *;
  `, [id_project]);  
    
    return result.rows[0];
  };
  
//////// 3
exports.add_project_Model = async (
  id, name, start_date, end_date, description, level, field
) => {
  const result = await pool.query(`
    INSERT INTO project (
      name_project,
      description_project,
      date_project,
      end_date,
      id_prof,
      id_class,
      id_sector
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id_project;
  `, [name, description, start_date, end_date, id, field, level]);

  return result.rows[0];
};

//////// 4
exports.add_group_Model = async (
  id,name,project_id
) => {
  const result = await pool.query(`
    INSERT INTO team (
      id_prof,
      id_project,
      team_name
    ) VALUES ($1, $2, $3)
    RETURNING id_team;
  `, [id,project_id,name]);

  return result.rows[0];
};

//////// 6
exports.delete_group_Model = async (
  id_team
) => {
  await pool.query(`
    DELETE FROM public.team_student
    WHERE id_team = $1
  `, [id_team]);  

  const result = await pool.query(`
    DELETE FROM public.team
    WHERE id_team = $1
    RETURNING *;
  `, [id_team]);  
    
    return result.rows[0];
  };

//////// 6
exports.add_member_Model = async (
  cne,id_team
) => {
  const id_student = await pool.query(`
    select id_member from student where cne=$1 
  `, [cne]);

  const result = await pool.query(`
    INSERT INTO team_student (
      id_team,
      student_id
    ) VALUES ($1, $2)
    RETURNING *;
  `, [id_team,id_student.rows[0].id_member]);

  return result.rows[0];
};