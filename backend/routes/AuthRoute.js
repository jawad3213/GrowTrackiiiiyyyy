const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 10, // 10 requests per ip in the current window
    message: {
      status: 429,
      message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
  });


router.use(limiter);

router.post('/login',authController.Login);
router.post('/reset-password',authController.ResetPass);
router.post('/logout',authController.Logout);
router.post('/refresh',authController.RefreshToken);

module.exports = router;