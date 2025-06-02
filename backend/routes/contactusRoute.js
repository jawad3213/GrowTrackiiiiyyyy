const express = require("express");
const router = express.Router();
const contactusController = require('../controllers/contactusController');
const {contactUsSchema} = require('../validators/ContactUsRules')
const { validate } = require('../middlewares/validate');


router.post('/',validate(contactUsSchema) ,contactusController.contactus);

module.exports = router;