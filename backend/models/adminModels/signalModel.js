const pool = require("../../config/db");


exports.getAllSignals = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                r.id_signal,
                r.id_reporder,
                reporder.full_name AS reporder_name,
                reporder.role AS reporder_role,
                r.id_reported,
                reported.full_name AS reported_name,
                reported.role AS reported_role,
                s.approved,
                s.solution_state
                FROM public.report r
                JOIN public.member reporder ON reporder.id_member = r.id_reporter
                JOIN public.member reported ON reported.id_member = r.id_reported;
                JOIN public.signal s ON s.id_signal = r.id_signal `
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
        "SELECT COUNT(id_signal) AS total FROM public.signal"
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error retrieving total number of signals:", error);
      throw error;
    }
  };

exports.getSignalById = async (id_signal) => {
    const result = await pool.query(
        `SELECT 
            reporder.full_name AS reported_by,
            reporder.role AS reporter_role,

            reported.full_name AS reported_user,
            reported.role AS reported_role,

            s.date_add AS submitted_date,
            s.option_signal AS reason,
            s.prove

            FROM report r
            JOIN signal s ON r.id_signal = s.id_signal
            JOIN member reporder ON reporder.id_member = r.id_reporter
            JOIN member reported ON reported.id_member = r.id_reported;
            `
    )
    return result.rows[0];
}

exports.solution = async (id_signal, option_solution,subject_solution, name_coach,date_start,date_done) => {
    try{
        const coach = await pool.query(
            `SELECT id_member FROM public.member WHERE full_name = $1`,
            [name_coach]
        )

        const result = await pool.query(
            `INSERT INTO public.solution(id_signal, option_solution,subject_solution, id_coach ,date_start,date_done) VALUE($1,$2,$3,$4,$5,$6)RETURNNING *`,
            [id_signal, option_solution,subject_solution, coach.rows[0].id_member,date_start,date_done]
        )

        const student = await pool.query(
            `SELECT id_reported FROM public.report WHERE id_signal = $1`,
            [id_signal]
        )
        
        await pool.query(
            `INSERT INTO public.follow_up (id_coach,id_student,id_solution) VALUE ($1,$2,$3)`,
            [coach.rows[0].id_member,student.rows[0].id_reported,result.rows[0].id_solution]
        )
        return result.rows[0];
    }catch (error) {
        console.error("Error retrieving signals:", error);
        throw error;
    }
}

exports.deleteSignal = async (id) => {
    try {
  
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