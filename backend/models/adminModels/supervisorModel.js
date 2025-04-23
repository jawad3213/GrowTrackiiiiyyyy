const pool = require("../../config/db");

exports.createSupervisor = async (id_user, name, cin_sepervisor, email, pass, company, number, position, cin_student, note, role) => {
  try {
    // Insert into the member table
    const result = await pool.query(
      `INSERT INTO public.member (
         id_member, full_name, cin, email, password, role, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_user, name, cin_sepervisor, email, pass, role, note]
    );

    const student = await pool.query(
      `SELECT id_member FROM public.member 
        WHERE cin = $1`,
        [cin_student]
    )


    // Insert into the supervisor table using the retrieved class ID
    await pool.query(
      `INSERT INTO public.supervisor (
         id_member, registration_number, company, position, id_student
       ) VALUES ($1, $2, $3, $4)`,
      [id_user, number,company, position,student.rows[0].id_member ]
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
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add 
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member `
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
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add 
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
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE public.member SET ${setClause} WHERE id_member = $${keys.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

exports.deleteSupervisorById = async (id) => {
  try {
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
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add 
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member  
       WHERE s.position = $1`,
      [position]
    );

    return result.rows;

  } catch (error) {
    console.error("Error retrieving supervisors by class:", error);
    throw error;
  }
};

exports.getSupervisorsByPosition = async (company) => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, s.registration_number, m.email, s.company, s.position, m.date_add 
       FROM public.member m 
       JOIN public.supervisor s ON m.id_member = s.id_member  
       WHERE s.company = $1`,
      [company]
    );

    return result.rows;

  } catch (error) {
    console.error("Error retrieving supervisors by sector:", error);
    throw error;
  }
};
