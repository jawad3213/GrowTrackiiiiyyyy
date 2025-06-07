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

exports.getEvaluationSubmitted = async (id) => {
    try {
        const classe = await pool.query(
            `SELECT id_class FROM public.student WHERE id_member = $1`,
            [id]
        );
        const result1 = await pool.query(
            `SELECT COUNT( DISTINCT id_member ) AS count FROM public.student WHERE id_class = $1`,
            [classe.rows[0].id_class]
        );
        const result2 = await pool.query(
            `SELECT COUNT(t.id_project ) AS count
            FROM public.student s
            JOIN public.team_student ts ON s.id_member = ts.student_id
            JOIN public.team t ON ts.id_team = t.id_team
            WHERE s.id_member = $1`,
            [id]
        );
        // Conversion en nombre
        const count1 = parseInt(result1.rows[0].count, 10) || 0;
        const count2 = parseInt(result2.rows[0].count, 10) || 0;
        const total = count1 + 5 * count2;
        return { total };
    } catch (error) {
        console.error("erreur dans getEvaluationSubmitted", error);
        throw error;
    }
}

exports.getEvaluationAssigned = async (id) => {
    try{
        const result = await pool.query(
            `SELECT COUNT (id_evaluator ) 
            FROM public.skill_evaluation WHERE id_evaluator = $1
            AND date_add >= CURRENT_DATE - INTERVAL '1 MONTH ' `,
            [id]
        )
        const total = parseInt(result.rows[0].count, 10) || 0;
        return {total }
    }catch(error){
        console.error("erreur dans getEvaluationSubmitted",error);
        throw error;
    }

}


exports.getRadarByClass = async (id_student) => {
    try {
        // Récupérer la classe de l'étudiant
        const classe = await pool.query(
            `SELECT id_class FROM public.student WHERE id_member = $1`,
            [id_student]
        );
        const id_class = classe.rows[0]?.id_class;
        if (!id_class) return [];

        // Récupérer toutes les skills
        const skills = await pool.query(`SELECT skill_name FROM public.skill`);

        // Pour chaque skill, calculer la moyenne
        const results = [];
        for (const skill of skills.rows) {
            const result = await pool.query(
                `SELECT AVG(e.note_skill) AS moyenne
                 FROM public.evaluations e
                 JOIN public.skill_evaluation sk ON e.id_evaluation = sk.id_evaluation
                 WHERE e.skill_name = $1 AND sk.id_class = $2 AND sk.id_student =$3`,
                [skill.skill_name, id_class,id_student]
            );
            results.push({
                skill_name: skill.skill_name,
                moyenne: parseFloat(result.rows[0].moyenne) || 0
            });
        }
        return results;
    } catch (error) {
        console.error("erreur dans getStatisticsbyclass", error);
        throw error;
    }
}

