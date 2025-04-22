const pool = require("../config/db");



exports.createStudent = async (id_user, name, cin, email, pass, filiere, group, note, role, cne) => {
  try {
    await pool.query(
      `INSERT INTO public.member (
         id_member, full_name, cin, email, password, role, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_user, name, cin, email, pass, role, note]
    );

    const result = await pool.query(
      `INSERT INTO public.student (
         id_member, cne, filiere, groupe
       ) VALUES ($1, $2, $3, $4)`,
      [id_user, cne, filiere, group]
    );

    return result.rows[0];

  } catch (error) {
    console.error("Error inserting student:", error);
    throw error; 
  }
};


exports.getAllStudents = async () =>{
    try {
        const result = await pool.query(
            "SELECT s.id_member, m.full_name, m.email FROM public.student s JOIN public.member m on m.id_member = s.id_member"
        )
    return result.rows;

    }catch(error){
        console.error("Error inserting student:", error);
        throw error; 
    }

}

exports.getStudentById = async (id_student) => {
    try {
      const result = await pool.query(
        "SELECT s.id_member, m.full_name, m.email FROM public.student s JOIN public.member m ON s.id_member = m.id_member WHERE m.id_member = $1",
        [id_student]
      );
  
      if (!result || result.rows.length === 0) {
        return null;
      }
  
      return result.rows[0];
    } catch (error) {
      console.error("Error retrieving student:", error);
      throw error;
    }
  };
  

// Mise à jour partielle d’un utilisateur (PATCH)
exports.updateStudentById = async (id, fieldsToUpdate) => {
    console.log("Appel modèle avec :", id, fields);
    
    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
  
    if (keys.length === 0) return null;
  
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE public.member SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
  
    const result = await pool.query(query, [...values, id]);
    return result.rows[0]; // retourne l'utilisateur mis à jour
  };
  
