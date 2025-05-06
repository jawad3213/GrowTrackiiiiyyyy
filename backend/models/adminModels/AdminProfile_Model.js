const pool = require("../../config/db");

exports.picture_model = async (id) => {
    const result = await pool.query(
        "SELECT profile_picture FROM public.member WHERE id_member=$1",
        [id]
      );      

    return result.rows[0]?.profile_picture || null;

};
/////////////
exports.personnal_information_model = async (id) => {
  const result = await pool.query(
    `SELECT p.full_name, p.email, p.phone, p.role, p.cin, f.assigned_zone
     FROM public.member p
     JOIN public.admin f ON p.id_member = f.id_member
     WHERE p.id_member = $1`,
    [id]
  );
  
  return result.rows[0] || null;
};
