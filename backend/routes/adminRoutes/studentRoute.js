const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../../validations/adminValidation")
const studentController = require("../../controllers/adminControllers/studentController")


router.post("/",studentController.createStudent);
//,validate_student,validate
router.get("/",studentController.getAllStudents);
router.get("/search",studentController.getStudentByCin);
router.patch("/:id_student",studentController.updateStudent);
router.delete("/:id_student",studentController.deleteStudent);
router.get("/total",studentController.getTotalStudents)
router.get("/class",studentController.getStudentsByClass)
router.get("/sector",studentController.getStudentsBySector)


module.exports = router;