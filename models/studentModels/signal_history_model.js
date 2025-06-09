const pool = require("../../config/db");

///////// 1
exports.all_signal_Model = async (id) => {
  const signal_etud = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reported = $1
  `, [id]);

  const signalIds = signal_etud.rows.map(row => row.id_signal);
  console.log("✅ signalIds:", signalIds);

  if (!Array.isArray(signalIds) || signalIds.length === 0) {
    console.log("⚠️ Aucun signal lié à cet utilisateur.");
    return [];
  }

  const result = await pool.query(`
    SELECT 
      p.id_signal,
      p.date_add,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      CASE 
    WHEN p.anony = true THEN 'Anonyme'
    ELSE m.full_name
  END AS full_name,
  CASE 
    WHEN p.anony = true THEN 'anonymous.png'
    ELSE m.profile_picture
  END AS profile_picture,
      te.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = r.id_reporter
          AND c.id_class = s.id_class
      ) AS project
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN member m ON r.id_reporter = m.id_member
    JOIN teach te ON r.id_reporter = te.id_member
    JOIN student s ON s.id_member = r.id_reported
    WHERE p.id_signal = ANY($1) AND s.id_class=te.id_class
  `, [signalIds]);

  const student = await pool.query(`
  SELECT 
    p.id_signal,
    p.date_add,
    CASE
      WHEN p.approved = true THEN 'approved'
      ELSE 'new'
    END AS signal_state,
    p.solution_state,
    CASE 
      WHEN p.anony = true THEN 'Anonyme'
      ELSE m.full_name
    END AS full_name,
    CASE 
      WHEN p.anony = true THEN 'anonymous.png'
      ELSE m.profile_picture
    END AS profile_picture,
    (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
    (
      SELECT DISTINCT p2.name_project
      FROM project p2
      JOIN team t ON t.id_project = p2.id_project
      JOIN team_student ts1 ON ts1.id_team = t.id_team
      JOIN team_student ts2 ON ts2.id_team = t.id_team
      WHERE ts1.student_id = r.id_reporter
        AND ts2.student_id = r.id_reported
      LIMIT 1
    ) AS project
  FROM public.signal p
  JOIN report r ON p.id_signal = r.id_signal
  JOIN member m ON r.id_reporter = m.id_member
  JOIN student s ON s.id_member = r.id_reported
  JOIN student e ON e.id_member = r.id_reporter
  WHERE p.id_signal = ANY($1) AND s.id_class = e.id_class
`, [signalIds]);


  return result.rows.concat(student.rows);


};

//////// 2
exports.signal_history_search_id_all_Model = async (id,ids) => {
  const signal_etud = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reported = $1
  `, [id]);

  const signalIds = signal_etud.rows.map(row => row.id_signal);
  

  if (!Array.isArray(signalIds) || signalIds.length === 0) {
    console.log("⚠️ Aucun signal lié à cet utilisateur.");
    return [];
  }
  if (signalIds.includes(ids)){
    const result = await pool.query(`
    SELECT 
      p.id_signal,
      p.date_add,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      CASE 
    WHEN p.anony = true THEN 'Anonyme'
    ELSE m.full_name
  END AS full_name,
  CASE 
    WHEN p.anony = true THEN 'anonymous.png'
    ELSE m.profile_picture
  END AS profile_picture,
      te.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = r.id_reporter
          AND c.id_class = s.id_class
      ) AS project
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN member m ON r.id_reporter = m.id_member
    JOIN teach te ON r.id_reporter = te.id_member
    JOIN student s ON s.id_member = r.id_reported
    WHERE p.id_signal = $1 AND s.id_class=te.id_class 
  `, [ids]);

  const student = await pool.query(`
  SELECT 
    p.id_signal,
    p.date_add,
    CASE
      WHEN p.approved = true THEN 'approved'
      ELSE 'new'
    END AS signal_state,
    p.solution_state,
    CASE 
      WHEN p.anony = true THEN 'Anonyme'
      ELSE m.full_name
    END AS full_name,
    CASE 
      WHEN p.anony = true THEN 'anonymous.png'
      ELSE m.profile_picture
    END AS profile_picture,
    (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
    (
      SELECT DISTINCT p2.name_project
      FROM project p2
      JOIN team t ON t.id_project = p2.id_project
      JOIN team_student ts1 ON ts1.id_team = t.id_team
      JOIN team_student ts2 ON ts2.id_team = t.id_team
      WHERE ts1.student_id = r.id_reporter
        AND ts2.student_id = r.id_reported
      LIMIT 1
    ) AS project
  FROM public.signal p
  JOIN report r ON p.id_signal = r.id_signal
  JOIN member m ON r.id_reporter = m.id_member
  JOIN student s ON s.id_member = r.id_reported
  JOIN student e ON e.id_member = r.id_reporter
  WHERE p.id_signal = $1 AND s.id_class = e.id_class
`, [ids]);


  return result.rows.concat(student.rows);


}else return null;
  
};

