const pool = require("../../config/db");


exports.getAllSignals = async () => {
    try {
        const result = await pool.query(
          // r.id_reporder, r.id_reported,
            `SELECT 
                r.id_signal,
                reporder.profile_picture AS reporder_picture,
                reporder.full_name AS reporder_name,
                reporder.role AS reporder_role,

                reported.profile_picture AS reported_picture,
                reported.full_name AS reported_name,
                reported.role AS reported_role,

                s.approved,
                s.solution_state
            FROM public.report r
            JOIN public.member reporder ON reporder.id_member = r.id_reporter
            JOIN public.member reported ON reported.id_member = r.id_reported
            JOIN public.signal s ON s.id_signal = r.id_signal
 `
        );

        //   const signals = await Promise.all(
        //     result.rows.map(async (row) => {
        //       const typeResult = await pool.query(
        //         "SELECT role FROM public.member WHERE id_member = $1",
        //         [row.id_reporder] // ou id_reported selon besoin
        //       );
        //       return {
        //         ...row,
        //         role: typeResult.rows[0]?.role || null
        //       };
        //     })
        // );


        return result;
    } catch (error) {
        console.error("Error retrieving signals:", error);
        throw error;
    }
};

exports.total = async () => {
  try {
    const result = await pool.query(
      `SELECT COUNT(id_signal) AS total 
       FROM public.signal
       WHERE date_add >= CURRENT_DATE - INTERVAL '1 month'
      `
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total number of signals:", error);
    throw error;
  }
};


exports.getSignalById = async (id_signal) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        r.id_signal,

        -- Infos du signaleur (reporter)
        reporter.profile_picture  AS reporter_picture,
        reporter.full_name        AS reporter_name,
        reporter.role             AS reporter_role,

        -- Infos de l’utilisateur signalé
        reported.profile_picture  AS reported_picture,
        reported.full_name        AS reported_name,
        reported.role             AS reported_role,

        -- Métadonnées du signal
        s.date_add                AS submitted_date,
        s.option_signal           AS reason
      FROM public.report  r
      JOIN public.signal  s        ON s.id_signal = r.id_signal
      JOIN public.member  reporter ON reporter.id_member = r.id_reporter
      JOIN public.member  reported ON reported.id_member = r.id_reported
      WHERE r.id_signal = $1
      LIMIT 1;
      `,
      [id_signal]
    );

    return rows[0] || null; // null si non trouvé
  } catch (err) {
    // On remonte l’erreur au contrôleur
    throw err;
  }
};


exports.solution = async (id_signal, option_solution, details, name_coach, start_date, date_done) => {
  try {
    // 1. Trouver l'id du coach
    const coach = await pool.query(
      `SELECT id_member FROM public.member WHERE full_name = $1`,
      [name_coach]
    );

    // 2. Trouver l'id de la solution
    const solution = await pool.query(
      `SELECT id_solution FROM public.solution WHERE option_solution = $1`,
      [option_solution]
    );

    // 3. Trouver l'étudiant signalé
    const student = await pool.query(
      `SELECT id_reported FROM public.report WHERE id_signal = $1`,
      [id_signal]
    );

    // 4. Insérer dans la table follow_up
    await pool.query(
      `INSERT INTO public.follow_up (id_coach, id_student, id_solution, message, start_date, date_done)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [coach.rows[0].id_member, student.rows[0].id_reported, solution.rows[0].id_solution, details, start_date, date_done]
    );

    // 5. Mettre à jour la table signal pour associer la solution
    await pool.query(
      `UPDATE public.signal SET id_solution = $1 WHERE id_signal = $2`,
      [solution.rows[0].id_solution, id_signal]
    );


    // 6. Mettre à jour le statut de la solution
    await pool.query(
      `UPDATE public.signal SET solution_state = 'in progress' WHERE id_signal = $1`,
      [id_signal]
    );

    await pool.query(
      `UPDATE public.signal SET approved = TRUE WHERE id_signal = $1`,
      [id_signal]
    )

    // 7. Insérer dans la table notifications
    await pool.query(
      `INSERT INTO public.notifications(content_notification,id_member) VALUES ($1,$2)`,
      [details,student.rows[0].id_reported]
    )

    // Retourner un message de succès (pas result.rows[0] car pas RETURNING)
    return { message: "Solution created and follow-up inserted successfully." };

  } catch (error) {
    console.error("Error inserting solution:", error);
    throw error;
  }
};

exports.sendAlert = async (id_signal, details) => {
  try {
    
    // 3. Trouver l'étudiant signalé
    const reporder = await pool.query(
      `SELECT id_reporter FROM public.report WHERE id_signal = $1`,
      [id_signal]
    );

    // 3. Trouver l'étudiant signalé
    const reporter = await pool.query(
      `SELECT id_reported FROM public.report WHERE id_signal = $1`,
      [id_signal]
    );

    
    // 6. Mettre à jour le statut de la solution
    await pool.query(
      `UPDATE public.signal SET solution_state = 'in progress' WHERE id_signal = $1`,
      [id_signal]
    );

    // 7. Insérer dans la table notifications
    await pool.query(
      `INSERT INTO public.notifications(content_notification,id_member,id_reporter) VALUES ($1,$2,$3)`,
      [details,reporter.rows[0].id_reported,reporder.rows[0].id_reporter]
    )

    // Retourner un message de succès (pas result.rows[0] car pas RETURNING)
    return { message: "Solution created successfully." };

  } catch (error) {
    console.error("Error inserting solution:", error);
    throw error;
  }
};


exports.deleteSignal = async (id) => {
    try {

      await pool.query(
        "DELETE FROM public.report WHERE id_siganl = $1",
        [id]
      );

      
  
      const result = await pool.query(
        "DELETE FROM public.signal WHERE id_siganl = $1",
        [id]
      );
  
      return result;
    } catch (error) {
      console.error("Error deleting signal:", error);
      throw error;
    }
  };