const express = require("express");
const router = express.Router();
const signal_Controller = require('../../controllers/profController/signal_history_Controller.js');
const {verifyToken}=require('../../middlewares/VerifyToken.js');

//affichage de tous les evaluations de ce prof 
router.get('/all_signal',verifyToken,signal_Controller.all_signal_Controller);

// search by signal id
router.get('/search_signal_id/:id_signal',verifyToken,signal_Controller.search_signal_id_Controller);

// filtre par statut de statut signal
router.get('/filtre_signal_state/:statut',verifyToken,signal_Controller.filtre_signal_state_Controller);

// filtre par statut de statut solution
router.get('/filtre_solution_state/:statut',verifyToken,signal_Controller.filtre_solution_state_Controller);

//view solution
router.get('/view_solution/:id_signal',verifyToken,signal_Controller.view_solution_Controller);


module.exports = router;