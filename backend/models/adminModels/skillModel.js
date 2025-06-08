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
      `SELECT *
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
  const query = `UPDATE public.skill SET ${setClause} WHERE skill_name = $${keys.length + 1} RETURNING *`;
  console.log(query)
  console.log(...values)
  console.log(id)
  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};
exports.deleteSkillById = async (skill_name) => {
  try {
    await pool.query(
      "DELETE FROM public.evaluations WHERE skill_name = $1",
      [skill_name]
    );
    const result = await pool.query(
      "DELETE FROM public.skill WHERE skill_name = $1",
      [skill_name]
    );

    return result;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

/*exports.total = async () => {
  try {
    const result = await pool.query(
      "SELECT COUNT(skill_name) AS total FROM public.skill"
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total number of skills:", error);
    throw error;
  }
};*/
exports.total = async () => {
  try {
    console.log('total function called');
    const result = await pool.query(
      "SELECT COUNT(skill_name) AS total FROM public.skill"
    );
    console.log('pool.query result:', result);
    console.log('result.rows:', result.rows);
    console.log('result.rows[0]:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving total number of skills:", error);
    throw error;
  }
};