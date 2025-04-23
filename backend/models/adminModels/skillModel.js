const pool = require("../../config/db");

exports.createSkill = async (id_user, name, cin, email, pass, department, code, classe, note, role) => {
  try {
    const result = await pool.query(
      `INSERT INTO public.member (
         id_member, full_name, cin, email, password, role, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_user, name, cin, email, pass, role, note]
    );

    const group = await pool.query(
      `SELECT id_class FROM public.class WHERE class_name = $1`,
      [classe]
    );

    await pool.query(
      `INSERT INTO public.skill (
         id_member, department, code, id_classe
       ) VALUES ($1, $2, $3, $4)`,
      [id_user, department, code, group.rows[0].id_class]
    );

    return result.rows[0];

  } catch (error) {
    console.error("Error inserting skill:", error);
    throw error;
  }
};

exports.getAllSkills = async () => {
  try {
    const result = await pool.query(
      `SELECT m.cin, m.full_name, s.code, m.email, s.department, c.class_name, m.date_add 
       FROM public.member m 
       JOIN public.skill s ON m.id_member = s.id_member 
       JOIN public.class c ON c.id_class = s.id_classe`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};

exports.getSkillByCin = async (cin) => {
  try {
    const result = await pool.query(
      `SELECT m.id_member, m.cin, m.full_name, s.code, m.email, s.department, c.class_name, m.date_add 
       FROM public.member m 
       JOIN public.skill s ON m.id_member = s.id_member 
       JOIN public.class c ON c.id_class = s.id_classe 
       WHERE m.cin = $1`,
      [cin]
    );

    if (!result || result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving skill:", error);
    throw error;
  }
};

exports.updateSkillById = async (id, fieldsToUpdate) => {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE public.member SET ${setClause} WHERE id_member = $${keys.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

exports.deleteSkillById = async (id) => {
  try {
    await pool.query(
      "DELETE FROM public.skill WHERE id_member = $1",
      [id]
    );

    const result = await pool.query(
      "DELETE FROM public.member WHERE id_member = $1",
      [id]
    );

    return result;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

exports.total = async () => {
  try {
    const result = await pool.query(
      "SELECT COUNT(id_member) AS total FROM public.skill"
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total number of skills:", error);
    throw error;
  }
};

exports.getSkillsByClass = async (classe) => {
  try {
    const result = await pool.query(
      `SELECT 
         m.cin, m.full_name, s.code, m.email, s.department,  
         c.class_name, m.date_add
       FROM public.member m 
       JOIN public.skill s ON m.id_member = s.id_member 
       JOIN public.class c ON c.id_class = s.id_classe 
       WHERE c.class_name = $1`,
      [classe]
    );

    return result.rows;

  } catch (error) {
    console.error("Error retrieving skills by class:", error);
    throw error;
  }
};

exports.getSkillsBySector = async (sector) => {
  try {
    const result = await pool.query(
      `SELECT 
         m.cin, m.full_name, s.code, m.email, s.department,  
         c.class_name, m.date_add
       FROM public.member m 
       JOIN public.skill s ON m.id_member = s.id_member 
       JOIN public.class c ON c.id_class = s.id_classe 
       JOIN public.sector sec ON sec.id_sector = c.sector_id
       WHERE sec.sector_name = $1`,
      [sector]
    );

    return result.rows;

  } catch (error) {
    console.error("Error retrieving skills by sector:", error);
    throw error;
  }
};
