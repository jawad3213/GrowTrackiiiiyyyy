const { pool } = require("../config/db");



exports.register = async (id_user,name,cin,email,pass,filier,group,note,role,cne) => {
    await pool.query(
        "INSERT INTO public.member(id_member,full_name,cin,email,password,role,description) VALUE($1,$2,$3,$4,$5,$6,$6)",
        [id_user,name,cin,email,pass,role,note]
    )
    const result = await pool.query(
        "INSERT INTO public.student(id_member,cne,filier,goupe) VALUE($1,$2,$3,$4)",
        [id_user,cne,filier,group]
    )
    return result.rows[0];
}