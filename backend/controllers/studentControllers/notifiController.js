const notifiModel = require('../../models/studentModels/notifiModel');



exports.allNotifications = async (req, res) => {
    const { id_student } = req.params;
    try{
        const notifications = await notifiModel.getAllNotifications(id_student);
        res.status(200).json({
            success: true,
            data: notifications
        });

    }catch (error) {
        console.error("Error in allNotifications:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }}
    