const express = require("express");
const router = express.Router();
const AdminProfile = require('../../controllers/adminControllers/AdminProfile_Controller.js');
const {verifyToken}= require('../../middlewares/VerifyToken');
const verifyRole = require('../../middlewares/verificationRole');

router.use(verifyToken)

router.use(verifyRole("admin"))
//ne donne rien par front , id de jwt va passé directement a cette fonction , le lien est passé par back entant objet picture_URL
router.get('/picture',AdminProfile.picture_controller);

router.get('/personnal_information',AdminProfile.personnal_information_controller);

// module.exports = router;