const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../validations/adminValidation")
const adminController = require("../controllers/adminController")


router.post("/addstudent",validate_student,validate,adminController.addstudent)

module.exports = router;