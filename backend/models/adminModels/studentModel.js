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
    console.log("Fields to update:", fieldsToUpdate);
    
    // Séparer les champs selon leur table
    for (const key in fields) {
      if (["full_name", "cin", "email", "password", "role", "description", "profile_picture"].includes(key)) {
        memberFields[key] = fields[key];
      } else if (["cne", "id_class"].includes(key)) {
        studentFields[key] = fields[key];
      }
    }
    
    console.log("Member fields:", memberFields);
    console.log("Student fields:", studentFields);
    
    // Résultat final
    let updatedMember = null;
    
    // 1. Mise à jour de la table member s'il y a des champs à modifier
    if (Object.keys(memberFields).length > 0) {
      const memberKeys = Object.keys(memberFields);
      const memberValues = Object.values(memberFields);
      
      const setClauseMember = memberKeys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const queryMember = `UPDATE public.member SET ${setClauseMember} WHERE id_member = $${memberKeys.length + 1} RETURNING *`;
      
      console.log("Member query:", queryMember);
      console.log("Member values:", [...memberValues, id]);
      
      const result = await pool.query(queryMember, [...memberValues, id]);
      updatedMember = result.rows[0];
      console.log("Updated member:", updatedMember);
    }
    
    // 2. Mise à jour de la table student s'il y a des champs à modifier
    if (Object.keys(studentFields).length > 0) {
      const studentKeys = Object.keys(studentFields);
      const studentValues = Object.values(studentFields);
      
      const setClauseStudent = studentKeys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const queryStudent = `UPDATE public.student SET ${setClauseStudent} WHERE id_member = $${studentKeys.length + 1}`;
      
      console.log("Student query:", queryStudent);
      console.log("Student values:", [...studentValues, id]);
      
      const studentResult = await pool.query(queryStudent, [...studentValues, id]);
      console.log("Student update result:", studentResult.rowCount, "rows affected");
      
      // Vérifier si la mise à jour a affecté des lignes
      if (studentResult.rowCount === 0) {
        console.warn(`No student record found with id_member = ${id}`);
      }
    }
    
    // Si on a mis à jour seulement les champs student, on peut récupérer les infos member
    if (!updatedMember && Object.keys(studentFields).length > 0) {
      const memberQuery = `SELECT * FROM public.member WHERE id_member = $1`;
      const memberResult = await pool.query(memberQuery, [id]);
      updatedMember = memberResult.rows[0];
    }
    
    return updatedMember;
    
  } catch (error) {
    console.error("Error updating student:", error);
    console.error("Error details:", error.message);
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
  
  // models/adminModels/studentModel.js


exports.deleteStudentById = async (id) => {
  const client = await pool.connect();
  try {
    // Démarre une transaction
    await client.query("BEGIN");

    // 1) Récupérer tous les id_evaluation liés au student dans skill_evaluation
    const { rows: evalRows } = await client.query(
      `SELECT id_evaluation
       FROM public.skill_evaluation
       WHERE id_student = $1`,
      [id]
    );

    // 2) Si on a des id_evaluation, supprimer d’abord les "enfants" dans evaluations
    if (evalRows.length > 0) {
      const ids = evalRows.map(row => row.id_evaluation);
      // Construire dynamiquement ($1, $2, $3, …)
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
      const deleteEvalChildrenQuery = `
        DELETE FROM public.evaluations
        WHERE id_evaluation IN (${placeholders})
      `;
      await client.query(deleteEvalChildrenQuery, ids);
    }

    // 3) Maintenant qu'il n'y a plus d'enfants dans evaluations, supprimer dans skill_evaluation
    await client.query(
      "DELETE FROM public.skill_evaluation WHERE id_student = $1",
      [id]
    );

    // 4) Supprimer dans team_student (s’il y a des références)
    await client.query(
      "DELETE FROM public.team_student WHERE student_id = $1",
      [id]
    );

    // 5) Supprimer dans supervise
    await client.query(
      "DELETE FROM public.supervise WHERE id_student = $1",
      [id]
    );

    // 6) Supprimer dans report
    await client.query(
      "DELETE FROM public.report WHERE id_reported = $1",
      [id]
    );

    // 7) Supprimer dans follow_up
    await client.query(
      "DELETE FROM public.follow_up WHERE id_student = $1",
      [id]
    );

    // 8) Supprimer dans student
    await client.query(
      "DELETE FROM public.student WHERE id_member = $1",
      [id]
    );

    // 9) Enfin, supprimer dans member
    const result = await client.query(
      "DELETE FROM public.member WHERE id_member = $1 RETURNING *",
      [id]
    );

    // Valide la transaction
    await client.query("COMMIT");
    return result; // contient rowCount, rows etc.
  } catch (error) {
    // En cas d'erreur, rollback
    await client.query("ROLLBACK");
    console.error("Error deleting student:", error);
    throw error;
  } finally {
    client.release();
  }
};

  
