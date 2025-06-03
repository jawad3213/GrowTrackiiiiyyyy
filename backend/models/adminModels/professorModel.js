const pool = require("../../config/db");

exports.createProfessor = async (id_user, name, cin, email, pass, departement, courses, code, classes, note, role, imagePath) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insertion dans la table member
    const result = await client.query(
      `INSERT INTO public.member (
         id_member, full_name, cin, email, password, role, description, profile_picture
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id_user, name, cin, email, pass, role, note, imagePath]
    );

    // Insertion dans la table professor
    await client.query(
      `INSERT INTO public.professor (
         id_member, department, code
       ) VALUES ($1, $2, $3)`,
      [id_user, departement, code]
    );

    // Insertion dans la table teach : 1 class + 1 course à chaque fois
    for (let i = 0; i < classes.length; i++) {
      const className = classes[i];
      const courseName = courses[i];

      await client.query(
        `INSERT INTO public.teach (
           id_member, id_class, course
         ) VALUES ($1, $2, $3)`,
        [id_user, className, courseName]
      );
    }

    await client.query('COMMIT');
    return result.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error inserting professor:", error);
    throw error;
  } finally {
    client.release();
  }
};



exports.getAllProfessor = async () => {
  try {
    const result = await pool.query(
      `SELECT m.id_member, m.cin, m.full_name, p.code, m.email, p.department, c.id_class, m.date_add, m.profile_picture
       FROM public.member m
       JOIN public.professor p ON m.id_member = p.id_member
       JOIN public.teach t ON p.id_member = t.id_member
       JOIN public.class c ON t.id_class = c.id_class`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching professors:", error);
    throw error;
  }
};

exports.getProfessorByCin = async (cin) => {
  try {
    const result = await pool.query(
      `SELECT m.id_member, m.cin, m.full_name, p.code, m.email, p.department, c.id_class, m.date_add, m.profile_picture
       FROM public.member m
       JOIN public.professor p ON m.id_member = p.id_member
       JOIN public.teach t ON p.id_member = t.id_member
       JOIN public.class c ON t.id_class = c.id_class
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
  try {
    const fields = { ...fieldsToUpdate };

    const memberFields = {};
    const professorFields = {};
    const teachFields = {};

    // Séparer les champs selon la table
    for (const key in fields) {
      if (["full_name", "cin", "email", "password", "role", "description", "profile_picture"].includes(key)) {
        memberFields[key] = fields[key];
      } else if (["department", "code"].includes(key)) {
        professorFields[key] = fields[key];
      } else if (["id_class", "course"].includes(key)) {
        teachFields[key] = fields[key];
      }
    }

    let updatedMember = null;

    // 1. Mise à jour table member
    if (Object.keys(memberFields).length > 0) {
      const keys = Object.keys(memberFields);
      const values = Object.values(memberFields);

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const query = `UPDATE public.member SET ${setClause} WHERE id_member = $${keys.length + 1} RETURNING *`;

      const result = await pool.query(query, [...values, id]);
      updatedMember = result.rows[0];
    }

    // 2. Mise à jour table professor
    if (Object.keys(professorFields).length > 0) {
      const keys = Object.keys(professorFields);
      const values = Object.values(professorFields);

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const query = `UPDATE public.professor SET ${setClause} WHERE id_member = $${keys.length + 1}`;

      await pool.query(query, [...values, id]);
    }

    // 3. Mise à jour table teach
    if (Object.keys(teachFields).length > 0) {
      const keys = Object.keys(teachFields);
      const values = Object.values(teachFields);

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const query = `UPDATE public.teach SET ${setClause} WHERE id_member = $${keys.length + 1}`;

      await pool.query(query, [...values, id]);
    }

    return updatedMember;

  } catch (error) {
    console.error("Error updating professor:", error);
    throw error;
  }
};


exports.deleteProfessorById = async (id) => {
  try {
    await pool.query(
      "DELETE FROM public.teach WHERE id_member = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM public.professor WHERE id_member = $1",
      [id]
    );

    const result = await pool.query(
      "DELETE FROM public.member WHERE id_member = $1",
      [id]
    );

    return result;
  } catch (error) {
    console.error("Error deleting professor:", error);
    throw error;
  }
};

exports.total = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(id_member) AS Total FROM public.professor"
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total professors:", error);
    throw error;
  }
};

exports.getProfessorsByClass = async (classe) => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, p.code, m.email, p.department, c.id_class, m.date_add, m.profile_picture
       FROM public.member m
       JOIN public.professor p ON m.id_member = p.id_member
       JOIN public.teach t ON p.id_member = t.id_member
       JOIN public.class c ON t.id_class = c.id_class
       WHERE c.id_class = $1`,
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
      `SELECT m.cin, m.full_name, p.code, m.email, p.department, c.id_class, m.date_add, m.profile_picture
       FROM public.member m
       JOIN public.professor p ON m.id_member = p.id_member
       JOIN public.teach t ON p.id_member = t.id_member
       JOIN public.class c ON t.id_class = c.id_class
       JOIN public.sector s ON c.sector_id = s.id_sector
       WHERE s.id_sector = $1`,
      [sector]
    );

    return result.rows;
  } catch (error) {
    console.error("Error retrieving professors by sector:", error);
    throw error;
  }
};
