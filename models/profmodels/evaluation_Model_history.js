const pool = require("../../config/db");

///////// 1
exports.all_evaluation_Model = async (id) => {
    const result = await pool.query(`
      SELECT 
        p.id_evaluation,
        p.evaluation_context,
        p.date_add,
        p.id_student,
        f.full_name,
        f.profile_picture,
        s.id_class,
        c.sector_id
      FROM public.skill_evaluation p
      JOIN public.member f ON p.id_student = f.id_member
      JOIN public.student s ON p.id_student = s.id_member
      JOIN public.class c ON c.id_class = s.id_class
      WHERE p.id_evaluator = $1
    `, [id]);

    return result.rows;
  };
///////// 2
exports.search_by_id_evaluation_Model = async (id_evaluation,id) => {
  const result = await pool.query(`
    SELECT 
      p.id_evaluation,
      p.evaluation_context,
      p.date_add,
      p.id_student,
      f.full_name,
      f.profile_picture,
      s.id_class,
      c.sector_id
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_student = f.id_member
    JOIN public.student s ON p.id_student = s.id_member
    JOIN public.class c ON c.id_class = s.id_class
    WHERE p.id_evaluation = $1 AND p.id_evaluator = $2
  `, [id_evaluation, id]);

  return result.rows;
};
////////// 3
exports.filter_by_level_Model = async (level,id) => {
  const result = await pool.query(`
    SELECT 
      p.id_evaluation,
      p.evaluation_context,
      p.date_add,
      p.id_student,
      f.full_name,
      f.profile_picture,
      s.id_class,
      c.sector_id
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_student = f.id_member
    JOIN public.student s ON p.id_student = s.id_member
    JOIN public.class c ON c.id_class = s.id_class
    WHERE c.sector_id = $1 AND p.id_evaluator = $2
  `, [level,id]);

  return result.rows; 
};
/////////// 4
exports.filter_by_class_Model = async (classe,id) => {
  const result = await pool.query(`
    SELECT 
      p.id_evaluation,
      p.evaluation_context,
      p.date_add,
      p.id_student,
      f.full_name,
      f.profile_picture,
      s.id_class,
      c.sector_id
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_student = f.id_member
    JOIN public.student s ON p.id_student = s.id_member
    JOIN public.class c ON c.id_class = s.id_class
    WHERE s.id_class = $1 AND p.id_evaluator = $2
  `, [classe,id]);

  return result.rows; 
};
/////////// 5
exports.filter_by_type_Model = async (type,id) => {
  const result = await pool.query(`
    SELECT 
      p.id_evaluation,
      p.evaluation_context,
      p.date_add,
      p.id_student,
      f.full_name,
      f.profile_picture,
      s.id_class,
      c.sector_id
    FROM public.skill_evaluation p
    JOIN public.member f ON p.id_student = f.id_member
    JOIN public.student s ON p.id_student = s.id_member
    JOIN public.class c ON c.id_class = s.id_class
    WHERE p.evaluation_context = $1 AND p.id_evaluator = $2
  `, [type,id]);

  return result.rows; 
};
////////// 6
exports.view_evaluation_Model = async (id_evaluation) => {
  const result = await pool.query(`
    SELECT
      skill_name,
      note_skill
    FROM evaluations 
    WHERE id_evaluation = $1
  `, [id_evaluation]);
  const comment = await pool.query(`
    SELECT
      comment_evaluation
    FROM skill_evaluation
    WHERE id_evaluation = $1
  `, [id_evaluation]);


  return { comment: comment.rows, result: result.rows };
};