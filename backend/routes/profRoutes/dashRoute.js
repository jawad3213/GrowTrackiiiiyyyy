const express = require("express");
const router = express.Rourter();
const dashboard= require("../../controllers/profControllers/dashController")


router.get("/class/:id_prof",dashboard.getNumberOfClasses);
// router.get("/class");
// router.post("/signal");
// router.get("/nombredeclass");
// router.get("/nombredesetudiant");


module.exports= router;