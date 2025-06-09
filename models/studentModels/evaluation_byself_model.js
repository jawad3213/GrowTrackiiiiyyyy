const pool = require("../../config/db");

exports.new_evaluation_Model = async (skill1,note1,
  skill2,note2,
  skill3,note3,
  skill4,note4,
  skill5,note5,
  skill6,note6,
  comment,id_prof,id_student) => {
  const id_class= await pool.query(`
    select id_class from student where id_member=$1`,[id_student]
  );
  const total_note = parseFloat(((note1 + note2 + note3 + note4 + note5 + note6) / 6).toFixed(2));

  const existingEval = await pool.query(`
    SELECT 1 FROM skill_evaluation
    WHERE id_evaluator = $1
      AND id_student = $2
      AND evaluation_context = 'class'
      AND date_trunc('month', date_add) = date_trunc('month', CURRENT_DATE)
  `, [id_prof, id_student]);
  
  if (existingEval.rows.length > 0) {
    return null;
  }
  
  
  const result = await pool.query(`
    INSERT INTO skill_evaluation 
      (comment_evaluation,id_evaluator,id_student,id_class,evaluation_context,type_evaluation,note_evaluation)
    VALUES 
      ($1,$2,$3,$4,'class','Self',$5)
    RETURNING id_evaluation
  `, [comment,id_prof,id_student,id_class.rows.id_class,total_note]);

  
  const id_evaluation = result.rows[0].id_evaluation;
  
  const skills = [
    { name: skill1, note: note1 },
    { name: skill2, note: note2 },
    { name: skill3, note: note3 },
    { name: skill4, note: note4 },
    { name: skill5, note: note5 },
    { name: skill6, note: note6 }
  ];
  
  const insertedEvaluations = [];

for (const skill of skills) {
  const insertResult = await pool.query(`
    INSERT INTO evaluations (id_evaluation, note_skill, skill_name)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [id_evaluation, skill.note, skill.name]);

  insertedEvaluations.push(insertResult.rows[0]);
}

return insertedEvaluations;
  

};