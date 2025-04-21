const express = require("express");
const router = express.Router();
const {validations,validate} = require("../validations/adminValidation")
const adminController = require("../controllers/adminController")


router.post("/addstudent".validations,validate,adminController.addstudent)

module.exports = router;