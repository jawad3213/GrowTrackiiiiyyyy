const express = require("express");
const router = express.Router();
const history = require('../../controllers/studentController/signal_history_controller.js');
const {verifyToken}=require('../../middlewares/VerifyToken.js');

//all evaluations
router.get('/signal_history_all',verifyToken,history.signal_history_all_controller);

//all evaluations by id signal
router.get('/signal_history_search_id_all/:id_signal',verifyToken,history.signal_history_search_id_all_controller);

//all evaluations by module
router.get('/signal_history_search_module_all/:module',verifyToken,history.signal_history_search_module_all_controller);

//filtre selon signal state !!!!!! soit new soit approved !!!!!
router.get('/signal_history_filtre_statesignal_all/:state',verifyToken,history.signal_history_filtre_statesignal_all_controller);

//filtre selon signal state !!!!!! soit new soit approved !!!!!
router.get('/signal_history_filtre_solutionsignal_all/:state',verifyToken,history.signal_history_filtre_solutionsignal_all_controller);



module.exports = router;