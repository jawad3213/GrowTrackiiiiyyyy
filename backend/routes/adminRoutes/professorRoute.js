const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../../validations/adminValidation")
const professorController = require("../../controllers/adminControllers/professorController")


router.post("/",professorController.createProfessor);
//,validate_student,validate
router.get("/",professorController.getAllProfessor);
router.get("/search",professorController.getProfessorByCin);
router.patch("/:id_professor",professorController.updateProfessor);
router.delete("/:id_professor",professorController.deleteProfessor);
router.get("/total",professorController.getTotalProfessors)
router.get("/class",professorController.getProfessorsByClass)
router.get("/sector",professorController.getProfessorsBySector)


module.exports = router;