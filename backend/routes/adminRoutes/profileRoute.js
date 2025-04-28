const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/adminControllers/profileController");


router.get("/",profileController.profileadmin);

module.exports = router;
