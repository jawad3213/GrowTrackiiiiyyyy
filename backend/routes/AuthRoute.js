const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const authRules = require('../validators/authrules');
const { validate } = require('../middlewares/validate');
const {Authlimiter} = require('../middlewares/Limiter');
const {verifyToken} = require('../middlewares/VerifyToken');

router.use(Authlimiter);

router.post('/login',validate(authRules.Login),authController.Login);
router.post('/reset-password',validate(authRules.Email),authController.ResetPass);
router.post('/logout',authController.Logout);
router.post('/refresh',authController.RefreshToken);
router.get('/check',verifyToken, authController.check);

module.exports = router;