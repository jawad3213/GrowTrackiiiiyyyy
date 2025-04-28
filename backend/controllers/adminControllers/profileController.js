const profileModel = require("../../models/adminModels/profileModel");

// Fonction pour générer l'URL complète de l'image
const generateImageUrl = (path) => {
    return path ? `http://localhost:8080/${path.replace(/\\/g, "/")}` : null;
  };

const profileadmin = async (req,res) => {
    try{
        const admins = await profileModel.getprofile();

        // Ajouter l'URL complète pour chaque image
    const updatedadmin = admins.map(admin => ({
        ...admin,
        profile_picture_url: generateImageUrl(admin.profile_picture),
      }));

      return res.status(200).json({
        message: "admin retrieved successfully.",
        data: updatedadmin,
      });
    }catch (error) {
        console.error("Error retrieving admin:", error);
        return res.status(500).json({
          error: "Internal server error. Please try again later.",
     });
    
}
}