const pool = require('../../config/db');

exports.getAllNotifications = async (id_student) => {
    try{
        const result = await pool.query(
            `SELECT id_notification, content_notification FROM public.notifications WHERE id_member = $1 ORDER BY date_notification DESC`,
            [id_student]
        )

        return result.rows;
    }catch (error) {
        console.error("Error retrieving notifications:", error);
        throw error;
    }}

exports.getDeatilsOfSolution = async (id_signal) => {
    try {
        const result = await pool.query(
            ``,
            [id_signal]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error retrieving solution details:", error);
        throw error;
    }
}
