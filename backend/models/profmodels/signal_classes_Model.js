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

///////// 3
exports.get_all_student_Model = async (id, id_class) => {
  const result = await pool.query(`
    SELECT
      t.id_member,
      t.cne,
      r.profile_picture,
      (
        SELECT MAX(s.date_add)
        FROM report rp
        JOIN signal s ON s.id_signal = rp.id_signal
        WHERE rp.id_reporter = $2 AND rp.id_reported = t.id_member
      ) AS last_signal_date,
      (
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN 'Yes'
            ELSE 'No'
          END
        FROM report rp
        JOIN signal s ON s.id_signal = rp.id_signal
        WHERE rp.id_reporter = $2 
          AND rp.id_reported = t.id_member
          AND DATE_TRUNC('month', s.date_add) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS signal_this_month
    FROM public.student t
    JOIN public.member r ON r.id_member = t.id_member
    WHERE id_class = $1
  `, [id_class, id]);

  return result.rows;
};


//////// 4
exports.search_cne_student_Model = async (id, id_class,cne) => {
  const result = await pool.query(`
    SELECT
      t.id_member,
      t.cne,
      r.profile_picture,
      (
        SELECT MAX(s.date_add)
        FROM report rp
        JOIN signal s ON s.id_signal = rp.id_signal
        WHERE rp.id_reporter = $2 AND rp.id_reported = t.id_member
      ) AS last_signal_date,
      (
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN 'Yes'
            ELSE 'No'
          END
        FROM report rp
        JOIN signal s ON s.id_signal = rp.id_signal
        WHERE rp.id_reporter = $2 
          AND rp.id_reported = t.id_member
          AND DATE_TRUNC('month', s.date_add) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS signal_this_month
    FROM public.student t
    JOIN public.member r ON r.id_member = t.id_member
    WHERE id_class = $1 and t.cne=$3
  `, [id_class, id, cne]);

  return result.rows;
};

///////// 5
exports.filter_student_Model = async (id, id_class, choice) => {
  const result = await pool.query(`
    SELECT
      t.id_member,
      t.cne,
      r.profile_picture,
      (
        SELECT MAX(s.date_add)
        FROM report rp
        JOIN signal s ON s.id_signal = rp.id_signal
        WHERE rp.id_reporter = $2 AND rp.id_reported = t.id_member
      ) AS last_signal_date,
      (
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN 'Yes'
            ELSE 'No'
          END
        FROM report rp
        JOIN signal s ON s.id_signal = rp.id_signal
        WHERE rp.id_reporter = $2 
          AND rp.id_reported = t.id_member
          AND DATE_TRUNC('month', s.date_add) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS signal_this_month
    FROM public.student t
    JOIN public.member r ON r.id_member = t.id_member
    WHERE id_class = $1
      AND (
        (
          SELECT 
            CASE 
              WHEN COUNT(*) > 0 THEN 'Yes'
              ELSE 'No'
            END
          FROM report rp
          JOIN signal s ON s.id_signal = rp.id_signal
          WHERE rp.id_reporter = $2 
            AND rp.id_reported = t.id_member
            AND DATE_TRUNC('month', s.date_add) = DATE_TRUNC('month', CURRENT_DATE)
        ) = $3
      )
  `, [id_class, id, choice]);

  return result.rows;
};

//////// 6
exports.new_signal_Model = async (id, id_student, Title, Description, Anonyme) => {
  const result = await pool.query(`
    INSERT INTO signal (message, option_signal, anony, id_member)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [Description, Title, Anonyme, id_student]);

  const id_signal = result.rows[0].id_signal;
  const date_add = result.rows[0].date_add;

  await pool.query(`
    INSERT INTO report (id_reporter, id_reported, id_signal)
    VALUES ($1, $2, $3)
  `, [id, id_student, id_signal]);

  const message = `Professor ${id} submitted a signal concerning student ${id_student} about "${Title}".`;

  await pool.query(`
    INSERT INTO news (id_member, message, type, date)
    VALUES ($1, $2, $3, $4)
  `, [id, message, 'Professor', date_add]);

  return result.rows;
};

//////// 7
exports.signal_history_Model = async (id, id_student) => {
  const signalIdsRes = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reporter = $1 AND id_reported = $2
  `, [id, id_student]);

  const signalIds = signalIdsRes.rows.map(row => row.id_signal);

  if (signalIds.length === 0) return [];

  const result = await pool.query(`
    SELECT
      date_add,
      solution_state,
      CASE
        WHEN approved = false THEN 'New'
        WHEN approved = true THEN 'Approved'
      END AS signal_state
    FROM signal
    WHERE id_signal = ANY($1)
    ORDER BY date_add DESC
  `, [signalIds]);

  return result.rows;
};

