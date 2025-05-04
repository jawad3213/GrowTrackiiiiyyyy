const express = require("express");
const router = express.Rourter();
const dashboard= require("../../controllers/profControllers/dashController")


router.get("/:id_prof",dashboard.getNumberOfClasses);
router.get("/:id_prof",dashboard.getNumberOfStudents);
router.get("/:id_prof",dashboard.getAllClasses);
// router.post("/signal");
// router.get("/nombredeclass");
// router.get("/nombredesetudiant");


module.exports= router;