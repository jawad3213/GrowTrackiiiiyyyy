const express = require("express");
const router = express.Router();

const profile = require("../../controllers/adminControllers/profileController");


router.get("/profile",profile.profileadmin);

module.exports = router;
