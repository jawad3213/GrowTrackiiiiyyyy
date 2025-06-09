const pool = require("../../config/db");

exports.createCoach = async (id_user,  name, cin, email, pass, field,note, role) => {
    try {
        // Insertion dans la table member
        const result = await pool.query(
            `INSERT INTO public.member (
               id_member, full_name, cin, email, password, role, description
             ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id_user, name, cin, email, pass, role, note]
        );

        // Insérer dans la table coach avec id_class et id_sector récupérés
        await pool.query(
            `INSERT INTO public.coach (
               id_member, field
             ) VALUES ($1, $2)`,
            [id_user, field]
        );

        return result.rows[0];

    } catch (error) {
        console.error("Error inserting coach:", error);
        throw error;
    }
};

exports.getAllCoach = async () => {
    try {
        const result = await pool.query(
            `SELECT m.id_member,m.cin, m.full_name, c.field, m.date_add
             FROM public.member m 
             JOIN public.coach c ON m.id_member = c.id_member `
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching coaches:", error);
        throw error;
    }
};



exports.getCoachByCin = async (cin) => {
    try {
        const result = await pool.query(
            `SELECT m.id_member, m.cin, m.full_name, c.field, m.date_add 
             FROM public.member m 
             JOIN public.coach c ON m.id_member = c.id_member 
             WHERE m.cin = $1`,
            [cin]
        );

        if (!result || result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error retrieving coach by CIN:", error);
        throw error;
    }
};

exports.updateCoachById = async (id, fieldsToUpdate) => {
    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);

    if (keys.length === 0) return null;

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE public.member SET ${setClause} WHERE id_member = $${keys.length + 1} RETURNING *`;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
};

exports.deleteCoachById = async (id) => {
    try {
        await pool.query("DELETE FROM public.coach WHERE id_member = $1", [id]);
        const result = await pool.query("DELETE FROM public.member WHERE id_member = $1", [id]);
        return result;
    } catch (error) {
        console.error("Error deleting coach:", error);
        throw error;
    }
};

exports.total = async () => {
    try {
        const result = await pool.query("SELECT COUNT(id_member) AS Total FROM public.coach");
        return result.rows[0];
    } catch (error) {
        console.error("Error retrieving coach count:", error);
        throw error;
    }
};



exports.getCoachById = async (id_member) => {
  try {
    const result = await pool.query(
      `SELECT 
         m.full_name, 
         m.cin, 
         c.field, 
         m.description AS note 
       FROM public.member m
       JOIN public.coach c ON m.id_member = c.id_member
       WHERE m.id_member = $1`,
      [id_member]
    );

    // Si on n'a aucun résultat, on renvoie null
    if (!result || result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving coach by id_member:", error);
    throw error;
  }
};