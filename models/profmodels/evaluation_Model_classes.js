const pool = require("../../config/db");

///////// 1
exports.get_sector_Model = async (id) => {
  const result = await pool.query(`
    SELECT 
      s.sector_id
      FROM public.class s
      JOIN public.teach h
      ON s.id_class=h.id_class
      WHERE h.id_member = $1
  `, [id]);

    return result.rows;
  };

///////// 2
exports.get_classes_Model = async (id, id_sector) => {
  const result = await pool.query(`
    SELECT s.id_class
    FROM public.teach h
    JOIN public.class s ON h.id_class = s.id_class
    WHERE h.id_member = $1 AND s.sector_id = $2
  `, [id, id_sector]);

  return result.rows;
};


//////// 3
exports.get_all_student_Model = async (id,id_class) => {
  const result = await pool.query(`
    SELECT 
      t.id_member,
      t.cne,
      r.profile_picture,
      -- État pour 'class'
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM skill_evaluation s 
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'class'
            AND EXTRACT(MONTH FROM s.date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM s.date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
        ) THEN 'submitted'
        WHEN EXISTS (
          SELECT 1 
          FROM skill_evaluation s 
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'class'
        ) THEN 'overdue'
        ELSE ''
      END AS isC,
  
      (
        SELECT MAX(s.date_add)
        FROM skill_evaluation s
        WHERE s.id_student = t.id_member
          AND s.id_evaluator = $1
          AND s.evaluation_context = 'class'
      ) AS lastC
  
    FROM public.student t
    JOIN public.teach h ON t.id_class = h.id_class
    JOIN public.member r ON t.id_member=r.id_member
    WHERE h.id_member = $1 AND t.id_class=$2
  `, [id,id_class]);
  return result.rows;  
};

//////// 4
exports.search_by_student_cne_Model = async (id,cne,id_class) => {
  const result = await pool.query(`
    SELECT 
      t.id_member,
      t.cne,
  
      -- État pour 'class'
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM skill_evaluation s 
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'class'
            AND EXTRACT(MONTH FROM s.date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM s.date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
        ) THEN 'submitted'
        WHEN EXISTS (
          SELECT 1 
          FROM skill_evaluation s 
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'class'
        ) THEN 'overdue'
        ELSE ''
      END AS isC,
  
      (
        SELECT MAX(s.date_add)
        FROM skill_evaluation s
        WHERE s.id_student = t.id_member
          AND s.id_evaluator = $1
          AND s.evaluation_context = 'class'
      ) AS lastC
  
    FROM public.student t
    JOIN public.teach h ON t.id_class = h.id_class
    WHERE h.id_member = $1 AND t.cne=$2 AND t.id_class=$3
  `, [id,cne,id_class]);
  return result.rows;  
};

//////// 5
exports.search_by_course_statut_Model = async (id,statut,id_class) => {
  const result = await pool.query(`
    SELECT * FROM (
      SELECT 
        t.id_member,
        t.cne,
    
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM skill_evaluation s 
            WHERE s.id_student = t.id_member
              AND s.id_evaluator = $1
              AND s.evaluation_context = 'class'
              AND EXTRACT(MONTH FROM s.date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
              AND EXTRACT(YEAR FROM s.date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
          ) THEN 'submitted'
          WHEN EXISTS (
            SELECT 1 
            FROM skill_evaluation s 
            WHERE s.id_student = t.id_member
              AND s.id_evaluator = $1
              AND s.evaluation_context = 'class'
          ) THEN 'overdue'
          ELSE ''
        END AS isC,
    
        (
          SELECT MAX(s.date_add)
          FROM skill_evaluation s
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'class'
        ) AS lastC

      FROM public.student t
      JOIN public.teach h ON t.id_class = h.id_class
      WHERE h.id_member = $1
    ) AS sub
    WHERE sub.isC = $2 AND t.id_class=$3
  `, [id, statut,id_class]);

  return result.rows;
};

//////// 6
exports.search_by_project_statut_Model = async (id,statut) => {
  const result = await pool.query(`
    SELECT * FROM (
      SELECT 
        t.id_member,
        t.cne,
    
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM skill_evaluation s 
            WHERE s.id_student = t.id_member
              AND s.id_evaluator = $1
              AND s.evaluation_context = 'class'
              AND EXTRACT(MONTH FROM s.date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
              AND EXTRACT(YEAR FROM s.date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
          ) THEN 'submitted'
          WHEN EXISTS (
            SELECT 1 
            FROM skill_evaluation s 
            WHERE s.id_student = t.id_member
              AND s.id_evaluator = $1
              AND s.evaluation_context = 'class'
          ) THEN 'overdue'
          ELSE ''
        END AS isC,
    
        (
          SELECT MAX(s.date_add)
          FROM skill_evaluation s
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'class'
        ) AS lastC,
    
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM skill_evaluation s 
            WHERE s.id_student = t.id_member
              AND s.id_evaluator = $1
              AND s.evaluation_context = 'project'
              AND EXTRACT(MONTH FROM s.date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
              AND EXTRACT(YEAR FROM s.date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
          ) THEN 'submitted'
          WHEN EXISTS (
            SELECT 1 
            FROM skill_evaluation s 
            WHERE s.id_student = t.id_member
              AND s.id_evaluator = $1
              AND s.evaluation_context = 'project'
          ) THEN 'overdue'
          ELSE ''
        END AS isP,
    
        (
          SELECT MAX(s.date_add)
          FROM skill_evaluation s
          WHERE s.id_student = t.id_member
            AND s.id_evaluator = $1
            AND s.evaluation_context = 'project'
        ) AS lastP

      FROM public.student t
      JOIN public.teach h ON t.id_class = h.id_class
      WHERE h.id_member = $1
    ) AS sub
    WHERE sub.isP = $2
  `, [id, statut]);

  return result.rows;
};

//////// 7
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
      ($1,$2,$3,$4,'class','Professor',$5)
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
  
  for (const skill of skills) {
    const insertResult = await pool.query(`
      INSERT INTO evaluations
        (id_evaluation, note_skill, skill_name)
      VALUES
        ($1, $2, $3)
      RETURNING *
    `, [id_evaluation, skill.note, skill.name]);
  
  }
  return insertResult.rows;
  

};

//////// 8
exports.view_report_Model = async (id_prof,id_student) => {

  const existingEval = await pool.query(`
    SELECT id_evaluation FROM skill_evaluation
    WHERE id_evaluator = $1
      AND id_student = $2
      AND evaluation_context = 'class'
      AND date_trunc('month', date_add) = date_trunc('month', CURRENT_DATE)
  `, [id_prof, id_student]);
  
  if (existingEval.rows.length === 0) {
    return null;
  }
  
  const result = await pool.query(`
    select * from evaluations where id_evaluation=$1
  `, [existingEval.rows[0].id_evaluation]);
  return result.rows;

};