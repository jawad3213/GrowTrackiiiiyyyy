const pool = require("../../config/db");

exports.number_of_evaluation_submitted_Model = async () => {
    const currentMonth = new Date().getMonth() + 1; 
    const currentYear = new Date().getFullYear();
  
    let months = [];
    let years = [];
  
    if (currentMonth <= 6) {
  
      for (let m = 9; m <= 12; m++) {
        months.push(m);
        years.push(currentYear - 1);
      }
      
      for (let m = 1; m <= 6; m++) {
        months.push(m);
        years.push(currentYear);
      }
    } else {
      
      for (let m = 9; m <= 12; m++) {
        months.push(m);
        years.push(currentYear);
      }
      
      for (let m = 1; m <= 6; m++) {
        months.push(m);
        years.push(currentYear + 1);
      }
    }
  
    const data = [];
    for (let i = 0; i < months.length; i++) {
      const res = await pool.query(
        `SELECT COUNT(*) FROM public.skill_evaluation WHERE EXTRACT(MONTH FROM date_add) = $1 AND EXTRACT(YEAR FROM date_add) = $2`,
        [months[i], years[i]]
      );
      data.push(parseInt(res.rows[0].count));
    }
    return {
      data
    };
   
  };
////////////////
// in models/EvaluationModel.js
exports.search_by_id_evaluation_Model = async (id_evaluation) => {
  const result = await pool.query(`
    SELECT 
      se.id_evaluation,
      evaluator.role               AS evaluator_role,
      evaluator.profile_picture    AS evaluator_profile_picture,
      evaluator.full_name          AS evaluator_full_name,
      student.role                 AS student_role,
      student.profile_picture      AS student_profile_picture,
      student.full_name            AS student_full_name,
      se.date_add,
      se.type_evaluation,
      -- aggregate all skills for this evaluation into one JSON array
      COALESCE(
        json_agg(
          json_build_object(
            'skill_name', ev.skill_name,
            'note_skill',  ev.note_skill
          )
        ) FILTER (WHERE ev.skill_name IS NOT NULL),
        '[]'
      ) AS skills
    FROM public.skill_evaluation se
    JOIN public.member evaluator
      ON se.id_evaluator = evaluator.id_member
    JOIN public.member student
      ON se.id_student   = student.id_member
    LEFT JOIN public.evaluations ev
      ON se.id_evaluation = ev.id_evaluation
    WHERE se.id_evaluation = $1
    GROUP BY
      se.id_evaluation,
      evaluator.role,
      evaluator.profile_picture,
      evaluator.full_name,
      student.role,
      student.profile_picture,
      student.full_name,
      se.date_add,
      se.type_evaluation
  `, [id_evaluation]);

  return result.rows; 
};

///////////////
exports.filter_by_type_Model = async (type) => {
  const result = await pool.query(`
    SELECT 
      se.id_evaluation,
      evaluator.role AS evaluator_role,
      evaluator.profile_picture AS evaluator_profile_picture,
      evaluator.full_name AS evaluator_full_name,
      student.role AS student_role,
      student.profile_picture AS student_profile_picture,
      student.full_name AS student_full_name,
      se.date_add,
      se.type_evaluation
    FROM 
      public.skill_evaluation se
    JOIN 
      public.member evaluator 
    ON 
      se.id_evaluator = evaluator.id_member
    JOIN 
      public.member student 
    ON 
      se.id_student = student.id_member
    WHERE se.type_evaluation=$1
  `,[type]);

  return result.rows; 
  
};
////////////////
exports.all_evaluation_Model = async () => {
  const result = await pool.query(`
    SELECT 
      se.id_evaluation,
      evaluator.role AS evaluator_role,
      evaluator.profile_picture AS evaluator_profile_picture,
      evaluator.full_name AS evaluator_full_name,
      student.role AS student_role,
      student.profile_picture AS student_profile_picture,
      student.full_name AS student_full_name,
      se.date_add,
      se.type_evaluation
    FROM 
      public.skill_evaluation se
    JOIN 
      public.member evaluator 
    ON 
      se.id_evaluator = evaluator.id_member
    JOIN 
      public.member student 
    ON 
      se.id_student = student.id_member
  `);
  return result.rows;
};
///////////////
