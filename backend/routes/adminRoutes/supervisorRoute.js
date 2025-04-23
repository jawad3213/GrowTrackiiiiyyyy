const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../../validations/adminValidation")
const supervisorController = require("../../controllers/adminControllers/supervisorController")


router.post("/",supervisorController.createSupervisor);
//,validate_student,validate
router.get("/",supervisorController.getAllSupervisors);
router.get("/search",supervisorController.getSupervisorByCin);
router.patch("/:id_supervisor",supervisorController.updateSupervisor);
router.delete("/:id_supervisor",supervisorController.deleteSupervisor);
router.get("/total",supervisorController.getTotalSupervisors)
router.get("/class",supervisorController.getSupervisorsByClass)
router.get("/sector",supervisorController.getSupervisorsBySector)


module.exports = router;