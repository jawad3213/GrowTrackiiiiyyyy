const express = require("express");
const router = express.Router();
const EvaluationController = require('../../controllers/adminControllers/GlobalOverView_Controller.js');

router.get('/number_of_evaluation_submitted',EvaluationController.number_of_evaluation_submitted_Controller);
router.get('/search_by_id_evaluation/:id_evaluation', EvaluationController.search_by_id_evaluation_Controller);
router.get('/filter_by_type/:type', EvaluationController.filter_by_type_Controller);
router.get('/all_evaluation', EvaluationController.all_evaluation_Controller);

module.exports = router;