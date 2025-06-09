const express = require("express");
const router = express.Router();
const dashboard= require("../../controllers/profControllers/dashController")


router.get("/classes/:id_prof",dashboard.getNumberOfClasses); //done
router.get("/students/:id_prof",dashboard.getNumberOfStudents); //done
router.get("/nameclass/:id_prof",dashboard.getAllClasses);
router.get("/graphe",dashboard.flaggedEvaluations); //done
router.get("/dailyevaluation",dashboard.dailyEvaluation);  //done
router.get("/classement/:id_prof",dashboard.getTopStudentsByClass);
router.get("/profile/:id_prof",dashboard.getProfessorProfile);
router.get("/evaluationprof/:id_prof",dashboard.totalEvaluation);


module.exports= router; 