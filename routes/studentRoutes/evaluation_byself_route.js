const express = require("express");
const router = express.Router();
const Evaluation_Controller = require('../../controllers/studentController/evaluation_byself_controller.js');
const {verifyToken}=require('../../middlewares/VerifyToken.js');

//creation devaluation
router.post('/new_evaluation',verifyToken,Evaluation_Controller.new_evaluation_Controller);

module.exports = router;