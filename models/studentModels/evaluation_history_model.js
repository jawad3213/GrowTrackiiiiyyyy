const pool = require("../../config/db");

///////// 1
exports.all_evaluation_Model = async (id) => {
  const result = await pool.query(`
    SELECT 
      f.profile_picture,
      f.full_name,
      h.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = p.id_evaluator 
          AND c.id_class = s.id_class
      ) AS project,
      p.date_add
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_evaluator = f.id_member
    JOIN public.teach h ON p.id_evaluator = h.id_member
    JOIN public.student s ON s.id_member = p.id_student
    JOIN public.class c ON c.id_class = s.id_class
    WHERE p.id_student = $1 and p.type_evaluation='Professor' and s.id_class=h.id_class
  `, [id]);

   const student = await pool.query(`
    SELECT 
  f.profile_picture,
  f.full_name,
 (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
  (
    SELECT p2.name_project
    FROM project p2
    JOIN team t ON t.id_project = p2.id_project
    JOIN team_student ts1 ON ts1.id_team = t.id_team
    JOIN team_student ts2 ON ts2.id_team = t.id_team
    WHERE ts1.student_id = p.id_evaluator
      AND ts2.student_id = p.id_student
    LIMIT 1
  ) AS project,
  p.date_add
FROM public.skill_evaluation p
JOIN public.member f ON p.id_evaluator = f.id_member
JOIN public.student s ON s.id_member = p.id_student
WHERE p.id_student = $1 
  AND p.type_evaluation = 'Pair'

  `, [id]);

  const supervisor = await pool.query(`
    SELECT 
  f.profile_picture,
  f.full_name,
  null AS module,
  (
    SELECT i.subject_internship
    FROM internship i join supervise v
    on i.id_internship=v.id_internship
    LIMIT 1
  ) AS project,
  p.date_add
FROM public.skill_evaluation p
JOIN public.member f ON p.id_evaluator = f.id_member
JOIN public.student s ON s.id_member = p.id_student
WHERE p.id_student = $1 
  AND p.type_evaluation = 'Supervisor'

  `, [id]);

  
  return result.rows.concat(student.rows).concat(supervisor.rows);


};

//////// 2
exports.all_evaluation_search_Model = async (id,prof_name) => {
  const result = await pool.query(`
    SELECT
      f.profile_picture,
      f.full_name,
      h.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = p.id_evaluator 
          AND c.id_class = s.id_class
      ) AS project,
      p.date_add
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_evaluator = f.id_member
    JOIN public.teach h ON p.id_evaluator = h.id_member
    JOIN public.student s ON s.id_member = p.id_student
    JOIN public.class c ON c.id_class = s.id_class
    WHERE p.id_student = $1 and p.type_evaluation='Professor' and f.full_name=$2 and s.id_class=h.id_class
  `, [id,prof_name]);

  const student = await pool.query(`
    SELECT 
  f.profile_picture,
  f.full_name,
 (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
  (
    SELECT p2.name_project
    FROM project p2
    JOIN team t ON t.id_project = p2.id_project
    JOIN team_student ts1 ON ts1.id_team = t.id_team
    JOIN team_student ts2 ON ts2.id_team = t.id_team
    WHERE ts1.student_id = p.id_evaluator
      AND ts2.student_id = p.id_student
    LIMIT 1
  ) AS project,
  p.date_add
FROM public.skill_evaluation p
JOIN public.member f ON p.id_evaluator = f.id_member
JOIN public.student s ON s.id_member = p.id_student
WHERE p.id_student = $1 
  AND p.type_evaluation = 'Pair' 
  AND f.full_name=$2

  `, [id,prof_name]);

  const supervisor = await pool.query(`
    SELECT 
  f.profile_picture,
  f.full_name,
  null AS module,
  (
    SELECT i.subject_internship
    FROM internship i join supervise v
    on i.id_internship=v.id_internship
    LIMIT 1
  ) AS project,
  p.date_add
FROM public.skill_evaluation p
JOIN public.member f ON p.id_evaluator = f.id_member
JOIN public.student s ON s.id_member = p.id_student
WHERE p.id_student = $1 
  AND p.type_evaluation = 'Supervisor' AND f.full_name=$2

  `, [id,prof_name]);

  
  return result.rows.concat(student.rows).concat(supervisor.rows);

};