//////// 3
exports.signal_history_search_module_all_Model = async (id,idm) => {
  const signal_etud = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reported = $1
  `, [id]);

  const signalIds = signal_etud.rows.map(row => row.id_signal);
  

  if (!Array.isArray(signalIds) || signalIds.length === 0) {
    console.log("⚠️ Aucun signal lié à cet utilisateur.");
    return [];
  }
  
    const result = await pool.query(`
    SELECT 
      p.id_signal,
      p.date_add,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      CASE 
    WHEN p.anony = true THEN 'Anonyme'
    ELSE m.full_name
  END AS full_name,
  CASE 
    WHEN p.anony = true THEN 'anonymous.png'
    ELSE m.profile_picture
  END AS profile_picture,
      te.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = r.id_reporter
          AND c.id_class = s.id_class
      ) AS project
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN member m ON r.id_reporter = m.id_member
    JOIN teach te ON r.id_reporter = te.id_member
    JOIN student s ON s.id_member = r.id_reported
    WHERE p.id_signal = ANY($1) AND s.id_class=te.id_class AND te.course=$2
  `, [signalIds,idm]);

  const student = await pool.query(`
  SELECT 
    p.id_signal,
    p.date_add,
    CASE
      WHEN p.approved = true THEN 'approved'
      ELSE 'new'
    END AS signal_state,
    p.solution_state,
    CASE 
      WHEN p.anony = true THEN 'Anonyme'
      ELSE m.full_name
    END AS full_name,
    CASE 
      WHEN p.anony = true THEN 'anonymous.png'
      ELSE m.profile_picture
    END AS profile_picture,
    (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class 
      LIMIT 1
      ) AS module,
    (
      SELECT DISTINCT p2.name_project
      FROM project p2
      JOIN team t ON t.id_project = p2.id_project
      JOIN team_student ts1 ON ts1.id_team = t.id_team
      JOIN team_student ts2 ON ts2.id_team = t.id_team
      WHERE ts1.student_id = r.id_reporter
        AND ts2.student_id = r.id_reported
      LIMIT 1
    ) AS project
  FROM public.signal p
  JOIN report r ON p.id_signal = r.id_signal
  JOIN member m ON r.id_reporter = m.id_member
  JOIN student s ON s.id_member = r.id_reported
  JOIN student e ON e.id_member = r.id_reporter
  WHERE p.id_signal = ANY($1) AND s.id_class = e.id_class AND (
    SELECT te2.course
    FROM teach te2
    WHERE te2.id_class = s.id_class
    LIMIT 1
  ) = $2
