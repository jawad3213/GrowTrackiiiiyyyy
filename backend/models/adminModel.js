const { pool } = require("../config/db");



exports.register = async (cin,phone,email,pass,name,classe) => {
    const result = pool.query(
        "INSERT INTO public.student(cin,phone,email,pass,name,classe) VALUE ($1,$2,$3,$4,$5,$6)",
        [cin,phone,email,pass,name,classe]
    )
    return result.rows[0];

}