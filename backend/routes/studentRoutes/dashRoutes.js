const express = require("express");
const router = express.Router();
const dashboard = require("../../controllers/studentControllers/dashController");

router.get("/nombre_projets/:id_student",dashboard.numberOfProdjects);
router.get("/signalreceived/:id_student",dashboard.signalReceived)
router.get("/moyenne/:id_student",dashboard.moyenneDansLaClasse);

module.exports = router;