const  pool =require("../../config/db");


exports.getNombreProjets = async (id_student) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(t.id_project ) 
            FROM
                 public.student s JOIN public.team_student ts ON s.id_member = ts.student_id
                 JOIN public.team t ON ts.id_team = t.id_team
            WHERE s.id_member = $1
            `,[id_student]
        )
        return result.rows[0];
    }catch(error){
        console.error("erreur dans getNombreProjets",error);
        throw error
    }
}

exports.getNumberOfSignal = async (id_student) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(r.id_signal) AS total
            FROM public.report r
            JOIN public.student s ON r.id_reported = s.id_member
            JOIN public.signal sig ON r.id_signal = sig.id_signal
            WHERE s.id_member = $1
            AND sig.date_add >= CURRENT_DATE - INTERVAL '1 MONTH' `,
            [id_student]
        )
        return result.rows[0];
    }catch(error){
        console.error("erreur dans getNumberOfSignal",error);
        throw error

    }
}


exports.getMoyenneDansLaClasse = async (id_student) => {
    try{
        const classe = await pool.query(
            `SELECT id_class FROM public.student WHERE id_member = $1`,
            [id_student]
        )
        const result = await pool.query(
            `SELECT AVG(note_evaluation) AS moyenne
            FROM public.skill_evaluation
            WHERE id_class = $1`,
            [classe.rows[0].id_class]
        )
        return result.rows[0];
    }catch(error){
        console.log("erreur dans getMoyenneDansLaClasse",error);
        throw error;
    }

}
