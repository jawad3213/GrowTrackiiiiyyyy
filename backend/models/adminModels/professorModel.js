const pool = require("../../config/db");



exports.createProfessor = async (id_user, name, cin, email, pass,departement, code, classe, note, role) => {
    try {
      // Insertion dans la table member
      const result = await pool.query(
        `INSERT INTO public.member (
           id_member, full_name, cin, email, password, role, description
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id_user, name, cin, email, pass, role, note]
      );
  
      // Récupérer id_class à partir du nom de classe
      const group = await pool.query(
        `SELECT id_class FROM public.class WHERE class_name = $1`,
        [classe]
      );
  
  
      // Insérer dans la table student avec id_class et id_sector récupérés
      await pool.query(
        `INSERT INTO public.professor (
           id_member, department, code, id_classe
         ) VALUES ($1, $2, $3, $4 )`,
        [id_user, departement, code, group.rows[0].id_class ]
      );
  
      return result.rows[0];
  
    } catch (error) {
      console.error("Error inserting professor:", error);
      throw error;
    }
  };
  


  exports.getAllProfessor = async () => { 
    try { 
      const result = await pool.query(
        `SELECT m.cin, m.full_name, p.code, m.email, p.department, c.class_name, m.date_add 
         FROM public.member m 
         JOIN public.professor p ON m.id_member = p.id_member 
         JOIN public.class c ON c.id_class = p.id_classe `
      );
      return result.rows;
    } catch(error) { 
      console.error("Error fetching professor:", error); 
      throw error; 
    } 
  }

exports.getProfessorByCin = async (cin) => {
    try {
      const result = await pool.query(
        `SELECT m.id_member, m.cin, m.full_name, p.code, m.email, p.department, c.class_name, m.date_add 
         FROM public.member m 
         JOIN public.professor p ON m.id_member = p.id_member 
         JOIN public.class c ON c.id_class = p.id_classe 
         WHERE m.cin = $1`,
         [cin]
      );
  
      if (!result || result.rows.length === 0) {
        return null;
      }
  
      return result.rows[0];
    } catch (error) {
      console.error("Error retrieving professor:", error);
      throw error;
    }
  };
  

// Mise à jour partielle d’un utilisateur (PATCH)
exports.updateProfessorById = async (id, fieldsToUpdate) => {
    //console.log("Appel modèle avec :", id, fields);

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
  
    if (keys.length === 0) return null;
  
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE public.member SET ${setClause} WHERE id_member = $${keys.length + 1} RETURNING *`;
  
    const result = await pool.query(query, [...values, id]);
    return result.rows[0]; // retourne l'utilisateur mis à jour
  };

exports.deleteProfessorById = async (id) => {
    try {

      await pool.query(
        "DELETE FROM public.professor WHERE id_member = $1",
        [id]
      );

      const result = await pool.query(
        "DELETE FROM public.member WHERE id_member = $1",
        [id]
      );
      
      return result; // Renvoie tout l'objet result pour avoir accès à rowCount
    } catch (error) {
      console.error("Error deleting professor:", error);
      throw error;
    }
  };

exports.total = async (req,res) => {
    try{
      const result = await pool.query(
        "SELECT COUNT(id_member) AS Total FROM public.professor "
      )
      return result.rows[0];
    }catch(error){
      console.error("Error deleting professor:",error);
      throw error;
    }
  }

exports.getProfessorsByClass = async (classe) => {
    try {
      const result = await pool.query(
        `SELECT 
           m.cin, 
           m.full_name, p.code, m.email, p.department,  
           c.class_name, m.date_add
         FROM public.member m 
         JOIN public.professor p ON m.id_member = p.id_member 
         JOIN public.class c ON c.id_class = p.id_classe 
         WHERE c.class_name = $1`,
        [classe]
      );
  
      return result.rows;
  
    } catch (error) {
      console.error("Error retrieving professors by class:", error);
      throw error;
    }
  };

  exports.getStudentsBySector = async (sector) => {
    try {
      const result = await pool.query(
        `SELECT 
           m.cin, 
           m.full_name, p.code, m.email, p.department,  
           c.class_name, m.date_add
         FROM public.member m 
         JOIN public.professor p ON m.id_member = p.id_member 
         JOIN public.class c ON c.id_class = p.id_classe 
         JOIN public.sector s ON s.id_sector = c.sector_id
         WHERE s.sector_name = $1`,
        [sector]
      );
  
      return result.rows;
  
    } catch (error) {
      console.error("Error retrieving professors by sector:", error);
      throw error;
    }
  };
  
  
  
