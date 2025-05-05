const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login',authController.Login);
router.post('/reset-password',authController.ResetPass);
router.post('/logout',authController.Logout);
router.post('/refresh',authController.RefreshToken);

module.exports = router;