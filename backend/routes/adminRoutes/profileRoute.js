const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/adminControllers/profileController");


router.get("/:id_admin",profileController.profileadmin);
router.patch("/:id_admin",profileController.updateAdmin);

module.exports = router;
