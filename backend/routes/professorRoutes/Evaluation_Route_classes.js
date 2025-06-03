const express = require("express");
const router = express.Router();
const Evaluation_Controller = require('../../controllers/profController/Evaluation_Controller_classes.js');
const {verifyToken}=require('../../middlewares/VerifyToken.js');

//affichage de tous level de ce prof 
router.get('/get_sector',verifyToken,Evaluation_Controller.get_sector_Controller);

//affichage de tous les filieeres dans ce level de ce prof 
router.get('/get_classes/:id_sector',verifyToken,Evaluation_Controller.get_classes_Controller);

//get etudiant
router.get('/get_all_student/:id_class',verifyToken,Evaluation_Controller.get_all_student_Controller);

//get etudiant by cne
router.get('/search_by_student_cne/:cne/:id_class',verifyToken,Evaluation_Controller.search_by_student_cne_Controller);

//get etudiant by course status
router.get('/filtre_by_course_statut/:statut/:id_class',verifyToken,Evaluation_Controller.search_by_course_statut_Controller);

//get etudiant by course status
//router.get('/filtre_by_project_statut/:statut',verifyToken,Evaluation_Controller.search_by_project_statut_Controller);

//creation devaluation
router.post('/new_evaluation/:id_student',verifyToken,Evaluation_Controller.new_evaluation_Controller);

//get report
router.get('/view_report/:id_student',verifyToken,Evaluation_Controller.view_report_Controller);

module.exports = router;