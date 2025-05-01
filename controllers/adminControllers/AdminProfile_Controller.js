const ProfileModel = require('../../models/adminModels/AdminProfile_Model.js');

exports.picture = [
    async (req, res) => {
        const id = req.user.id;
        const picture_URL = get ProfileModel.pictureModel(id)
    }
]