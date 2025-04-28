const pool = require("../../config/db");


exports.createClass = async (field, description, classes, id_admin) => {
  const client = await pool.connect(); // Pour transaction
  try {
    await client.query('BEGIN'); // Commencer une transaction

    // 1. Insertion dans la table sector
    await client.query(
      `INSERT INTO public.sector (id_sector, sector_name, id_admin) VALUES ($1, $2, $3)`,
      [field, description, id_admin]
    );

    // 2. Insertion de chaque classe dans la table class
    for (const classe of classes) {
      await client.query(
        `INSERT INTO public.class (id_class, sector_id) VALUES ($1, $2)`,
        [classe, field]
      );
    }

    await client.query('COMMIT'); // Tout est bon, on valide
    return { message: "Sector and classes inserted successfully" };
  } catch (error) {
    await client.query('ROLLBACK'); // En cas d'erreur, on annule tout
    console.error("Error inserting class and sector:", error);
    throw error;
  } finally {
    client.release();
  }
};

//SI VOUS avez besoin des classes
exports.getAllSectors = async () => {
  try {
    const result = await pool.query(
      `SELECT 
         s.id_sector AS name_sector, 
         s.sector_name AS description, 
         COUNT(c.id_class) AS "number of classes"
       FROM public.sector s
       JOIN public.class c ON s.id_sector = c.sector_id
       GROUP BY s.id_sector, s.sector_name`
    );
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

exports.updateFieldById = async (id, updates) => {
  const keys = Object.keys(updates);
  const values = Object.values(updates);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE public.sector SET ${setClause} WHERE id_sector = $${keys.length + 1} RETURNING *`;

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
