const pool = require("../../config/db");

///////// 1
exports.all_signal_Model = async (id) => {
    const signal_prof = await pool.query(`
      SELECT id_signal
      FROM report
      WHERE id_reporter = $1
    `, [id]);
  
    const signalIds = signal_prof.rows.map(row => row.id_signal);
  
    if (signalIds.length === 0) return []; // Aucun signal pour ce prof
  
    const result = await pool.query(`
      SELECT
        p.id_signal,
        CASE
          WHEN p.approved = true THEN 'approved'
          ELSE 'new'
        END AS signal_state,
        p.solution_state,
        t.cne,
        m.full_name,
        m.profile_picture
      FROM public.signal p
      JOIN report r ON p.id_signal = r.id_signal
      JOIN student t ON r.id_reported = t.id_member
      JOIN member m ON r.id_reported = m.id_member
      WHERE p.id_signal = ANY($1)
    `, [signalIds]);
  
    return result.rows;
  };
  
////////// 2
exports.search_signal_id_Model = async (id, id_signal) => {
  const signal_prof = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reporter = $1
  `, [id]);

  const signalIds = signal_prof.rows.map(row => row.id_signal);
  const is_signal = signalIds.includes(id_signal);

  if (is_signal) {
    const result = await pool.query(`
      SELECT
        p.id_signal,
        CASE
          WHEN p.approved = true THEN 'approved'
          ELSE 'new'
        END AS signal_state,
        p.solution_state,
        t.cne,
        m.full_name,
        m.profile_picture
      FROM public.signal p
      JOIN report r ON p.id_signal = r.id_signal
      JOIN student t ON r.id_reported = t.id_member
      JOIN member m ON r.id_reported = m.id_member
      WHERE p.id_signal = $1
    `, [id_signal]);

    return result.rows;
  } else {
    return null;
  }
};

///////// 3
exports.filtre_signal_state_Model = async (id, statut) => {
  const signal_prof = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reporter = $1
  `, [id]);

  const signalIds = signal_prof.rows.map(row => row.id_signal);

  if (signalIds.length === 0) return [];

  const result = await pool.query(`
    SELECT
      p.id_signal,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      t.cne,
      m.full_name,
      m.profile_picture
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN student t ON r.id_reported = t.id_member
    JOIN member m ON r.id_reported = m.id_member
    WHERE 
      p.id_signal = ANY($1) AND
      (
        ($2 = 'approved' AND p.approved = true) OR
        ($2 = 'new' AND p.approved = false)
      )
  `, [signalIds, statut]);

  return result.rows;
};

////////// 4
exports.filtre_solution_state_Model = async (id,statut) => {
  const signal_prof = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reporter = $1
  `, [id]);

  const signalIds = signal_prof.rows.map(row => row.id_signal);

  if (signalIds.length === 0) return []; // Aucun signal pour ce prof

  const result = await pool.query(`
    SELECT
      p.id_signal,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      t.cne,
      m.full_name,
      m.profile_picture
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN student t ON r.id_reported = t.id_member
    JOIN member m ON r.id_reported = m.id_member
    WHERE p.id_signal = ANY($1) AND p.solution_state=$2
  `, [signalIds,statut]);

  return result.rows;
};

///////// 5
exports.view_solution_Model = async (id_signal) => {
  const sol = await pool.query(`
    SELECT id_solution
    FROM public.signal
    WHERE id_signal = $1
  `, [id_signal]);

  if (sol.rows.length === 0) return null;

  const id_solution = sol.rows[0].id_solution;

  const result = await pool.query(`
    SELECT
      s.option_solution AS solution_type,
      s.subject_solution AS solution_details,
      m.full_name AS coach_name,
      f.start_date,
      f.date_done
    FROM public.solution s
    JOIN follow_up f ON f.id_solution = s.id_solution
    JOIN member m ON f.id_coach = m.id_member
    WHERE s.id_solution = $1
  `, [id_solution]);

  return result.rows;
};
