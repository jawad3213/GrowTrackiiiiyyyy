const pool = require("../../config/db");

///////// 1
exports.Profile_Section_Model = async (id) => {
  const Profile_Section = await pool.query(`
    SELECT 
      m.full_name,
      s.cne,
      t.id_sector,
      s.id_class,
      (select p.id_project from team p join team_student t on t.id_team=p.id_team where student_id=m.id_member)
      from member m 
      join student s on m.id_member=s.id_member
      join class l on s.id_class=l.id_class
      join sector t on t.id_sector=l.sector_id
    WHERE m.id_member = $1
  `, [id]);  
  const id_project = Profile_Section.rows[0]?.id_project;

const name_project = await pool.query(`
  SELECT name_project
  FROM project
  WHERE id_project = $1
`, [id_project]);


    return {
  ...Profile_Section.rows[0],
  name_project: name_project.rows[0]?.name_project || null
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