//les noms des projets pour le radar par projet
exports.getProjects = async (id_student) => {
    try{
        const result = await pool.query(
            `
            SELECT  p.name_project
            FROM  public.student s
            JOIN public.team_student ts ON s.id_member = ts.student_id
            JOIN public.team t ON ts.id_team = t.id_team
            JOIN public.project p ON t.id_project = p.id_project
            WHERE s.id_member = $1
            `,[id_student]
        )
        return result.rows;
    }catch(error){
        console.error("erreur dans getProjects", error);
        throw error;
    }
}
//modified by rim, bach matfailich fonction in case project is undefined (--> team undefined)
exports.getRadarByProject = async (id_student, project) => {
    try {
        const projects = await pool.query(
            `SELECT id_project FROM public.project WHERE name_project = $1`,
            [project]
        );
        
        // Check if project exists
        const id_project = projects.rows[0]?.id_project;
        if (!id_project) return [];
        
        const team = await pool.query(
            `SELECT t.id_team FROM public.team_student ts 
            JOIN public.team t ON ts.id_team = t.id_team
            WHERE ts.student_id = $1 AND t.id_project = $2`,
            [id_student, id_project]
        );

        const id_team = team.rows[0]?.id_team;
        if (!id_team) return [];

        const skills = await pool.query(`SELECT skill_name FROM public.skill`);

        const results = [];
        for (const skill of skills.rows) {
            const result = await pool.query(
                `SELECT AVG(e.note_skill) AS moyenne
                 FROM public.evaluations e
                 JOIN public.skill_evaluation sk ON e.id_evaluation = sk.id_evaluation
                 WHERE e.skill_name = $1 AND sk.id_team = $2 AND sk.id_student = $3`,
                [skill.skill_name, id_team, id_student]
            );
            results.push({
                skill_name: skill.skill_name,
                moyenne: parseFloat(result.rows[0].moyenne) || 0
            });
        }
        return results;
    } catch (error) {
        console.error("erreur dans getRadarByProject", error);
        throw error;
    }
}
exports.getEvaluationCountByRoleAndMonth = async (id_student) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM e.date_add) AS month_number,
                TO_CHAR(e.date_add, 'Month') AS month,
                m.role AS role,
                COUNT(*) AS count
            FROM public.skill_evaluation e
            JOIN public.member m ON e.id_evaluator = m.id_member
            WHERE e.id_student = $1
              AND (
                (EXTRACT(MONTH FROM e.date_add) >= 9 AND EXTRACT(MONTH FROM e.date_add) <= 12)
                OR (EXTRACT(MONTH FROM e.date_add) >= 1 AND EXTRACT(MONTH FROM e.date_add) <= 6)
              )
            GROUP BY month_number, month, role
            ORDER BY 
                CASE 
                    WHEN EXTRACT(MONTH FROM e.date_add) >= 9 THEN EXTRACT(MONTH FROM e.date_add)
                    ELSE EXTRACT(MONTH FROM e.date_add) + 12
                END,
                role
        `, [id_student]);

        // Structure les données pour le frontend (groupées par mois)
        const data = {};
        result.rows.forEach(row => {
            const month = row.month.trim();
            if (!data[month]) data[month] = {};
            data[month][row.role] = parseInt(row.count, 10);
        });

        // Ordre des mois universitaire : septembre (9) à juin (6)
        const monthsOrder = [9,10,11,12,1,2,3,4,5,6];
        const monthNames = {
            1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
            9: "September", 10: "October", 11: "November", 12: "December"
        };
        const roles = ['Professor', 'Supervisor', 'Pair'];
        const chartData = monthsOrder.map(m => {
            const month = monthNames[m];
            const entry = { month };
            roles.forEach(role => {
                entry[role] = data[month] && data[month][role] ? data[month][role] : 0;
            });
            return entry;
        });

        return chartData;
    } catch (error) {
        console.error("Erreur dans getEvaluationCountByRoleAndMonth", error);
        throw error;
    }
};


// skills for le graph

exports.getSkills = async () => {
    try {
        const result = await pool.query(
            `SELECT skill_name FROM public.skill`
        );
        return result.rows;
    } catch (error) {
        console.error("Erreur dans getskills", error);
        throw error;
    }
};
exports.getSkillRatingByMonth = async (id_student, skill_name) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM e.date_add) AS month_number,
                TO_CHAR(e.date_add, 'Mon') AS month,
                AVG(ev.note_skill) AS moyenne
            FROM public.skill_evaluation e
            JOIN public.evaluations ev ON e.id_evaluation = ev.id_evaluation
            WHERE e.id_student = $1
              AND ev.skill_name = $2
              AND (
                (EXTRACT(MONTH FROM e.date_add) >= 9 AND EXTRACT(MONTH FROM e.date_add) <= 12)
                OR (EXTRACT(MONTH FROM e.date_add) >= 1 AND EXTRACT(MONTH FROM e.date_add) <= 6)
              )
            GROUP BY month_number, month
            ORDER BY 
                CASE 
                    WHEN EXTRACT(MONTH FROM e.date_add) >= 9 THEN EXTRACT(MONTH FROM e.date_add)
                    ELSE EXTRACT(MONTH FROM e.date_add) + 12
                END
        `, [id_student, skill_name]);

        // Structure les données pour le frontend (mois universitaire : sept à juin)
        const monthsOrder = [9,10,11,12,1,2,3,4,5,6];
        const monthNames = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
            9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
        };
        const data = {};
        result.rows.forEach(row => {
            data[row.month.trim()] = parseFloat(row.moyenne) || 0;
        });
        // Génère un tableau ordonné pour le frontend
        const chartData = monthsOrder.map(m => ({
            month: monthNames[m],
            moyenne: data[monthNames[m]] || 0
        }));

        return chartData;
    } catch (error) {
        console.error("Erreur dans getSkillRatingByMonth", error);
        throw error;
    }
};


