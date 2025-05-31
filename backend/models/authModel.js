const pool = require("../config/db");
const bcrypt = require('bcrypt');


exports.LoginModel = async (email, password) => {
    const result = await pool.query(
        "SELECT * FROM public.member WHERE email=$1",
        [email]
    );
    
    if (result.rows.length > 0) {
        const member = result.rows[0];
        const hashPass = /^\$2y\$/.test(member.password) ? '$2a$' + member.password.slice(4) : member.password;
        const IsPasswordValid = await bcrypt.compare(password, hashPass);
        if (IsPasswordValid) {
            return member;
        }
        
    }
    else return null; 
};

exports.FindUserByEmail =async (email)=>{
    const result = await pool.query("SELECT * FROM public.member WHERE email = $1",
        [email])
    if (result.rows.length > 0) {
        const member = result.rows[0];
        return member;    
    }
    else return null; 
    
}

exports.GetUserById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM public.member WHERE id_member = $1",
        [id]
    );

    if (result.rows.length > 0) {
        const member = result.rows[0];
        return member;    
    }
    else return null; 
}

exports.UpdatePassById = async (id_user, hashedPassword)=>{
    try {
        const result = await pool.query("SELECT * FROM public.member WHERE id_member=$1", [id_user]);
        if(result.rows.length > 0){
            const update = await pool.query("UPDATE public.member SET password=$1 WHERE id_member=$2 RETURNING *", [hashedPassword, id_user] )
            return update.rows[0];
        }
    } catch (error) {
        console.log(error);
    }
}

