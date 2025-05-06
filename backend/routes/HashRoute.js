const express = require("express");
const router = express.Router();
const HashController = require('../controllers/HashController.js');
router.post('/', HashController.hachage);


module.exports = router;
