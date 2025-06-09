const express = require("express");
const router = express.Router();
const history = require('../../controllers/studentController/evaluation_history_controller');
const {verifyToken}=require('../../middlewares/VerifyToken.js');
//all evaluations
router.get('/evaluation_history_all',verifyToken,history.evaluation_history_all_controller);

//search by evaluator_name
router.get('/evaluation_search_evaluator_name_history_all/:name',verifyToken,history.evaluation_history_search_controller);

//search by module_name
router.get('/evaluation_search_module_history_all/:module_name',verifyToken,history.evaluation_history_search_module_controller);

//search by module_name
router.get('/evaluation_search_project_history_all/:project_name',verifyToken,history.evaluation_history_search_project_controller);

module.exports = router;