const express = require('express');
const router = express.Router();
const  notification  = require('../../controllers/studentControllers/notifiController');

router.get("/all_notifications/:id_student",notification.allNotifications);


module.exports = router;