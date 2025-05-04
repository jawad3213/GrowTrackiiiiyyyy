const pool =require("../../config/db");

exports.total = async (id_prof) => {
    try {
      const result = await pool.query(
        `SELECT COUNT(DISTINCT id_class) AS total
         FROM public.teach
         WHERE id_member = $1`,
        [id_prof]
      );
      if(!result.rows[0].length)return 0;
      // result.rows[0].total est une chaîne, on la convertit en entier
      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      console.error("Erreur dans total():", error);
      throw error;
    }
  };

exports.totalstudent = async (id_prof) =>{
    try{
        const result = await pool.query(
            `SELECT COUNT(DISTINCT s.id_member) as total
            FROM public.student s
            JOIN public.teach t ON t.id_class = s.id_class
            WHERE id_member = $1
            `,
            [id_prof]
        );
        if(!result.rows[0].length)return 0;
        return  parseInt(result.rows[0].total,10);
    }catch(error){
        console.error("error dans totalstudent", error);
        throw error;
    }
}

exports.classes = async (id) =>{
    try{
        const result = await pool.query(
            `SELECT id_class FROM public.teach WHERE id_member = $1`,[id]
        )
        return result.rows;
    }catch(error){
        console.error("erreur dans classes : ",error );
        throw error;
    }
}
  