//////// 3
exports.all_evaluation_search_module_Model = async (id,module_name) => {
  const result = await pool.query(`
    SELECT
      f.profile_picture,
      f.full_name,
      h.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = p.id_evaluator 
          AND c.id_class = s.id_class
      ) AS project,
      p.date_add
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_evaluator = f.id_member
    JOIN public.teach h ON p.id_evaluator = h.id_member
    JOIN public.student s ON s.id_member = p.id_student
    JOIN public.class c ON c.id_class = s.id_class
    WHERE p.id_student = $1 and p.type_evaluation='Professor' and h.course=$2 and s.id_class=h.id_class
  `, [id,module_name]);

  const student = await pool.query(`
    SELECT 
  f.profile_picture,
  f.full_name,
 (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
  (
    SELECT p2.name_project
    FROM project p2
    JOIN team t ON t.id_project = p2.id_project
    JOIN team_student ts1 ON ts1.id_team = t.id_team
    JOIN team_student ts2 ON ts2.id_team = t.id_team
    WHERE ts1.student_id = p.id_evaluator
      AND ts2.student_id = p.id_student
    LIMIT 1
  ) AS project,
  p.date_add
FROM public.skill_evaluation p
JOIN public.member f ON p.id_evaluator = f.id_member
JOIN public.student s ON s.id_member = p.id_student
WHERE p.id_student = $1 
  AND p.type_evaluation = 'Pair' 
  AND (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      )=$2
  `, [id,module_name]);

   return result.rows.concat(student.rows)
};

/////// 4
exports.all_evaluation_search_project_Model = async (id, project_name) => {
  const result = await pool.query(`
    SELECT 
      f.profile_picture,
      f.full_name,
      h.course AS module,
      c.name_project AS project,
      p.date_add
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_evaluator = f.id_member
    JOIN public.teach h ON p.id_evaluator = h.id_member
    JOIN public.student s ON s.id_member = p.id_student
    JOIN public.class cl ON cl.id_class = s.id_class
    JOIN public.project c ON c.id_prof = p.id_evaluator AND c.id_class = s.id_class
    WHERE p.id_student = $1 
      AND p.type_evaluation = 'Professor'
      AND c.name_project = $2
      and s.id_class=h.id_class
  `, [id, project_name]);

  const student = await pool.query(`
    SELECT 
  f.profile_picture,
  f.full_name,
 (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
  (
    SELECT p2.name_project
    FROM project p2
    JOIN team t ON t.id_project = p2.id_project
    JOIN team_student ts1 ON ts1.id_team = t.id_team
    JOIN team_student ts2 ON ts2.id_team = t.id_team
    WHERE ts1.student_id = p.id_evaluator
      AND ts2.student_id = p.id_student
    LIMIT 1
  ) AS project,
  p.date_add
FROM public.skill_evaluation p
JOIN public.member f ON p.id_evaluator = f.id_member
JOIN public.student s ON s.id_member = p.id_student
WHERE p.id_student = $1 
  AND p.type_evaluation = 'Pair' 
  AND (
    SELECT p2.name_project
    FROM project p2
    JOIN team t ON t.id_project = p2.id_project
    JOIN team_student ts1 ON ts1.id_team = t.id_team
    JOIN team_student ts2 ON ts2.id_team = t.id_team
    WHERE ts1.student_id = p.id_evaluator
      AND ts2.student_id = p.id_student
    LIMIT 1
  )=$2

  `, [id,project_name]);

const supervisor = await pool.query(`
  SELECT DISTINCT ON (p.id_evaluation)
    f.profile_picture,
    f.full_name,
    null AS module,
    i.subject_internship AS project,
    p.date_add
  FROM public.skill_evaluation p
  JOIN public.member f ON p.id_evaluator = f.id_member
  JOIN public.student s ON s.id_member = p.id_student
  JOIN supervise v ON v.id_internship = p.id_internship
  JOIN internship i ON i.id_internship = v.id_internship
  WHERE p.id_student = $1
    AND p.type_evaluation = 'Supervisor'
    AND i.subject_internship = $2
`, [id, project_name]);

  return result.rows.concat(student.rows).concat(supervisor.rows);
};
