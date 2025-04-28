const pool = require("../../config/db");


exports.getprofile = async() => {
    try {
        const result = await pool.qyuery(
            `SELECT m.profile_picture, m.full_name, m.phone, m.email, m.cin, m.role , a.assigned_zone
       FROM public.member m
       JOIN public.admin a ON m.id_member = a.id_member
       `
        )
        return result;
    }catch (error) {
        console.error("Error fetching admin:", error);
        throw error;
      }
}