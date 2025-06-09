const pool = require("../../config/db");

///////// 1
exports.Profile_Section_Model = async (id) => {
  const { rows } = await pool.query(`
    SELECT
      m.full_name,
      s.cne,
      sec.id_sector,
      s.id_class,
      array_agg(p.id_project)       AS id_projects,
      array_agg(proj.name_project)  AS name_projects
    FROM member m
    JOIN student s        ON m.id_member = s.id_member
    JOIN class cls        ON s.id_class   = cls.id_class
    JOIN sector sec       ON cls.sector_id = sec.id_sector
    LEFT JOIN team_student ts ON ts.student_id = m.id_member
    LEFT JOIN team p      ON p.id_team    = ts.id_team
    LEFT JOIN project proj ON proj.id_project = p.id_project
    WHERE m.id_member = $1
    GROUP BY m.full_name, s.cne, sec.id_sector, s.id_class
  `, [id]);

  if (!rows[0]) return null;

  return {
    full_name:    rows[0].full_name,
    cne:          rows[0].cne,
    id_sector:    rows[0].id_sector,
    id_class:     rows[0].id_class,
    id_projects:  rows[0].id_projects.filter(Boolean),       // e.g. [75, 82, 99]
    name_projects:rows[0].name_projects.filter(Boolean)      // e.g. ['UX Design','API Dev','Marketing']
  };
};

//////// 2
exports.Evaluation_Section_Model = async (id) => {
  const evaluationsCompleted = await pool.query(`
    SELECT count(s.id_evaluator) AS count
    FROM skill_evaluation s
    WHERE s.id_evaluator = $1
  `, [id]);

  const evaluationsReceived = await pool.query(`
    SELECT count(s.id_student) AS count
    FROM skill_evaluation s
    WHERE s.id_student = $1
  `, [id]);

  const skill_evaluation = await pool.query(`
  SELECT 
    s.date_add AS date,
    e.skill_name,
    e.note_skill
  FROM skill_evaluation s
  JOIN evaluations e ON e.id_evaluation = s.id_evaluation
  WHERE s.id_student = $1
`, [id]);
  
  const average_score = await pool.query(`
  SELECT AVG(note_evaluation) AS average_score
  FROM skill_evaluation
  WHERE id_student = $1
`, [id]);

  const evaluationTypes = await pool.query(`
  SELECT 
    type_evaluation,
    COUNT(*) AS count
  FROM skill_evaluation
  WHERE id_student = $1
  GROUP BY type_evaluation
`, [id]);
 
return {
  completed: parseInt(evaluationsCompleted.rows[0].count),
  received: parseInt(evaluationsReceived.rows[0].count),
  skill_evaluation: skill_evaluation.rows,
  average_score: parseFloat(average_score.rows[0].average_score),
  evaluation_sources: evaluationTypes.rows.map(row => ({
  type_evaluation: row.type_evaluation,
  count: parseInt(row.count)
}))
};


};

//////// 3
exports.Signal_History_Model = async (id) => {

    const result = await pool.query(`
      SELECT
        p.date_add,
        p.id_signal,
        CASE
          WHEN p.approved = true THEN 'approved'
          ELSE 'new'
        END AS signal_state,
        p.solution_state,
        p.id_solution,
        m.full_name,
        m.role
      FROM public.signal p
      JOIN report r ON p.id_signal = r.id_signal
      JOIN member m ON r.id_reporter = m.id_member
      JOIN student t ON r.id_reported = t.id_member
      WHERE  r.id_reported = $1
    `, [id]);
  
    return result.rows;
  };

/////// 4
exports.Comment_Section_Model = async (id) => {

    const professor = await pool.query(`
  SELECT comment_evaluation FROM skill_evaluation
  WHERE type_evaluation = 'Professor' AND id_student = $1 LIMIT 3
`, [id]);

const supervisor = await pool.query(`
  SELECT comment_evaluation FROM skill_evaluation
  WHERE type_evaluation = 'Supervisor' AND id_student = $1 LIMIT 3
`, [id]);

const student = await pool.query(`
  SELECT comment_evaluation FROM skill_evaluation
  WHERE type_evaluation = 'Pair' AND id_student = $1 LIMIT 3
`, [id]);


    return {
  professor: professor.rows,
  supervisor: supervisor.rows,
  student: student.rows
};

  };