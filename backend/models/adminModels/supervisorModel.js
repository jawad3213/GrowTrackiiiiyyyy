const pool = require("../../config/db");

exports.createSupervisor = async (id_user, name, cin_sepervisor, email, pass, company, number, position, cin_student, name_internship, date_start, date_done, subject, note, role, imagePath) => {
  try {
    // Insert into the member table
    const result = await pool.query(
      `INSERT INTO public.member (
         id_member, full_name, cin, email, password, role, description, profile_picture
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id_user, name, cin_sepervisor, email, pass, role, note, imagePath]
    );

    // Insert into the supervisor table
    await pool.query(
      `INSERT INTO public.supervisor (
         id_member, registration_number, company, position
       ) VALUES ($1, $2, $3, $4) `,
      [id_user, number, company, position]
    );

    // Insert into the internship table
    const internship =await pool.query(
      `INSERT INTO public.internship (
          date_start, date_done, subject_internship
       ) VALUES ($1, $2, $3 ) RETURNING *`,
      [ date_start, date_done, subject]
    );

    // Retrieve the student id
    const student = await pool.query(
      `SELECT id_member FROM public.member WHERE cin = $1`,
      [cin_student]
    );

    // Insert into the supervise table
    await pool.query(
      `INSERT INTO public.supervise (
         id_supervisor, id_student, id_internship
       ) VALUES ($1, $2, $3)`,
      [id_user, student.rows[0].id_member, internship.rows[0].id_internship ]
    );

    return result.rows[0];

  } catch (error) {
    console.error("Error inserting supervisor:", error);
    throw error;
  }
};

exports.getAllSupervisors = async () => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add, m.profile_picture
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    throw error;
  }
};

exports.getSupervisorByCin = async (cin) => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add, m.profile_picture
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member
       WHERE m.cin = $1`,
      [cin]
    );

    if (!result || result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving supervisor:", error);
    throw error;
  }
};

exports.updateSupervisorById = async (id, fieldsToUpdate) => {
  try {
    const fields = { ...fieldsToUpdate };

    const memberFields = {};
    const supervisorFields = {};
    const internshipFields = {};

    // Séparer les champs selon la table
    for (const key in fields) {
      if (["full_name", "cin", "email", "password", "role", "description", "profile_picture"].includes(key)) {
        memberFields[key] = fields[key];
      } else if (["registration_number", "company", "position"].includes(key)) {
        supervisorFields[key] = fields[key];
      } else if (["date_start", "date_done", "subject_internship"].includes(key)) {
        internshipFields[key] = fields[key];
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

    // 2. Mise à jour table supervisor
    if (Object.keys(supervisorFields).length > 0) {
      const keys = Object.keys(supervisorFields);
      const values = Object.values(supervisorFields);

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const query = `UPDATE public.supervisor SET ${setClause} WHERE id_member = $${keys.length + 1}`;

      await pool.query(query, [...values, id]);
    }

    // 3. Mise à jour table internship
    if (Object.keys(internshipFields).length > 0 && fields.id_internship) {
      const keys = Object.keys(internshipFields);
      const values = Object.values(internshipFields);

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const query = `UPDATE public.internship SET ${setClause} WHERE id_internship = $${keys.length + 1}`;

      await pool.query(query, [...values, fields.id_internship]);
    }

    return updatedMember;

  } catch (error) {
    console.error("Error updating supervisor:", error);
    throw error;
  }
};


exports.deleteSupervisorById = async (id) => {
  try {
    await pool.query(
      "DELETE FROM public.supervise WHERE id_supervisor = $1",
      [id]
    );
    await pool.query(
      "DELETE FROM public.supervisor WHERE id_member = $1",
      [id]
    );
    const result = await pool.query(
      "DELETE FROM public.member WHERE id_member = $1",
      [id]
    );

    return result;
  } catch (error) {
    console.error("Error deleting supervisor:", error);
    throw error;
  }
};

exports.total = async () => {
  try {
    const result = await pool.query(
      "SELECT COUNT(id_member) AS total FROM public.supervisor"
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total number of supervisors:", error);
    throw error;
  }
};

exports.getSupervisorsByPosition = async (position) => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add, m.profile_picture
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member
       WHERE s.position = $1`,
      [position]
    );

    return result.rows;

  } catch (error) {
    console.error("Error retrieving supervisors by position:", error);
    throw error;
  }
};

exports.getSupervisorsByCompany = async (company) => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add, m.profile_picture
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member
       WHERE s.company = $1`,
      [company]
    );

    return result.rows;

  } catch (error) {
    console.error("Error retrieving supervisors by company:", error);
    throw error;
  }
};
