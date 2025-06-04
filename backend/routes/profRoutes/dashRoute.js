const express = require("express");
const router = express.Router();
const dashboard= require("../../controllers/profControllers/dashController")
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("Professor"))

router.get("/classes/:id_prof",dashboard.getNumberOfClasses);
router.get("/students/:id_prof",dashboard.getNumberOfStudents);
router.get("/nameclass/:id_prof",dashboard.getAllClasses);
router.get("/graphe",dashboard.flaggedEvaluations);
router.get("/dailyevaluation",dashboard.dailyEvaluation);
router.get("/classement/:id_prof",dashboard.getTopStudentsByClass);
router.get("/profile/:id_prof",dashboard.getProfessorProfile);
router.get("/evaluationprof/:id_prof",dashboard.totalEvaluation);


module.exports= router;