`, [signalIds,idm]);


  return result.rows.concat(student.rows);

  
};

/////// 4
exports.signal_history_filtre_statesignal_all_Model = async (id,state) => {
  const signal_etud = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reported = $1
  `, [id]);

  const signalIds = signal_etud.rows.map(row => row.id_signal);
  console.log("✅ signalIds:", signalIds);

  if (!Array.isArray(signalIds) || signalIds.length === 0) {
    console.log("⚠️ Aucun signal lié à cet utilisateur.");
    return [];
  }

  const result = await pool.query(`
    SELECT 
      p.id_signal,
      p.date_add,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      CASE 
    WHEN p.anony = true THEN 'Anonyme'
    ELSE m.full_name
  END AS full_name,
  CASE 
    WHEN p.anony = true THEN 'anonymous.png'
    ELSE m.profile_picture
  END AS profile_picture,
      te.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = r.id_reporter
          AND c.id_class = s.id_class
      ) AS project
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN member m ON r.id_reporter = m.id_member
    JOIN teach te ON r.id_reporter = te.id_member
    JOIN student s ON s.id_member = r.id_reported
    WHERE p.id_signal = ANY($1) AND s.id_class=te.id_class AND (
  CASE
    WHEN p.approved = true THEN 'approved'
    ELSE 'new'
  END
) = $2

  `, [signalIds,state]);

  const student = await pool.query(`
  SELECT 
    p.id_signal,
    p.date_add,
    CASE
      WHEN p.approved = true THEN 'approved'
      ELSE 'new'
    END AS signal_state,
    p.solution_state,
    CASE 
      WHEN p.anony = true THEN 'Anonyme'
      ELSE m.full_name
    END AS full_name,
    CASE 
      WHEN p.anony = true THEN 'anonymous.png'
      ELSE m.profile_picture
    END AS profile_picture,
    (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
    (
      SELECT DISTINCT p2.name_project
      FROM project p2
      JOIN team t ON t.id_project = p2.id_project
      JOIN team_student ts1 ON ts1.id_team = t.id_team
      JOIN team_student ts2 ON ts2.id_team = t.id_team
      WHERE ts1.student_id = r.id_reporter
        AND ts2.student_id = r.id_reported
      LIMIT 1
    ) AS project
  FROM public.signal p
  JOIN report r ON p.id_signal = r.id_signal
  JOIN member m ON r.id_reporter = m.id_member
  JOIN student s ON s.id_member = r.id_reported
  JOIN student e ON e.id_member = r.id_reporter
  WHERE p.id_signal = ANY($1) AND s.id_class = e.id_class AND (
  CASE
    WHEN p.approved = true THEN 'approved'
    ELSE 'new'
  END
) = $2

`, [signalIds,state]);


  return result.rows.concat(student.rows);


};

/////// 5
exports.signal_history_filtre_solutionsignal_all_Model = async (id,state) => {
  const signal_etud = await pool.query(`
    SELECT id_signal
    FROM report
    WHERE id_reported = $1
  `, [id]);

  const signalIds = signal_etud.rows.map(row => row.id_signal);
  console.log("✅ signalIds:", signalIds);

  if (!Array.isArray(signalIds) || signalIds.length === 0) {
    console.log("⚠️ Aucun signal lié à cet utilisateur.");
    return [];
  }

  const result = await pool.query(`
    SELECT 
      p.id_signal,
      p.date_add,
      CASE
        WHEN p.approved = true THEN 'approved'
        ELSE 'new'
      END AS signal_state,
      p.solution_state,
      CASE 
    WHEN p.anony = true THEN 'Anonyme'
    ELSE m.full_name
  END AS full_name,
  CASE 
    WHEN p.anony = true THEN 'anonymous.png'
    ELSE m.profile_picture
  END AS profile_picture,
      te.course AS module,
      (
        SELECT name_project 
        FROM project c 
        WHERE c.id_prof = r.id_reporter
          AND c.id_class = s.id_class
      ) AS project
    FROM public.signal p
    JOIN report r ON p.id_signal = r.id_signal
    JOIN member m ON r.id_reporter = m.id_member
    JOIN teach te ON r.id_reporter = te.id_member
    JOIN student s ON s.id_member = r.id_reported
    WHERE p.id_signal = ANY($1) AND s.id_class=te.id_class AND p.solution_state=$2
  `, [signalIds,state]);

  const student = await pool.query(`
  SELECT 
    p.id_signal,
    p.date_add,
    CASE
      WHEN p.approved = true THEN 'approved'
      ELSE 'new'
    END AS signal_state,
    p.solution_state,
    CASE 
      WHEN p.anony = true THEN 'Anonyme'
      ELSE m.full_name
    END AS full_name,
    CASE 
      WHEN p.anony = true THEN 'anonymous.png'
      ELSE m.profile_picture
    END AS profile_picture,
    (
      SELECT te2.course
      FROM teach te2
      WHERE te2.id_class = s.id_class
      LIMIT 1
      ) AS module,
    (
      SELECT DISTINCT p2.name_project
      FROM project p2
      JOIN team t ON t.id_project = p2.id_project
      JOIN team_student ts1 ON ts1.id_team = t.id_team
      JOIN team_student ts2 ON ts2.id_team = t.id_team
      WHERE ts1.student_id = r.id_reporter
        AND ts2.student_id = r.id_reported
      LIMIT 1
    ) AS project
  FROM public.signal p
  JOIN report r ON p.id_signal = r.id_signal
  JOIN member m ON r.id_reporter = m.id_member
  JOIN student s ON s.id_member = r.id_reported
  JOIN student e ON e.id_member = r.id_reporter
  WHERE p.id_signal = ANY($1) AND s.id_class = e.id_class AND p.solution_state=$2
`, [signalIds,state]);


  return result.rows.concat(student.rows);


};