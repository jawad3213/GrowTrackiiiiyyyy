const express = require("express");
const router = express.Router();
const AdminProfile = require('../../controllers/adminControllers/AdminProfile_Controller.js');

router.get('/picture',AdminProfile.picture);

module.exports = router;