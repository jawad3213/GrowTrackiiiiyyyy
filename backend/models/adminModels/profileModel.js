const pool = require("../../config/db");


exports.getprofile = async(id_admin) => {
    try {
        const result = await pool.query(
            `SELECT m.profile_picture, m.full_name, m.phone, m.email, m.cin, m.role , a.assigned_zone
       FROM public.member m
       JOIN public.admin a ON m.id_member = a.id_member
       WHERE m.id_member = $1
       `,[id_admin]
        )
        return result.rows[0];
    }catch (error) {
        console.error("Error fetching admin:", error);
        throw error;
      }
}

// Mise à jour partielle d’un utilisateur (PATCH)
exports.updateAdminById = async (id, fieldsToUpdate) => {
    try {
      // 1. Séparation des champs
      const memberFields = {};
      const adminFields = {};
  
      for (const key in fieldsToUpdate) {
        const value = fieldsToUpdate[key];
        // Champs gérés dans public.member
        if ([
          "full_name",
          "cin",
          "email",
          "password",
          "role",
          "description",
          "profile_picture"
        ].includes(key)) {
          memberFields[key] = value;
  
        // Champ propre à admin
        } else if (key === "assigned_zone") {
          adminFields[key] = value;
        }
      }
  
      let updatedMember = null;
  
      // 2. Mise à jour de public.member
      if (Object.keys(memberFields).length > 0) {
        const keys   = Object.keys(memberFields);
        const values = Object.values(memberFields);
        const setClause = keys
          .map((k, i) => `${k} = $${i + 1}`)
          .join(", ");
        const query = `
          UPDATE public.member
          SET ${setClause}
          WHERE id_member = $${keys.length + 1}
          RETURNING *
        `;
        const result = await pool.query(query, [...values, id]);
        updatedMember = result.rows[0];
      }
  
      // 3. Mise à jour de public.admin
      if (Object.keys(adminFields).length > 0) {
        const keys   = Object.keys(adminFields);
        const values = Object.values(adminFields);
        const setClause = keys
          .map((k, i) => `${k} = $${i + 1}`)
          .join(", ");
        const query = `
          UPDATE public.admin
          SET ${setClause}
          WHERE id_member = $${keys.length + 1}
        `;
        await pool.query(query, [...values, id]);
      }
  
      // 4. Retourne le member mis à jour (s’il y en a un)
      return updatedMember;
    } catch (error) {
      console.error("Error updating admin:", error);
      throw error;
    }
  };
  