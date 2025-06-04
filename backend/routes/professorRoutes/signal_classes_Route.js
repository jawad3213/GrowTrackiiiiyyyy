const express = require("express");
const router = express.Router();
const signal_Controller = require('../../controllers/profController/signal_classes_Controller.js');
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("Professor"))

//affichage de tous levels de ce prof 
router.get('/get_sector',signal_Controller.get_sector_Controller);

//affichage de tous les filieeres dans ce level de ce prof 
router.get('/get_classes/:id_sector',signal_Controller.get_classes_Controller);

//affichage de tous les etudiant
router.get('/get_student/:id_class',signal_Controller.get_student_Controller);

//search by cne
router.get('/get_student_cne/:id_class/:cne',signal_Controller.search_cne_student_Controller);

//filtre par qui a des signal ce mois ou non (Yes No )
router.get('/get_student_choice/:id_class/:choice',signal_Controller.filter_student_Controller);

//new signal
router.post('/new_signal/:id_student',signal_Controller.new_signal_Controller);

//signal history
router.get('/history_signal/:id_student',signal_Controller.signal_history_Controller);


module.exports = router;