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

////////all group
exports.all_group_Model = async (id) => {
  const result = await pool.query(`
    SELECT 
      p.id_team,
      p.team_name,
      (
        SELECT COUNT(*) 
        FROM team_student 
        WHERE id_team = p.id_team
      ) AS number_of_member 
    FROM public.team AS p
    WHERE p.id_project = $1
  `, [id]);  

  return result.rows;
};

////////delete group
exports.delete_team_Model = async (id_team) => {
  // Supprimer les relations avec les étudiants d'abord
  await pool.query(`DELETE FROM team_student WHERE id_team = $1`, [id_team]);

  // Supprimer l'équipe
  const result = await pool.query(`DELETE FROM team WHERE id_team = $1 RETURNING *`, [id_team]);

  return result.rowCount;
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
  const message = `Professor ${id} has successfully created a project named "${name}" focused on: "${description}".`;

  await pool.query(`
    INSERT INTO news (id_member, message, type)
    VALUES ($1, $2, $3)
  `, [id, message, 'Professor']);

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

//////// 5
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

///////// edit
exports.update_project_Model = async (id_project, start_date, month_number) => {
 
  const current = await pool.query(`SELECT date_project FROM project WHERE id_project = $1`, [id_project]);
  if (current.rows.length === 0) throw new Error("Project not found.");

  let new_start_date;

  // forcer start_date au jour 1 à minuit UTC
  if (start_date) {
    const [year, month] = start_date.split('-');
    new_start_date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
  } else {
    new_start_date = current.rows[0].date_project;
  }

 
  let new_end_date;
  if (month_number) {
    new_end_date = new Date(new_start_date);
    new_end_date.setUTCMonth(new_end_date.getUTCMonth() + parseInt(month_number));
  }

  
  const update = await pool.query(`
    UPDATE project 
    SET 
      date_project = $1,
      end_date = COALESCE($2, end_date)
    WHERE id_project = $3
    RETURNING *;
  `, [new_start_date, new_end_date, id_project]);

  return update.rows[0];
};


//////// all member
exports.all_member_Model = async (id_group) => {
  const result = await pool.query(`
  SELECT
    i.student_id,
    s.cne,
    m.full_name,
    (
      SELECT MAX(date_add)
      FROM skill_evaluation
      WHERE id_student = i.student_id AND id_team = $1::int
    ) AS last_evaluation,
    CASE
      WHEN EXISTS (
        SELECT 1 
        FROM skill_evaluation se
        WHERE se.id_student = i.student_id
          AND se.id_team = $1::int
          AND EXTRACT(MONTH FROM se.date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM se.date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
      ) THEN 'submitted'
      WHEN EXISTS (
        SELECT 1 
        FROM skill_evaluation se
        WHERE se.id_student = i.student_id
          AND se.id_team = $1::int
      ) THEN 'overdue'
      ELSE ''
    END AS isP
  FROM team_student i
  JOIN student s ON s.id_member = i.student_id
  JOIN member m ON m.id_member = s.id_member
  WHERE i.id_team = $1::int;
`, [id_group]);


  return result.rows;
};
