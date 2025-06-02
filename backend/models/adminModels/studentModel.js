const pool = require("../../config/db");



exports.createStudent = async (id_user, full_name, cin, cne, email, pass, field, note, role,imagePath) => {
    try {
      // Insertion dans la table member
      const result = await pool.query(
        `INSERT INTO public.member (
           id_member, full_name, cin, email, password, role, description, profile_picture
         ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
        [id_user, full_name, cin, email, pass, role, note,imagePath]
      );
  
  
      // Insérer dans la table student avec id_class et id_sector récupérés
      await pool.query(
        `INSERT INTO public.student (
           id_member,cne, id_class
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
        `SELECT m.id_member, s.cne, m.full_name, m.cin, m.email, f.id_sector, m.profile_picture, c.id_class, m.date_add 
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class 
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
        `SELECT s.id_member, s.cne, m.full_name, m.cin, m.email, f.id_sector, m.profile_picture, c.id_class, m.date_add 
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class 
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
    try {
      // Cloner fieldsToUpdate pour éviter de modifier l'original
      const fields = { ...fieldsToUpdate };
  
      // Préparer les parties à mettre à jour dans chaque table
      const memberFields = {};
      const studentFields = {};
  
      // Séparer les champs selon leur table
      for (const key in fields) {
        if (["full_name", "cin", "email", "password", "role", "description", "profile_picture"].includes(key)) {
          memberFields[key] = fields[key];
        } else if (["cne", "id_class"].includes(key)) {
          studentFields[key] = fields[key];
        }
      }
  
      // Résultat final
      let updatedMember = null;
  
      // 1. Mise à jour de la table member s'il y a des champs à modifier
      if (Object.keys(memberFields).length > 0) {
        const memberKeys = Object.keys(memberFields);
        const memberValues = Object.values(memberFields);
  
        const setClauseMember = memberKeys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        const queryMember = `UPDATE public.member SET ${setClauseMember} WHERE id_member = $${memberKeys.length + 1} RETURNING *`;
  
        const result = await pool.query(queryMember, [...memberValues, id]);
        updatedMember = result.rows[0];
      }
  
      // 2. Mise à jour de la table student s'il y a des champs à modifier
      if (Object.keys(studentFields).length > 0) {
        const studentKeys = Object.keys(studentFields);
        const studentValues = Object.values(studentFields);
  
        const setClauseStudent = studentKeys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        const queryStudent = `UPDATE public.student SET ${setClauseStudent} WHERE id_member = $${studentKeys.length + 1}`;
  
        await pool.query(queryStudent, [...studentValues, id]);
      }
  
      return updatedMember; // on retourne seulement ce qu'on a mis à jour dans member (comme tu faisais avant)
      
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  };
  

exports.deleteStudentById = async (id) => {
    try {

      await pool.query(
        "DELETE FROM public.follow_up WHERE id_student = $1",
        [id]
      );

      await pool.query(
        "DELETE FROM public.report WHERE id_reported = $1",
        [id]
      );
      
      await pool.query(
        "DELETE FROM public.supervise WHERE id_student = $1",
        [id]
      );
      await pool.query(
        "DELETE FROM public.skill_evaluation WHERE id_student = $1",
        [id]
      );

      await pool.query(
        "DELETE FROM public.student WHERE id_member = $1",
        [id]
      );

      const result = await pool.query(
        "DELETE FROM public.member WHERE id_member = $1",
        [id]
      );
      return result;
       // Renvoie tout l'objet result pour avoir accès à rowCount
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
           f.id_sector, m.profile_picture,
           c.id_class
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class
         JOIN public.sector f ON f.id_sector = c.sector_id
         WHERE c.id_class = $1`,
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
           c.sector_id, m.profile_picture,
           c.id_class
         FROM public.member m 
         JOIN public.student s ON m.id_member = s.id_member 
         JOIN public.class c ON c.id_class = s.id_class 
         WHERE c.sector_id = $1`,
        [sector]
      );
  
      return result.rows;
  
    } catch (error) {
      console.error("Error retrieving students by sector:", error);
      throw error;
    }
  };
  
  
  
