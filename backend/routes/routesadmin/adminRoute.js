const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../../validations/adminValidation")
const adminController = require("../../controllers/adminController")


router.post("/",validate_student,validate,adminController.createStudent);
router.get("/",adminController.getAllStudents);
router.get("/:id_student",adminController.getStudentById);
//router.put("/:id"adminController.updateStudent);
//router.delete("/:id"adminController.deleteStudent);

module.exports = router;