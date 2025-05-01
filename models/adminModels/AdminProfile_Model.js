const pool = require("../../config/db");

exports.pictureModel = async (id) => {
    const result = await pool.query(
        "SELECT profile_picture FROM public.member WHERE id=$1",
        [id]
      );      

    return {
        result
    };
};