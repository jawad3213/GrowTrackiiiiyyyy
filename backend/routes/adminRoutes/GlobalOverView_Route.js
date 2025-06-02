const express = require("express");
const router = express.Router();
const adminInputsRules = require('../../validators/adminInputsRules');
const { validate } = require('../../middlewares/validate');
const EvaluationController = require('../../controllers/adminControllers/GlobalOverView_Controller.js');
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken }=require('../../middlewares/VerifyToken')


router.use(verifyToken)
router.use(verifyRolee("admin"))

router.get('/number_of_evaluation_submitted',EvaluationController.number_of_evaluation_submitted_Controller);
router.get('/search_by_id_evaluation/:id_evaluation',validate(adminInputsRules.id_evaluation), EvaluationController.search_by_id_evaluation_Controller);
router.get('/filter_by_type/:type', validate(adminInputsRules.type), EvaluationController.filter_by_type_Controller);
router.get('/all_evaluation', EvaluationController.all_evaluation_Controller);

module.exports = router;