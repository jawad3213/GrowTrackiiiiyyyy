const express = require("express");
const router = express.Router();
const contactusController = require('../controllers/contactusController');

router.post('/',contactusController.contactus);

module.exports = router;