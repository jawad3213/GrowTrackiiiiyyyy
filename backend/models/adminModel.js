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
  
