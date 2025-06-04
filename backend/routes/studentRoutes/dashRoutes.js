const express = require("express");
const router = express.Router();
const dashboard = require("../../controllers/studentControllers/dashController");

router.get("/nombre_projets/:id_student",dashboard.numberOfProdjects);
router.get("/signalreceived/:id_student",dashboard.signalReceived)
router.get("/moyenne/:id_student",dashboard.moyenneDansLaClasse);
router.get("/evaluation_submitted/:id_student",dashboard.evaluationSubmitted);
router.get("/evaluation_assigned/:id_student",dashboard.evaluationAssigned);
router.get("/statisticsByclass/:id_student",dashboard.getRadarByClass);
router.get("/project/:id_student",dashboard.getProjects);
router.get("/statisticsByproject/:id_student",dashboard.getRadarByProject);
router.get("/graphe/:id_student",dashboard.getEvaluationCountByRoleAndMonth);
router.get("/skills", dashboard.getSkills);
router.get("/ratingskill/:id_student", dashboard.getSkillRatingByMonth);

module.exports = router;