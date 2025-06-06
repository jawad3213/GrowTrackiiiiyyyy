const express = require ("express");
const router = express.Router();

const projectController = require("../../controllers/studentControllers/projectController");

router.get("/number_projects/:id_student", projectController.numberOfProdjects);

router.get("/all_projects/:id_student", projectController.getAllProjects);

router.get("/member_project/:id_student", projectController.getMemberProject);

router.post("/add_signal/:id_student", projectController.addSignal);

router.get("/skills", projectController.getSkillName);

router.post("/add_evaluation/:id_student", projectController.setEvalation);

// router.post("/evaluate/:id_student", projectController.setEvaluation);

module.exports = router;