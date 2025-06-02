const express = require("express");
const router = express.Router();
const DashController = require('../../controllers/adminControllers/AdminDashboardController.js');
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

 router.use(verifyToken)
 router.use(verifyRolee("admin"))

//fonction donne totalite des membres dans le mois
router.get('/Total_User', DashController.Total_User);
//fonction donne diifrenece entre user le mois avant et ce mois ci
router.get('/Stat_User',DashController.differenceUserController);


//total evaluation 
router.get('/Total_Evaluation',DashController.Total_Evaluation);
//fonction donne diifrenece entre evaluation le mois avant et ce mois ci
router.get('/Stat_Evaluation',DashController.differenceEvaluationController);


//user involvment rate
router.get('/Stat_Involvement',DashController.InvolvementController);
//target involvment
router.get('/Stat_Involvement_target',DashController.Involvement_target_Controller);



//signal annee actuelle
router.get('/flagged_evaluation',DashController.flagged_evaluation_Controller);

//compairson entre nombre des evaluations pour chaque mois entre les types user
router.get('/evaluation_source_overtime',DashController.evaluation_source_overtime_Controller);

//comapraison entre distribution des student-prof-supervisor
router.get('/user_distribution_by_role',DashController.user_distribution_by_role_Controller);

//news de table admin
router.get('/news_admin',DashController.news_admin_Controller);

//news de table prof
router.get('/news_prof',DashController.news_professor_Controller);

module.exports = router;