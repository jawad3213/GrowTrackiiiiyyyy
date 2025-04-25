const express = require("express");
const router = express.Router();

const signalController = require("../../controllers/adminControllers/signalController");




router.get("/", signalController.getAllSignals);

router.get("/total", signalController.getTotalSignals);

router.get("/review/:id_signal", signalController.getSignalById);

router.post("/send-notification/:id_signal", signalController.sendSolution);

router.post("/rejected/:id_signal", signalController.deleteSignal);


module.exports = router;
