const express = require("express");
const router = express.Router();

// Tu peux intégrer ici des middlewares de validation si besoin
// const { validate_skill, validations, validate } = require("../../validations/adminValidation")

const skillController = require("../../controllers/adminControllers/skillController");

router.post("/create", skillController.createSkill);
router.get("/", skillController.getAllSkills);
router.patch("/:skill_name", skillController.updateSkill);
router.delete("/:skill_name", skillController.deleteSkill);
router.get("/total", skillController.getTotalSkills);

module.exports = router;
