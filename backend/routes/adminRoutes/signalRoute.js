const express = require("express");
const router = express.Router();

const signalController = require("../../controllers/adminControllers/signalConroller");




router.get("/", signalController.getAllSignals);

router.get("/total", signalController.getTotalSignals);

router.get("/review/:id_signal", signalController.getSignalById);

router.post("/sendnotification/:id_signal", signalController.sendSolution);

router.post("/send_alert/:id_signal", signalController.sendAlert);

router.post("/rejected/:id_signal", signalController.deleteSignal);


module.exports = router;
