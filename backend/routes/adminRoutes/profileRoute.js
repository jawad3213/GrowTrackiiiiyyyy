const express = require("express");
const router = express.Router();
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("admin"))

const profileController = require("../../controllers/adminControllers/profileController");


router.get("/:id_admin",profileController.profileadmin);
router.patch("/:id_admin",profileController.updateAdmin);

module.exports = router;