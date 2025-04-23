const pool = require("../../config/db");



exports.createStudent = async (id_user, name, cin, cne, email, pass, field, note, role) => {
    try {
      // Insertion dans la table member
      const result = await pool.query(
        `INSERT INTO public.member (
           id_member, full_name, cin, email, password, role, description
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id_user, name, cin, email, pass, role, note]
      );
  
  
      // Insérer dans la table student avec id_class et id_sector récupérés
      await pool.query(
        `INSERT INTO public.student (
           id_member, id_classe
         ) VALUES ($1, $2, $3)`,
        [id_user, cne, field ]
      );
  
      return result.rows[0];
  
    } catch (error) {
      console.error("Error inserting student:", error);
      throw error;
    }
  };
  


  exports.getAllStudents = async () => { 
    try { 
      const result = await pool.query(
        `SELECT s.cne, m.full_name, m.cin, m.email, f.id_sector, c.id_class, m.date_add 
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_classe 
         JOIN public.sector f ON f.id_sector = c.sector_id`
      );
      return result.rows;
    } catch(error) { 
      console.error("Error fetching students:", error); 
      throw error; 
    } 
  }

exports.getStudentByCin = async (cin) => {
    try {
      const result = await pool.query(
        `SELECT s.id_member, s.cne, m.full_name, m.cin, m.email, f.sector_name, c.class_name, m.date_add 
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_classe 
         JOIN public.sector f ON f.id_sector = c.sector_id
         WHERE m.cin = $1`,
         [cin]
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
    //console.log("Appel modèle avec :", id, fields);

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
  
    if (keys.length === 0) return null;
  
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE public.member SET ${setClause} WHERE id_member = $${keys.length + 1} RETURNING *`;
  
    const result = await pool.query(query, [...values, id]);
    return result.rows[0]; // retourne l'utilisateur mis à jour
  };

exports.deleteStudentById = async (id) => {
    try {

      await pool.query(
        "DELETE FROM public.student WHERE id_member = $1",
        [id]
      );

      const result = await pool.query(
        "DELETE FROM public.member WHERE id_member = $1",
        [id]
      );
      
      return result; // Renvoie tout l'objet result pour avoir accès à rowCount
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

exports.total = async (req,res) => {
    try{
      const result = await pool.query(
        "SELECT COUNT(id_member) AS Total FROM public.student "
      )
      return result.rows[0];
    }catch(error){
      console.error("Error deleting student:",error);
      throw error;
    }
  }

exports.getStudentsByClass = async (classe) => {
    try {
      const result = await pool.query(
        `SELECT 
           s.id_member, s.cne, 
           m.full_name, m.cin, m.email, m.date_add, 
           f.sector_name, 
           c.class_name
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_classe 
         JOIN public.sector f ON f.id_sector = c.sector_id
         WHERE c.class_name = $1`,
        [classe]
      );
  
      return result.rows;
  
    } catch (error) {
      console.error("Error retrieving students by class:", error);
      throw error;
    }
  };

  exports.getStudentsBySector = async (sector) => {
    try {
      const result = await pool.query(
        `SELECT 
           s.id_member, s.cne, 
           m.full_name, m.cin, m.email, m.date_add, 
           f.sector_name, 
           c.class_name
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_classe 
         JOIN public.sector f ON f.id_sector = c.sector_id
         WHERE f.sector_name = $1`,
        [sector]
      );
  
      return result.rows;
  
    } catch (error) {
      console.error("Error retrieving students by sector:", error);
      throw error;
    }
  };
  
  
  
