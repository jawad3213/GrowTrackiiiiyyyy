const express = require("express");
const router = express.Router();
const {validate_student, validations, validate} = require("../../validations/adminValidation")
const coachController = require("../../controllers/adminControllers/coachController")

const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("admin"))


router.post("/create", coachController.createCoach);
router.get("/", coachController.getAllCoach);
router.get("/search", coachController.getCoachByCin);
router.patch("/:id_coach", coachController.updateCoach);
router.delete("/:id_coach", coachController.deleteCoach);
router.get("/total", coachController.getTotalCoachs);

module.exports = router;
