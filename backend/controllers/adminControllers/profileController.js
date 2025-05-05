const profileModel = require("../../models/adminModels/profileModel");

// Fonction pour générer l'URL complète de l'image
const generateImageUrl = (path) => {
    return path ? `http://localhost:8080/${path.replace(/\\/g, "/")}` : null;
  };

exports.profileadmin = async (req,res) => {
  const {id_admin } = req.params;
    try{
        const admin = await profileModel.getprofile(id_admin);

        // Ajouter l'URL complète pour chaque image
    const updatedadmin = {
        ...admin,
        profile_picture_url: generateImageUrl(admin.profile_picture),
      };

      return res.status(200).json({
        message: "admin retrieved successfully.",
        data: admin,
      });
    }catch (error) {
        console.error("Error retrieving admin:", error);
        return res.status(500).json({
          error: "Internal server error. Please try again later.",
     });
    
}
}

exports.updateAdmin = async (req, res) => {
  const userId = req.params.id_admin;
  const updates = req.body;

  console.log("ID :", userId);
  console.log("Données :", updates);

  try {
    const updatedUser = await profileModel.updateAdminById(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "admin not found or no fields provided." });
    }

    res.status(200).json({
      message: "Admin updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).json({ message: "Internal server error." });
  }
};