const express = require("express");
const router = express.Router();
const report_Controller = require('../../controllers/profController/student_report_Controller.js');
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("Professor"))
//rapport profile section 
router.get('/Profile_Section/:id',report_Controller.Profile_Section_Controller);

//rapport evaluation section 
router.get('/Evaluation_Section/:id',report_Controller.Evaluatuion_Section_Controller);

//rapport evaluation section 
router.get('/Signal_History/:id',report_Controller.Signal_History_Controller);

//comment section
router.get('/Comment_Section/:id',report_Controller.Comment_Section_Controller);

module.exports = router;