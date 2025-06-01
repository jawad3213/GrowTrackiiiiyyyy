const express = require("express");
const router = express.Router();
const Evaluation_Controller = require('../../controllers/profController/Evaluation_Controller_history.js');
const {verifyToken}=require('../../middlewares/VerifyToken.js');

//affichage de tous les evaluations de ce prof 
router.get('/evaluation_all',verifyToken,Evaluation_Controller.all_evaluation_Controller);
//search par id evaluations dans les evaluations de ce prof
router.get('/search_by_id_evaluation/:id_evaluation',verifyToken,Evaluation_Controller.search_by_id_evaluation_Controller);
//filtre by level (sector)
router.get('/filter_by_level/:level',verifyToken,Evaluation_Controller.filter_by_level_Controller);
//filtre by class
router.get('/filter_by_class/:classe',verifyToken,Evaluation_Controller.filter_by_class_Controller);
//filtre by type
router.get('/filter_by_type/:type',verifyToken,Evaluation_Controller.filter_by_type_Controller);
//view_evaluation
router.get('/view_evaluation/:id_evaluation',Evaluation_Controller.view_evaluation_Controller);

module.exports = router;