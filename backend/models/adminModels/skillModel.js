const pool = require("../../config/db");

exports.createSkill = async (skill_name, question1, question2, question3,desciption_skill, id_admin) => {
  try {
    const result = await pool.query(
      `INSERT INTO public.skill (
         skill_name, question1, question2, question3,description_skill, id_admin
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [skill_name, question1, question2, question3,desciption_skill, id_admin]
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
      `SELECT skill_name, description_skill
       FROM public.skill`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching skills:", error);
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

    const result = await pool.query(
      "DELETE FROM public.skill WHERE id_member = $1",
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
      "SELECT COUNT(skill_name) AS total FROM public.skill"
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total number of skills:", error);
    throw error;
  }
};