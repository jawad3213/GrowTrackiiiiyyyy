const pool = require('../../config/db');

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


exports.getProjects = async (id_student) => {
    try{
        const result = await pool.query(
            `
            SELECT  p.id_project, p.name_project, m.full_name AS professor_name , tc.course AS module, t.team_name , p.end_date AS Deadline
            FROM  public.student s
            JOIN public.team_student ts ON s.id_member = ts.student_id
            JOIN public.team t ON ts.id_team = t.id_team
            JOIN public.project p ON t.id_project = p.id_project
            JOIN public.professor pr ON p.id_prof = pr.id_member
            JOIN public.member m ON pr.id_member = m.id_member
            JOIN public.teach tc ON pr.id_member = tc.id_member
            WHERE s.id_member = $1
            `,[id_student]
        )
        return result.rows;
    }catch(error){
        console.error("erreur dans getProjects", error);
        throw error;
    }
}

exports.getMemberProject = async (id_student,id_projet) => {
    try{
        const team = await pool.query(
            `
            SELECT t.id_team
            FROM public.team t 
            JOIN public.team_student ts ON t.id_team = ts.id_team
            WHERE ts.student_id = $1 AND t.id_project = $2
            `,[id_student,id_projet]
        )
        const result = await pool.query(
            `
            SELECT m.id_member, m.full_name 
            FROM member m 
            JOIN public.student s ON m.id_member = s.id_member
            JOIN public.team_student ts ON s.id_member = ts.student_id
            WHERE ts.id_team =$1`
            ,[team.rows[0]?.id_team]
        )
        return result.rows;
    }catch(error){
        console.error("erreur dans getMemberProjects", error);
        throw error;
    }
}


exports.addSignal = async (id_student, reported , title, description,anony) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO public.signal (id_signal,id_member, message, anony, option_signal) 
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `, [id_student, description, anony, title]

        );

        await pool.query(
            `
            INSERT INTO public.report (id_reporter, id_reported, id_signal)
            VALUES ($1, $2, $3)
            `, [id_student, reported, result.rows[0].id_signal]
        );
        
        return result.rows[0];
    } catch (error) {
        console.error("Error adding signal:", error);
        throw error;
    }
}


exports.getSkillName = async () => {
    try{
        const result = await pool.query(
            `
            SELECT skill_name FROM public.skill
            `
        )
        return result.rows;
    }catch(error){
        console.error("erreur dans getskillName", error);
        throw error;
    }
}



exports.setEvaluation = async (id_student, id_team, ratings, evaluated, message) => {
    const client = await pool.connect();
    try {
        let rate = 0;
        for (const rating of ratings) {
            rate += parseInt(rating.rate, 10);
        }
        await client.query('BEGIN');

        const result = await client.query(`
            INSERT INTO public.skill_evaluation (id_evaluation, note_evaluation, type_evaluation, comment_evaluation, id_team, id_student, id_evaluator, evaluation_context, date_add)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id_evaluation`,
            [rate * 0.3, 'Pair', message, id_team, evaluated, id_student, 'project']
        );
        const id_evaluation = result.rows[0].id_evaluation;

        for (const rating of ratings) {
            await client.query(
                `
                INSERT INTO public.evaluations
                (id_evaluation, note_skill, skill_name )
                VALUES ($1, $2, $3)
                `,
                [
                    id_evaluation,
                    rating.rate,
                    rating.skillName
                ]
            );
        }
        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        //just smtg to help with debugging and errors
        // Store the original error
        const originalError = error;
        
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            // Log the rollback error but don't let it override the original error
            console.error('ROLLBACK failed:', rollbackError);
        }
        
        console.error("Erreur dans setEvaluation", originalError);
        throw originalError; // Always throw the original error, not the rollback error
    } finally {
        client.release();
    }
};