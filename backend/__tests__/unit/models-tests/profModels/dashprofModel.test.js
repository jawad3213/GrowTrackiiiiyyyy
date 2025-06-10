const pool = require('../../config/db');

const total = async (id) => {
  try {
    const result = await pool.query(
      `SELECT COUNT( id_class) AS total FROM public.teach WHERE id_member = $1`,
      [id]
    );
    return parseInt(result.rows[0]?.total || 0, 10);
  } catch (error) {
    console.error("Erreur dans total():", error);
    throw error;
  }
};

const totalstudent = async (id) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(s.id_member) as total
       FROM public.student s
       JOIN public.teach t ON t.id_class = s.id_class
       WHERE t.id_member = $1`,
      [id]
    );
    return parseInt(result.rows[0]?.total || 0, 10);
  } catch (error) {
    console.error("error dans totalstudent", error);
    throw error;
  }
};

const classes = async (id) => {
  try {
    const result = await pool.query(
      `SELECT id_class AS class FROM public.teach WHERE id_member = $1`,
      [id]
    );
    return result.rows;
  } catch (error) {
    console.error("erreur dans classes : ", error);
    throw error;
  }
};

const getGraphSignal = async (id_class) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(r.id_signal) AS TOTAL,
        TO_CHAR(date_trunc('month', s.date_add), 'YYYY-MM') AS month
      FROM public.class c
        JOIN public.student st ON c.id_class = st.id_class
        JOIN public.report r ON r.id_reporter = st.id_member
        JOIN public.signal s ON s.id_signal = r.id_signal
      WHERE c.id_class = $1
      GROUP BY 2
      ORDER BY 2`,
      [id_class]
    );
    return result.rows;
  } catch (error) {
    console.error("erreur dans graphe", error);
    throw error;
  }
};

const getGraphEvaluation = async (id_class, month) => {
  try {
    const result = await pool.query(
      `
      WITH days AS (
        SELECT generate_series(
          date_trunc('month', current_date)::date,
          (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
          interval '1 day'
        ) AS day
      )
      SELECT TO_CHAR(d.day, 'MM-DD') as day, COUNT(e.id_evaluation) as total
      FROM days d
      LEFT JOIN public.skill_evaluation e 
        ON date_trunc('day', e.date_add) = d.day
        AND e.id_class = $1
        AND EXTRACT(MONTH FROM e.date_add) = $2
      GROUP BY d.day
      ORDER BY d.day
      `,
      [id_class, month]
    );
    return result.rows;
  } catch (error) {
    console.error("erreur dans graphe", error);
    throw error;
  }
};

const greatestAll = async (id_prof) => {
  try {
    const classesResult = await pool.query(
      `SELECT id_class FROM public.teach WHERE id_member = $1`,
      [id_prof]
    );
    const classIds = classesResult.rows.map(row => row.id_class);

    if (classIds.length === 0) return [];

    const result = await pool.query(
      `SELECT m.full_name, s.cne, m.profile_picture, s.sector_id, s.id_class,
              ROUND(AVG(e.score), 2) AS average
       FROM public.student s
       JOIN public.member m ON s.id_member = m.id_member
       JOIN public.skill_evaluation e ON s.id_member = e.id_student
       WHERE s.id_class = ANY($1)
       GROUP BY m.full_name, s.cne, m.profile_picture, s.sector_id, s.id_class
       ORDER BY average DESC
       LIMIT 5`,
      [classIds]
    );
    return result.rows;
  } catch (error) {
    console.error("error dans greatestAll:", error);
    throw error;
  }
};

const profile = async (id) => {
  try {
    const result = await pool.query(
      `SELECT m.profile_picture, m.full_name, m.cin, m.email, p.code, p.department
       FROM public.member m
       JOIN public.professor p ON m.id_member = p.id_member
       WHERE m.id_member = $1`,
      [id]
    );
    return result?.rows?.[0] || "le prof n'existe pas !";
  } catch (error) {
    console.error("le probleme dans profile :", error);
    throw error;
  }
};

const totalEvaluation = async (id) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(id_evaluation) AS "LES EVALUATIONS DE CE MOIS-CI" 
       FROM public.skill_evaluation 
       WHERE id_evaluator = $1
       AND date_add >= CURRENT_DATE - INTERVAL '1 MONTH' `,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("le probleme dans totalEvaluation :", error);
    throw error;
  }
};

module.exports = {
  total,
  totalstudent,
  classes,
  getGraphSignal,
  getGraphEvaluation,
  greatestAll,
  profile,
  totalEvaluation
};
