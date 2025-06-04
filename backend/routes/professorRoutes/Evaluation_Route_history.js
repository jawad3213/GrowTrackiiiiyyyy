const express = require("express");
const router = express.Router();
const Evaluation_Controller = require('../../controllers/profController/Evaluation_Controller_history.js');
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("Professor"))

//affichage de tous les evaluations de ce prof 
router.get('/evaluation_all',Evaluation_Controller.all_evaluation_Controller);
//search par id evaluations dans les evaluations de ce prof
router.get('/search_by_id_evaluation/:id_evaluation',Evaluation_Controller.search_by_id_evaluation_Controller);
//filtre by level (sector)
router.get('/filter_by_level/:level',Evaluation_Controller.filter_by_level_Controller);
//filtre by class
router.get('/filter_by_class/:classe',Evaluation_Controller.filter_by_class_Controller);
//filtre by type
router.get('/filter_by_type/:type',Evaluation_Controller.filter_by_type_Controller);
//view_evaluation
router.get('/view_evaluation/:id_evaluation',Evaluation_Controller.view_evaluation_Controller);

module.exports = router;