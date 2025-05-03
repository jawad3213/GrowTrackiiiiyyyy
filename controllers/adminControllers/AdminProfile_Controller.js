const ProfileModel = require('../../models/adminModels/AdminProfile_Model.js');

exports.picture_controller = async (req, res) => {
      try {
        const id = req.user.id;
        
        const picture_URL = await ProfileModel.picture_model(id);
  
        if (picture_URL) {
          return res.status(200).json({ picture_URL });
        } else {
          return res.status(404).json({ message: "No picture url found for this id." });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};
/////////////////
exports.personnal_information_controller = async (req, res) => {
    try {
      const id = req.user.id;
      
      const personnal_information = await ProfileModel.personnal_information_model(id);

      if (personnal_information) {
        return res.status(200).json({ personnal_information });
      } else {
        return res.status(404).json({ message: "No data found for this id." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
};