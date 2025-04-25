const pool = require("../../config/db");

exports.createClass = async ( name, description, name_sector) => {
  try {
    const result = await pool.query(
      `INSERT INTO public.class (id_class, description, sector_id) VALUES ($1, $2, $3) RETURNING *`,
      [ name, description,name_sector]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting class:", error);
    throw error;
  }
};

exports.getAllClasses = async () => {
  try {
    const result = await pool.query(`SELECT * FROM public.class`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

exports.getClassByName = async (name) => {
  try {
    const result = await pool.query(
      `SELECT * FROM public.class WHERE id_class ILIKE $1`,
      [name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving class:", error);
    throw error;
  }
};

exports.updateClassById = async (id, updates) => {
  const keys = Object.keys(updates);
  const values = Object.values(updates);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE public.class SET ${setClause} WHERE id_class = $${keys.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

exports.deleteClassById = async (id) => {
  try {
    const result = await pool.query(`DELETE FROM public.class WHERE id_class = $1`, [id]);
    return result;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

exports.totalClasses = async () => {
  try {
    const result = await pool.query(`SELECT COUNT(*) AS total FROM public.class`);
    return result.rows[0];
  } catch (error) {
    console.error("Error counting classes:", error);
    throw error;
  }
};
