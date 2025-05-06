const pool =require("../../config/db");

exports.total = async (id_prof) => {
    try {
      const result = await pool.query(
        `SELECT COUNT( id_class) AS total
         FROM public.teach
         WHERE id_member = $1`,
        [id_prof]
      );

      // 1) Si aucune ligne, on renvoie 0
    // if (result.rows.length === 0) {
    //   return 0;
    // }
    
      // result.rows[0].total est une chaîne, on la convertit en entier
      // parseInt(result.rows[0].total, 10);
      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      console.error("Erreur dans total():", error);
      throw error;
    }
  };

exports.totalstudent = async (id_prof) =>{
    try{
        const result = await pool.query(
            `SELECT COUNT(s.id_member) as total
            FROM public.student s
            JOIN public.teach t ON t.id_class = s.id_class
            WHERE t.id_member = $1
            `,
            [id_prof]
        );
        // if(!result.rows[0].length)return 0;
        return  parseInt(result.rows[0].total,10);
    }catch(error){
        console.error("error dans totalstudent", error);
        throw error;
    }
}

exports.classes = async (id) =>{
    try{
        const result = await pool.query(
            `SELECT id_class AS class FROM public.teach WHERE id_member = $1`,[id]
        )
        return result.rows;
    }catch(error){
        console.error("erreur dans classes : ",error );
        throw error;
    }
}
  
 exports.getGraphSignal = async (classe) =>{
     try{
         const result =await pool.query(
             `SELECT 
                COUNT(r.id_signal) AS TOTAL,
                TO_CHAR(date_trunc('month', s.date_add), 'YYYY-MM') AS month
              FROM
                public.class c
                JOIN public.student st ON c.id_class = st.id_class
                JOIN public.report r ON r.id_reporter = st.id_member
                JOIN public.signal s ON s.id_signal = r.id_signal
              WHERE 
                c.id_class = $1
              GROUP BY 2
              ORDER BY 2`,
              [classe]
         )
         return result.rows;
     }catch(error){
        console.error("erreur dans graphe",error);
        throw error;
     }
 }



 exports.getGraphEvaluation = async (classId, month) => {
    try {
      const result = await pool.query(
        `WITH days AS (
           SELECT generate_series(
             -- premier jour du mois
             make_date(
               EXTRACT(YEAR FROM CURRENT_DATE)::int,
               $2::int,
               1
             ),
             -- dernier jour du mois
             make_date(
               EXTRACT(YEAR FROM CURRENT_DATE)::int,
               $2::int,
               1
             ) + interval '1 month' - interval '1 day',
             '1 day'
           )::date AS day
         ),
         agg AS (
           SELECT
             date_trunc('day', date_add)::date AS day,
             COUNT(id_evaluation)::int              AS total
           FROM public.skill_evaluation
           WHERE id_class = $1
             AND EXTRACT(MONTH FROM date_add) = $2::int
             AND EXTRACT(YEAR  FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
           GROUP BY 1
         )
         SELECT
           to_char(days.day, 'MM-DD') AS day,
           COALESCE(agg.total, 0)      AS total
         FROM days
         LEFT JOIN agg USING(day)
         ORDER BY days.day;`,
        [classId, month]  // month est string, mais on le cast en SQL
      );
  
      return result.rows;
    } catch (error) {
      console.error("erreur dans graphe", error);
      throw error;
    }
  };
  

  exports.greatestAll = async (teacherId) => {
    try {
      // 1) Récupérer la liste des classes de ce prof
      const teachRes = await pool.query(
        `SELECT id_class
           FROM public.teach
          WHERE id_member = $1`,
        [teacherId]
      );
      console.log("▶▶▶ teahRes =", teachRes);
      const classIds = teachRes.rows.map(r => r.id_class);
      console.log("▶▶▶ classIds =", classIds);
      if (classIds.length === 0) {
        return []; // pas de classe → rien à afficher
      }
  
      // 2) Pour chaque classe, calculer la moyenne et numéroter par classement
      const sql = `
         SELECT m.full_name, s.cne, m.profile_picture, c.sector_id, c.id_class, AVG(e.note_evaluation)::numeric(10,2) AS average
             FROM  
                public.member m
                JOIN public.student s ON s.id_member= m.id_member 
                JOIN public.class c ON c.id_class = s.id_class
                JOIN public.skill_evaluation e ON e.id_student = s.id_member 
             WHERE 
                c.id_class = ANY($1)
                GROUP BY m.full_name, s.cne, m.profile_picture, c.sector_id, c.id_class
                ORDER BY average DESC
                LIMIT 7
      `;
  
      const result = await pool.query(sql, [classIds]);
      console.log("▶▶▶ result.rows =", result);
      return result.rows;
    } catch (error) {
      console.error("error dans greatestAll:", error);
      throw error;
    }
  };
  

exports.profile = async (id_prof) => {
    try{
        const result = await pool.query(
            `SELECT m.profile_picture, m.full_name, m.cin, m.email, p.code, p.department
                FROM public.member m
                JOIN public.professor p ON m.id_member = p.id_member 
                    WHERE m.id_member =  $1`,
                    [id_prof]
        )
        if(!result){
            return ("le prof n'existe pas !")
        }
        return result.rows[0];
    }catch(error){
        console.error("le probleme dans profile :",error);
        throw error;
    }
}

exports.totalEvaluation = async (id) => {
    try{
        const result = await pool.query(
            `SELECT COUNT(id_evaluation) AS "LES EVALUATIONS DE CE MOIS-CI" 
            FROM public.skill_evaluation 
             WHERE id_evaluator = $1
             AND date_add >= CURRENT_DATE - INTERVAL '1 MONTH' `,
             [id]
        )

        return result.rows[0];
    }catch(error){
        console.error("le probleme dans totalEvaluation :",error)
        throw error;
    }
}